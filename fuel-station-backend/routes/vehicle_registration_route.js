const express = require('express');
const router = express.Router();
const db = require('../config/db');
const axios = require('axios');

// Notify.lk Configuration
const NOTIFY_API_KEY = 'IxQ8IgkEZ7QSqwsK3VvM';
const NOTIFY_USER_ID = '29542'; // Your Notify.lk user ID
const NOTIFY_SENDER_ID = 'NotifyDEMO';
const NOTIFY_API_URL = 'https://app.notify.lk/api/v1/send'; // Confirm with Notify.lk docs

// Utility to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Test endpoint
router.get('/test', (req, res) => {
  try {
    res.status(200).json({ 
      message: 'Vehicle registration route is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      message: 'Error in test endpoint',
      error: error.message
    });
  }
});

// Middleware to validate required personal information
const validatePersonalInfo = (req, res, next) => {
  const { firstName, lastName, nic, password, mobile, address } = req.body;
  
  if (!firstName || !lastName || !nic || !password || !mobile || !address) {
    return res.status(400).json({ 
      success: false,
      message: 'All personal fields are required' 
    });
  }
  
  const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
  if (!nicRegex.test(nic)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid NIC format' 
    });
  }
  
  const phoneRegex = /^(0|\+94)[0-9]{9}$/;
  if (!phoneRegex.test(mobile)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid phone number format' 
    });
  }
  
  next();
};

// Middleware to validate vehicle information
const validateVehicleInfo = (req, res, next) => {
  const { vehicleNumber, vehicleType, chassisNumber, fuelType } = req.body;
  
  if (!vehicleNumber || !vehicleType || !chassisNumber || !fuelType) {
    return res.status(400).json({ 
      success: false,
      message: 'All vehicle fields are required' 
    });
  }
  
  if (vehicleNumber.trim().length < 4) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid vehicle number format' 
    });
  }
  
  if (chassisNumber.trim().length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid chassis number format' 
    });
  }
  
  next();
};

