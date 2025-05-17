const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

// Create database connection using the same approach as in your other files
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'kashinovi.M03',
  database: process.env.DB_NAME || 'sit_project'
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Regular user login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Query to find user
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
    
    db.query(query, [username, username], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      const user = results[0];
      
      // Verify password (assuming passwords are hashed with bcrypt)
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      // Create JWT token
      const token = jwt.sign(
        { 
          userId: user.user_id, 
          username: user.username, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'fuel-station-secret-key',
        { expiresIn: '1h' }
      );
      
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.user_id,
          username: user.username,
          firstName: user.First_name,
          lastName: user.Last_name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Vehicle owner login endpoint
router.post('/vehicle-login', async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;

    // Validate input
    if (!registrationNumber || !password) {
      return res.status(400).json({ 
        message: 'Please provide vehicle registration number and password' 
      });
    }

    console.log(`Attempting login for vehicle: ${registrationNumber}`);

    // Query to find vehicle and its owner
    const query = `
      SELECT u.*, v.registration_number, v.vehicle_id 
      FROM users u 
      JOIN vehicles v ON u.user_id = v.vehicle_owner_id 
      WHERE v.registration_number = ?
    `;
    
    db.query(query, [registrationNumber], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (results.length === 0) {
        console.log(`No vehicle found with registration number: ${registrationNumber}`);
        return res.status(401).json({ 
          success: false, 
          message: 'Vehicle not found or you are not the owner' 
        });
      }
      
      const user = results[0];
      console.log(`Vehicle found. Checking password for user: ${user.username}`);
      
      // Check if password is stored as plain text (temporary solution)
      if (password === user.password) {
        console.log('Plain text password matched');
        
        // Create JWT token
        const token = jwt.sign(
          { 
            userId: user.user_id, 
            username: user.username, 
            role: user.role,
            vehicleId: user.vehicle_id
          },
          process.env.JWT_SECRET || 'fuel-station-secret-key',
          { expiresIn: '1h' }
        );
        
        return res.status(200).json({
          success: true,
          token,
          user: {
            id: user.user_id,
            username: user.username,
            firstName: user.First_name,
            lastName: user.Last_name,
            role: user.role,
            vehicle: {
              id: user.vehicle_id,
              registrationNumber: user.registration_number
            }
          }
        });
      }

      try {
        // Verify password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`bcrypt comparison result: ${isMatch}`);
        
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
          { 
            userId: user.user_id, 
            username: user.username, 
            role: user.role,
            vehicleId: user.vehicle_id
          },
          process.env.JWT_SECRET || 'fuel-station-secret-key',
          { expiresIn: '1h' }
        );
        
        res.status(200).json({
          success: true,
          token,
          user: {
            id: user.user_id,
            username: user.username,
            firstName: user.First_name,
            lastName: user.Last_name,
            role: user.role,
            vehicle: {
              id: user.vehicle_id,
              registrationNumber: user.registration_number
            }
          }
        });
      } catch (bcryptError) {
        console.error('Password comparison error:', bcryptError);
        res.status(500).json({ success: false, message: 'Error verifying password' });
      }
    });
  } catch (error) {
    console.error('Vehicle login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
