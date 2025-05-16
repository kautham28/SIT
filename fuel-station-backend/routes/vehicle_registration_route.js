const express = require('express');
const router = express.Router();
const db = require('../src/config/db');

// Add a simple test endpoint at the top of the file
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

// Get all vehicle categories
router.get('/categories', async (req, res) => {
  try {
    console.log('Fetching all vehicle categories');
    
    const [categories] = await db.query(
      'SELECT category_id, category_name, category_description, fuel_quota FROM vehicle_categories ORDER BY category_name'
    );
    
    console.log('Categories found:', categories.length);
    
    // Always return 200 status, even if no categories found
    return res.status(200).json({
      success: true,
      message: categories.length > 0 ? 'Vehicle categories retrieved successfully' : 'No vehicle categories found',
      categories: categories || []
    });
    
  } catch (error) {
    console.error('Error retrieving vehicle categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vehicle categories',
      error: error.message
    });
  }
});

// Get vehicles by owner ID
router.get('/owner-vehicles/:ownerId', async (req, res) => {
  const ownerId = req.params.ownerId;
  
  if (!ownerId) {
    return res.status(400).json({
      success: false,
      message: 'Owner ID is required'
    });
  }
  
  try {
    const [vehicles] = await db.query(
      `SELECT v.vehicle_id, v.registration_number, v.chassis, 
              vc.category_id, vc.category_name, vc.fuel_quota
       FROM vehicles v
       JOIN vehicle_categories vc ON v.category_id = vc.category_id
       WHERE v.vehicle_owner_id = ?`,
      [ownerId]
    );
    
    console.log(`Found ${vehicles.length} vehicles for owner ${ownerId}`);
    
    return res.status(200).json({
      success: true,
      message: vehicles.length > 0 ? 'Vehicles retrieved successfully' : 'No vehicles found for this owner',
      vehicles: vehicles
    });
    
  } catch (error) {
    console.error('Error retrieving owner vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vehicles',
      error: error.message
    });
  }
});

// Get specific category by ID
router.get('/categories/:id', async (req, res) => {
  const categoryId = req.params.id;
  
  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: 'Category ID is required'
    });
  }
  
  try {
    const [category] = await db.query(
      'SELECT category_id, category_name, category_description, fuel_quota FROM vehicle_categories WHERE category_id = ?',
      [categoryId]
    );
    
    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Vehicle category retrieved successfully',
      category: category[0]
    });
    
  } catch (error) {
    console.error('Error retrieving vehicle category:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vehicle category',
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
  
  // NIC validation (basic format check for Sri Lankan NIC)
  const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
  if (!nicRegex.test(nic)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid NIC format' 
    });
  }
  
  // Phone number validation (basic format check for Sri Lankan phone numbers)
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
  
  // Basic vehicle number validation (format varies but should not be empty)
  if (vehicleNumber.trim().length < 4) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid vehicle number format' 
    });
  }
  
  // Basic chassis number validation (varies but should have minimum length)
  if (chassisNumber.trim().length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid chassis number format' 
    });
  }
  
  next();
};

// Validate vehicle details against Department of Motor Traffic database
router.post('/validate-vehicle', validateVehicleInfo, async (req, res) => {
  const { vehicleNumber, chassisNumber } = req.body;
  
  try {
    // Query DMT database to validate vehicle information
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
    
    // Vehicle found, return success response
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

// Register user only (first step)
router.post('/register-user', validatePersonalInfo, async (req, res) => {
  const { firstName, lastName, nic, password, mobile, address, email } = req.body;
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Check if user with NIC already exists
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
    
    // Generate username based on first name and NIC
    const username = `${firstName.toLowerCase()}_${nic.substring(0, 5)}`;
    
    // Insert user data
    const [userResult] = await connection.query(
      'INSERT INTO users (First_name, Last_name, username, password, role, email, phone_number, NIC_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, username, password, 'vehicle_owner', email || null, mobile, nic]
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

// Register vehicle only (second step)
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
    
    // Verify user exists
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
    
    // Verify vehicle in DMT
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
    
    // Get category ID and fuel quota based on vehicle type
    const [categories] = await connection.query(
      'SELECT category_id, fuel_quota FROM vehicle_categories WHERE category_name LIKE ?',
      [`%${vehicleType}%`]
    );
    
    let categoryId, fuelQuota;
    if (categories.length > 0) {
      categoryId = categories[0].category_id;
      fuelQuota = categories[0].fuel_quota;
    } else {
      // Default category if not found
      const [defaultCategory] = await connection.query(
        'SELECT category_id, fuel_quota FROM vehicle_categories LIMIT 1'
      );
      categoryId = defaultCategory.length > 0 ? defaultCategory[0].category_id : 1;
      fuelQuota = defaultCategory.length > 0 ? defaultCategory[0].fuel_quota : 20.00; // Default quota if not found
    }
    
    // Insert vehicle with fuel quota
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

// Complete registration (both user and vehicle in one request)
router.post('/register', async (req, res) => {
  // Skip the middleware and handle validation manually for better error messages
  const { 
    firstName, lastName, nic, password, mobile, address, email,
    vehicleNumber, vehicleType, chassisNumber, fuelType
  } = req.body;
  
  console.log('Received registration data:', {
    personal: { firstName, lastName, nic, mobile, address },
    vehicle: { vehicleNumber, vehicleType, chassisNumber, fuelType }
  });
  
  // Validate required fields
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
    
    // 1. Check DMT records - with more detailed error handling and logging
    console.log('Checking DMT records for vehicle:', vehicleNumber);
    const [dmt] = await connection.query(
      'SELECT * FROM department_of_motor_traffic WHERE vehicle_number = ?',
      [vehicleNumber]
    );
    
    console.log('DMT records found:', dmt.length);
    if (dmt.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found in DMT records'
      });
    }
    
    // 2. Register user
    console.log('Registering new user with NIC:', nic);
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE NIC_number = ?',
      [nic]
    );
    
    let userId;
    if (existingUsers.length > 0) {
      console.log('User with NIC already exists, using existing user');
      userId = existingUsers[0].user_id;
    } else {
      // Generate username based on first name and NIC
      const username = `${firstName.toLowerCase()}_${nic.substring(0, 5)}`;
      
      const [userResult] = await connection.query(
        'INSERT INTO users (First_name, Last_name, username, password, role, email, phone_number, NIC_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, username, password, 'vehicle_owner', email || null, mobile, nic]
      );
      
      userId = userResult.insertId;
      console.log('New user created with ID:', userId);
    }
    
    // 3. Get vehicle category
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
    
    // 4. Check if vehicle already exists
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
    
    // 5. Register vehicle - using the correct schema
    console.log('Registering new vehicle');
    const [vehicleResult] = await connection.query(
      'INSERT INTO vehicles (registration_number, chassis, vehicle_owner_id, category_id) VALUES (?, ?, ?, ?)',
      [vehicleNumber, chassisNumber, userId, categoryId]
    );
    
    console.log('Vehicle registered successfully with ID:', vehicleResult.insertId);
    
    await connection.commit();
    
    // Return the fuel quota from the category in the response
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
    
    // Provide specific error messages for common database errors
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

module.exports = router;