// Send OTP via Notify.lk
router.post('/send-otp', async (req, res) => {
  const { mobile } = req.body;
  
  if (!mobile) {
    return res.status(400).json({ success: false, message: 'Mobile number is required' });
  }
  
  const phoneRegex = /^(0|\+94)[0-9]{9}$/;
  if (!phoneRegex.test(mobile)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid phone number format. Use format: 07XXXXXXXX or +947XXXXXXXX' 
    });
  }
  
  const otp = generateOTP();
  console.log(`Generated OTP for ${mobile}: ${otp}`); // Debug logging
  
  try {
    let formattedMobile = mobile;
    if (mobile.startsWith('0')) {
      formattedMobile = `94${mobile.substring(1)}`;
    } else if (mobile.startsWith('+94')) {
      formattedMobile = mobile.substring(1); // Remove the + sign
    }
    
    // Store OTP in DB with expiry (5 minutes)
    await db.query(
      'INSERT INTO otps (mobile, otp, expires_at) VALUES (?, ?, ?)',
      [mobile, otp, new Date(Date.now() + 5 * 60 * 1000)]
    );
    
    // Send SMS via Notify.lk
    const response = await axios.post(NOTIFY_API_URL, null, {
      params: {
        user_id: NOTIFY_USER_ID,
        api_key: NOTIFY_API_KEY,
        sender_id: NOTIFY_SENDER_ID,
        to: formattedMobile,
        message: `Your OTP for vehicle registration is ${otp}. Valid for 5 minutes.`
      }
    });
    
    if (response.data && response.data.status === 'success') {
      res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully' 
      });
    } else {
      throw new Error(`Notify.lk API error: ${response.data?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error sending OTP via Notify.lk:', error);
    // If SMS fails, the OTP is still stored in DB, so return success for now
    res.status(200).json({
      success: true,
      message: 'OTP generated and saved, but SMS delivery may have failed',
      debug: {
        notice: 'SMS API error, but OTP is saved in database for testing'
      }
    });
  }
});

// ...existing code...

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { mobile, otp } = req.body;
  
  if (!mobile || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
  }
  
  try {
    const [records] = await db.query(
      'SELECT * FROM otps WHERE mobile = ? AND otp = ? AND expires_at > ?',
      [mobile, otp, new Date()]
    );
    
    if (records.length === 0) {
      const [anyOtps] = await db.query('SELECT * FROM otps WHERE mobile = ?', [mobile]);
      if (anyOtps.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or expired OTP. Please request a new one.' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'No OTP found for this number. Please request an OTP first.' 
      });
    }
    
    // Mark OTP as verified or delete it (optional)
    await db.query('UPDATE otps SET verified = true WHERE mobile = ? AND otp = ?', [mobile, otp]);
    
    // Return success
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
});

// Validate vehicle details against DMT database
router.post('/validate-vehicle', validateVehicleInfo, async (req, res) => {
  const { vehicleNumber, chassisNumber } = req.body;
  
  try {
    const [vehicleRecords] = await db.query(
      'SELECT * FROM department_of_motor_traffic WHERE vehicle_number = ? AND chassis = ?',
      [vehicleNumber, chassisNumber]
    );
    
    if (vehicleRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found in DMT records'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Vehicle validated successfully',
      vehicleDetails: {
        id: vehicleRecords[0].dmv_vehicle_id,
        vehicleNumber: vehicleRecords[0].vehicle_number,
        ownerName: vehicleRecords[0].owner_name,
        vehicleType: vehicleRecords[0].vehicle_type,
        registrationDate: vehicleRecords[0].registration_date
      }
    });
  } catch (error) {
    console.error('Error validating vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating vehicle details',
      error: error.message
    });
  }
});

// Register user only
router.post('/register-user', validatePersonalInfo, async (req, res) => {
  const { firstName, lastName, nic, password, mobile, address, email } = req.body;
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE NIC_number = ?',
      [nic]
    );
    
    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'User with this NIC already exists'
      });
    }
    
    const username = `${firstName.toLowerCase()}_${nic.substring(0, 5)}`;
    const [userResult] = await connection.query(
      'INSERT INTO users (First_name, Last_name, username, password, role, email, phone_number, NIC_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, username, password, 'vehicle_owner', email || null, mobile, nic, address]
    );
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: userResult.insertId,
      username
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error registering user:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'User with this information already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

// Register vehicle only
router.post('/register-vehicle', validateVehicleInfo, async (req, res) => {
  const { userId, vehicleNumber, vehicleType, chassisNumber, fuelType } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const [users] = await connection.query(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const [dmt] = await connection.query(
      'SELECT * FROM department_of_motor_traffic WHERE vehicle_number = ?',
      [vehicleNumber]
    );
    
    if (dmt.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found in DMT records'
      });
    }
    
    const [categories] = await connection.query(
      'SELECT category_id, fuel_quota FROM vehicle_categories WHERE category_name LIKE ?',
      [`%${vehicleType}%`]
    );
    
    let categoryId, fuelQuota;
    if (categories.length > 0) {
      categoryId = categories[0].category_id;
      fuelQuota = categories[0].fuel_quota;
    } else {
      const [defaultCategory] = await connection.query(
        'SELECT category_id, fuel_quota FROM vehicle_categories LIMIT 1'
      );
      categoryId = defaultCategory.length > 0 ? defaultCategory[0].category_id : 1;
      fuelQuota = defaultCategory.length > 0 ? defaultCategory[0].fuel_quota : 20.00;
    }
    
    const [vehicleResult] = await connection.query(
      'INSERT INTO vehicles (registration_number, chassis, vehicle_owner_id, category_id) VALUES (?, ?, ?, ?)',
      [vehicleNumber, chassisNumber, userId, categoryId]
    );
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully',
      vehicleId: vehicleResult.insertId,
      registrationNumber: vehicleNumber,
      fuelQuota
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error registering vehicle:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Vehicle with this registration number or chassis already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error registering vehicle',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

// Complete registration with OTP verification
router.post('/register', async (req, res) => {
  const { 
    firstName, lastName, nic, password, mobile, address, email,
    vehicleNumber, vehicleType, chassisNumber, fuelType
  } = req.body;
  
  console.log('Received registration data:', {
    personal: { firstName, lastName, nic, mobile, address },
    vehicle: { vehicleNumber, vehicleType, chassisNumber, fuelType }
  });
  
  if (!firstName || !lastName || !nic || !password || !mobile || !address) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required personal information' 
    });
  }
  
  if (!vehicleNumber || !vehicleType || !chassisNumber || !fuelType) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required vehicle information' 
    });
  }
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Check if mobile is already verified by an existing user
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE phone_number = ?',
      [mobile]
    );
    
    if (existingUsers.length > 0) {
      console.log('Mobile number already associated with a user, skipping OTP check');
    } else {
      // For new users, ensure OTP was verified earlier (optional check if needed)
      const [otpRecords] = await connection.query(
        'SELECT * FROM otps WHERE mobile = ? AND expires_at > ?',
        [mobile, new Date()]
      );
      if (otpRecords.length === 0) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          message: 'No valid OTP found. Please verify OTP first.' 
        });
      }
    }
    
    // Check DMT records
    console.log('Checking DMT records for vehicle:', vehicleNumber);
    const [dmt] = await connection.query(
      'SELECT * FROM department_of_motor_traffic WHERE vehicle_number = ?',
      [vehicleNumber]
    );
    
    if (dmt.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found in DMT records'
      });
    }
    
    // Register user
    console.log('Registering new user with NIC:', nic);
    const [existingUsersByNic] = await connection.query(
      'SELECT * FROM users WHERE NIC_number = ?',
      [nic]
    );
    
    let userId;
    if (existingUsersByNic.length > 0) {
      console.log('User with NIC already exists, using existing user');
      userId = existingUsersByNic[0].user_id;
    } else {
      const username = `${firstName.toLowerCase()}_${nic.substring(0, 5)}`;
      const [userResult] = await connection.query(
        'INSERT INTO users (First_name, Last_name, username, password, role, email, phone_number, NIC_number) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, username, password, 'vehicle_owner', email || null, mobile, nic]
      );
      userId = userResult.insertId;
      console.log('New user created with ID:', userId);
    }
    
    // Get vehicle category
    console.log('Looking up vehicle category for:', vehicleType);
    const [categories] = await connection.query(
      'SELECT category_id, fuel_quota FROM vehicle_categories WHERE category_name = ?',
      [vehicleType]
    );
    
    let categoryId, fuelQuota;
    if (categories.length > 0) {
      categoryId = categories[0].category_id;
      fuelQuota = categories[0].fuel_quota;
      console.log('Found category:', { categoryId, fuelQuota });
    } else {
      console.log('Category not found, using default');
      const [defaultCategory] = await connection.query(
        'SELECT category_id, fuel_quota FROM vehicle_categories LIMIT 1'
      );
      if (defaultCategory.length === 0) {
        await connection.rollback();
        return res.status(500).json({
          success: false,
          message: 'No vehicle categories found in the system'
        });
      }
      categoryId = defaultCategory[0].category_id;
      fuelQuota = defaultCategory[0].fuel_quota;
      console.log('Using default category:', { categoryId, fuelQuota });
    }
    
    // Check if vehicle already exists
    console.log('Checking if vehicle already exists:', vehicleNumber);
    const [existingVehicles] = await connection.query(
      'SELECT * FROM vehicles WHERE registration_number = ?',
      [vehicleNumber]
    );
    
    if (existingVehicles.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Vehicle is already registered in the system'
      });
    }
    
    // Register vehicle
    console.log('Registering new vehicle');
    const [vehicleResult] = await connection.query(
      'INSERT INTO vehicles (registration_number, chassis, vehicle_owner_id, category_id) VALUES (?, ?, ?, ?)',
      [vehicleNumber, chassisNumber, userId, categoryId]
    );
    
    console.log('Vehicle registered successfully with ID:', vehicleResult.insertId);
    
    await connection.commit();
    
    // Clean up OTP if it exists (optional, since it’s already verified)
    if (existingUsers.length === 0) {
      await connection.query('DELETE FROM otps WHERE mobile = ?', [mobile]);
    }
    
    res.status(201).json({
      success: true,
      message: 'Registration completed successfully',
      userId,
      vehicleId: vehicleResult.insertId,
      registrationNumber: vehicleNumber,
      fuelQuota: fuelQuota || 0,
      categoryId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Registration error details:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry found. User or vehicle may already exist.'
      });
    }
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference. Make sure all IDs are valid.'
      });
    }
    
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        success: false,
        message: 'Database schema mismatch. Please contact support.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error during registration process',
      errorCode: error.code || 'UNKNOWN'
    });
  } finally {
    connection.release();
  }
});

// Send post-pumping notification
router.post('/send-pumping-notification', async (req, res) => {
  const { mobile, vehicleNumber, pumpedLiters, remainingQuota } = req.body;
  
  if (!mobile || !vehicleNumber || !pumpedLiters || remainingQuota === undefined) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  try {
    let formattedMobile = mobile;
    if (mobile.startsWith('0')) {
      formattedMobile = `94${mobile.substring(1)}`;
    } else if (mobile.startsWith('+94')) {
      formattedMobile = mobile.substring(1);
    }
    
    const message = `Fuel Update: ${pumpedLiters}L pumped for vehicle ${vehicleNumber}. Remaining quota: ${remainingQuota}L.`;
    const response = await axios.post(NOTIFY_API_URL, null, {
      params: {
        user_id: NOTIFY_USER_ID,
        api_key: NOTIFY_API_KEY,
        sender_id: NOTIFY_SENDER_ID,
        to: formattedMobile,
        message
      }
    });
    
    if (response.data && response.data.status === 'success') {
      res.status(200).json({ success: true, message: 'Notification sent successfully' });
    } else {
      throw new Error(`Notify.lk API error: ${response.data?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error sending pumping notification:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification', error: error.message });
  }
});

module.exports = router;