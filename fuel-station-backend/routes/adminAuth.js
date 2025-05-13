// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../../fuel-station-backend/src/config/db.js');  // The database connection you defined
const jwt = require('jsonwebtoken');
// const verifyAdminToken = require('../middleware/adminauthmiddleware');

// Admin login route
router.post('/admin/login', async (req, res) => {
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

// // Protected admin dashboard route
// router.get('/admin/dashboard', verifyAdminToken, (req, res) => {
//   res.status(200).json({ 
//     message: 'Admin dashboard data', 
//     success: true,
//     admin: req.admin,
//     data: {
//       // Your dashboard data here
//     }
//   });
// });

// // Protected admin profile route
// router.get('/admin/profile', verifyAdminToken, (req, res) => {
//   const adminId = req.admin.id;
  
//   connection.query(
//     'SELECT id, username, First_name, Last_name, email, phone_number, role FROM users WHERE id = ?',
//     [adminId],
//     (err, results) => {
//       if (err) {
//         console.error('Error fetching admin profile:', err);
//         return res.status(500).json({ 
//           message: 'Server error fetching profile',
//           success: false 
//         });
//       }
      
//       if (results.length === 0) {
//         return res.status(404).json({ 
//           message: 'Admin profile not found',
//           success: false 
//         });
//       }
      
//       res.status(200).json({
//         message: 'Admin profile retrieved successfully',
//         success: true,
//         profile: results[0]
//       });
//     }
//   );
// });

// // Admin logout (client-side)
// router.post('/admin/logout', (req, res) => {
//   res.status(200).json({ 
//     message: 'Logout successful',
//     success: true 
//   });
//   // Note: Actual logout is handled on client by removing the token
// });


