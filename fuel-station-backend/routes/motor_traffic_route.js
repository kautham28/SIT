const express = require('express');
const router = express.Router();
const db = require('../src/config/db');

// Simple test route to verify the router is working
router.get('/test', (req, res) => {
  try {
    res.json({ message: 'Motor traffic route is working' });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a simple database test route
router.get('/db-test', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1 as test');
    res.json({ 
      message: 'Database connection is working', 
      data: result 
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// *** IMPORTANT: Specific routes must come BEFORE generic routes with path parameters ***

// Get DMV records by vehicle ID
router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT dmt.*, v.registration_number, CONCAT(u.First_name, ' ', u.Last_name) as owner_name
       FROM department_of_motor_traffic dmt
       LEFT JOIN vehicles v ON dmt.vehicle_id = v.vehicle_id
       LEFT JOIN users u ON dmt.owner_id = u.user_id
       WHERE dmt.vehicle_id = ?`,
      [req.params.vehicleId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error getting DMV records by vehicle ID:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve DMV records by vehicle ID', 
      error: error.message,
      vehicleId: req.params.vehicleId
    });
  }
});

// Get DMV records by owner ID
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT dmt.*, v.registration_number, CONCAT(u.First_name, ' ', u.Last_name) as owner_name
       FROM department_of_motor_traffic dmt
       LEFT JOIN vehicles v ON dmt.vehicle_id = v.vehicle_id
       LEFT JOIN users u ON dmt.owner_id = u.user_id
       WHERE dmt.owner_id = ?`,
      [req.params.ownerId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error getting DMV records by owner ID:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve DMV records by owner ID', 
      error: error.message,
      ownerId: req.params.ownerId
    });
  }
});

// Get all DMV records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT dmt.*, v.registration_number, CONCAT(u.First_name, ' ', u.Last_name) as owner_name
      FROM department_of_motor_traffic dmt
      LEFT JOIN vehicles v ON dmt.vehicle_id = v.vehicle_id
      LEFT JOIN users u ON dmt.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error getting all DMV records:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve DMV records', 
      error: error.message 
    });
  }
});

// Get DMV record by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT dmt.*, v.registration_number, CONCAT(u.First_name, ' ', u.Last_name) as owner_name
       FROM department_of_motor_traffic dmt
       LEFT JOIN vehicles v ON dmt.vehicle_id = v.vehicle_id
       LEFT JOIN users u ON dmt.owner_id = u.user_id
       WHERE dmt.dmv_id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        message: 'Record not found',
        dmvId: req.params.id 
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error getting DMV record by ID:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve DMV record', 
      error: error.message,
      dmvId: req.params.id
    });
  }
});

