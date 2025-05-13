// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../../fuel-station-backend/src/config/db.js');  // The database connection you defined
const jwt = require('jsonwebtoken');
// const verifyAdminToken = require('../middleware/adminauthmiddleware');

// Admin login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required',
        success: false 
      });
    }
  
    try {
      // Query to find admin user with direct password comparison
      const [results] = await db.query(
        'SELECT * FROM users WHERE username = ? AND password = ? AND role = "admin"',
        [username, password]
      );
  
      // Check if admin exists and password matches
      if (results.length === 0) {
        return res.status(401).json({ 
          message: 'Invalid username or password',
          success: false 
        });
      }
  
      const admin = results[0];
  
      // Create JWT token
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );
  
      // Remove password from response
      const { password: _, ...adminData } = admin;
  
      // Send response
      res.status(200).json({
        message: 'Login successful',
        success: true,
        token,
        admin: adminData
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Server error',
        success: false 
      });
    }
  });

  module.exports = router;