// Create new DMV record
router.post('/', async (req, res) => {
  try {
    console.log('POST request received to create DMV record');
    console.log('Request body:', req.body);
    
    const { vehicle_id, owner_id, registration_date, validity_status } = req.body;

    // Validate inputs
    if (!vehicle_id || !owner_id || !registration_date || !validity_status) {
      return res.status(400).json({ 
        message: 'All fields are required',
        received: req.body,
        missing: !vehicle_id ? 'vehicle_id' : 
                 !owner_id ? 'owner_id' : 
                 !registration_date ? 'registration_date' : 
                 !validity_status ? 'validity_status' : null
      });
    }

    // Check if vehicle exists
    try {
      const [vehicleCheck] = await db.query('SELECT * FROM vehicles WHERE vehicle_id = ?', [vehicle_id]);
      if (vehicleCheck.length === 0) {
        return res.status(404).json({ 
          message: 'Vehicle not found', 
          vehicle_id: vehicle_id 
        });
      }
    } catch (vehicleError) {
      console.error('Error checking vehicle:', vehicleError);
      return res.status(500).json({
        message: 'Error checking vehicle existence',
        error: vehicleError.message,
        vehicle_id: vehicle_id
      });
    }

    // Check if user exists
    try {
      const [userCheck] = await db.query('SELECT * FROM users WHERE user_id = ?', [owner_id]);
      if (userCheck.length === 0) {
        return res.status(404).json({ 
          message: 'User not found', 
          owner_id: owner_id 
        });
      }
    } catch (userError) {
      console.error('Error checking user:', userError);
      return res.status(500).json({
        message: 'Error checking user existence',
        error: userError.message,
        owner_id: owner_id
      });
    }

    // Insert record
    try {
      const [result] = await db.query(
        'INSERT INTO department_of_motor_traffic (vehicle_id, owner_id, registration_date, validity_status) VALUES (?, ?, ?, ?)',
        [vehicle_id, owner_id, registration_date, validity_status]
      );

      const [newRecord] = await db.query(
        'SELECT * FROM department_of_motor_traffic WHERE dmv_id = ?',
        [result.insertId]
      );

      res.status(201).json(newRecord[0]);
    } catch (insertError) {
      console.error('Error inserting DMV record:', insertError);
      return res.status(500).json({
        message: 'Failed to create DMV record',
        error: insertError.message,
        sqlState: insertError.sqlState,
        sqlMessage: insertError.sqlMessage
      });
    }
  } catch (error) {
    console.error('General error in POST DMV record:', error);
    res.status(500).json({ 
      message: 'Server error processing DMV record creation', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update DMV record
router.put('/:id', async (req, res) => {
  try {
    const { vehicle_id, owner_id, registration_date, validity_status } = req.body;
    const dmvId = req.params.id;

    console.log('PUT request received to update DMV record:', dmvId);
    console.log('Request body:', req.body);

    // Check if record exists
    const [recordCheck] = await db.query(
      'SELECT * FROM department_of_motor_traffic WHERE dmv_id = ?',
      [dmvId]
    );
    if (recordCheck.length === 0) {
      return res.status(404).json({ 
        message: 'Record not found',
        dmvId: dmvId
      });
    }

    // Validate required fields
    if (!vehicle_id || !owner_id || !registration_date || !validity_status) {
      return res.status(400).json({ 
        message: 'All fields are required',
        received: req.body,
        missing: !vehicle_id ? 'vehicle_id' : 
                 !owner_id ? 'owner_id' : 
                 !registration_date ? 'registration_date' : 
                 !validity_status ? 'validity_status' : null
      });
    }

    await db.query(
      'UPDATE department_of_motor_traffic SET vehicle_id = ?, owner_id = ?, registration_date = ?, validity_status = ? WHERE dmv_id = ?',
      [vehicle_id, owner_id, registration_date, validity_status, dmvId]
    );

    const [updatedRecord] = await db.query(
      'SELECT * FROM department_of_motor_traffic WHERE dmv_id = ?',
      [dmvId]
    );

    res.json(updatedRecord[0]);
  } catch (error) {
    console.error('Error updating DMV record:', error);
    res.status(500).json({ 
      message: 'Failed to update DMV record', 
      error: error.message,
      dmvId: req.params.id,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
  }
});

// Delete DMV record
router.delete('/:id', async (req, res) => {
  try {
    const dmvId = req.params.id;
    console.log('DELETE request received for DMV record:', dmvId);

    // Check if record exists
    const [recordCheck] = await db.query(
      'SELECT * FROM department_of_motor_traffic WHERE dmv_id = ?',
      [dmvId]
    );
    if (recordCheck.length === 0) {
      return res.status(404).json({ 
        message: 'Record not found',
        dmvId: dmvId
      });
    }

    await db.query(
      'DELETE FROM department_of_motor_traffic WHERE dmv_id = ?',
      [dmvId]
    );

    res.json({ 
      message: 'Record deleted successfully',
      dmvId: dmvId
    });
  } catch (error) {
    console.error('Error deleting DMV record:', error);
    res.status(500).json({ 
      message: 'Failed to delete DMV record', 
      error: error.message,
      dmvId: req.params.id,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
  }
});

module.exports = router;