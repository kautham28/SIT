const express = require('express');
const router = express.Router();
const db = require('../src/config/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    // Check if the user has the correct role
    if (user.role !== 'fuel_station_owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    req.user = user; // Attach user info to the request
    next();
  });
};

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'thujathaponnuthurai@gmail.com',
    pass: 'wghcxvvvujzpcvdv',
  },
  timeout: 60000,
});

// Function to generate a 6-digit code
const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Registration route
router.post('/register', async (req, res) => {
  const {
    firstName,
    lastName,
    stationName,
    location,
    username,
    password,
    email,
    phone,
  } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const userQuery =
      'INSERT INTO users (first_name, last_name, username, password, email, phone_number, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [userResult] = await connection.execute(userQuery, [
      firstName,
      lastName,
      username,
      password,
      email,
      phone,
      'fuel_station_owner',
    ]);

    const stationQuery =
      'INSERT INTO fuel_stations (station_name, location, owner_id) VALUES (?, ?, ?)';
    await connection.execute(stationQuery, [
      stationName,
      location,
      userResult.insertId,
    ]);

    await connection.commit();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    await connection.rollback();
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to register' });
  } finally {
    connection.release();
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const query = `
      SELECT u.user_id, u.username, u.role, u.first_name, u.last_name, u.email, u.phone_number, fs.station_id
      FROM users u
      LEFT JOIN fuel_stations fs ON u.user_id = fs.owner_id
      WHERE u.username = ? AND u.password = ? AND u.role = ?
    `;
    const [rows] = await db.execute(query, [username, password, 'fuel_station_owner']);
    console.log('Database query result:', rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username, password, or insufficient permissions' });
    }

    const user = rows[0];
    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        role: user.role,
        station_id: user.station_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated token:', token);

    const userData = {
      id: user.user_id,
      username: user.username,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      station_id: user.station_id || null,
    };

    res.status(200).json({ message: 'Login successful', token, user: userData });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received email for password reset:', email);

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'fuel_station_owner']);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No fuel station owner found with this email' });
    }

    const resetCode = generateSixDigitCode();
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await db.query(
      'UPDATE users SET reset_code = ?, reset_token_expires = ? WHERE email = ?',
      [resetCode, resetTokenExpiry, email]
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?code=${resetCode}&email=${email}`;

    const mailOptions = {
      from: 'thujathaponnuthurai@gmail.com',
      to: email,
      subject: 'Fuel Station Password Reset Request',
      text: `You requested a password reset for your fuel station account. Use the following code to reset your password:\n\nCode: ${resetCode}\n\nAlternatively, click the link below:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `<p>You requested a password reset for your fuel station account. Use the following code to reset your password:</p><p><strong>Code: ${resetCode}</strong></p><p>Alternatively, click the link below:</p><p><a href="${resetUrl}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'A reset code has been sent to your email' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Internal server error. Please try again' });
  }
});

// Verify Reset Code Route
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and code are required' });
    }

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_token_expires > NOW() AND role = ?',
      [email, code, 'fuel_station_owner']
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or expired code' });
    }

    res.status(200).json({ success: true, message: 'Code verified successfully', code });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, code, and new password are required' });
    }

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_token_expires > NOW() AND role = ?',
      [email, code, 'fuel_station_owner']
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or expired code' });
    }

    await db.query(
      'UPDATE users SET password = ?, reset_code = NULL, reset_token_expires = NULL WHERE email = ?',
      [newPassword, email]
    );

    console.log('Password updated successfully for email:', email);

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
});

// Get all fuel stations (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT station_id, station_name, location, owner_id FROM fuel_stations';
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching fuel stations:', error);
    res.status(500).json({ error: 'Failed to fetch fuel stations' });
  }
});

// Add a new fuel station (protected)
router.post('/', authenticateToken, async (req, res) => {
  const { station_name, location, owner_id } = req.body;
  try {
    const query = 'INSERT INTO fuel_stations (station_name, location, owner_id) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [station_name, location, owner_id]);
    res.status(201).json({ message: 'Fuel station added successfully', station_id: result.insertId });
  } catch (error) {
    console.error('Error adding fuel station:', error);
    res.status(500).json({ error: 'Failed to add fuel station' });
  }
});

// Update a fuel station (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { station_name, location, owner_id } = req.body;
  try {
    const query = 'UPDATE fuel_stations SET station_name = ?, location = ?, owner_id = ? WHERE station_id = ?';
    const [result] = await db.execute(query, [station_name, location, owner_id, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fuel station not found' });
    }
    res.status(200).json({ message: 'Fuel station updated successfully' });
  } catch (error) {
    console.error('Error updating fuel station:', error);
    res.status(500).json({ error: 'Failed to update fuel station' });
  }
});

// Delete a fuel station (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM fuel_stations WHERE station_id = ?';
    const [result] = await db.execute(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fuel station not found' });
    }
    res.status(200).json({ message: 'Fuel station deleted successfully' });
  } catch (error) {
    console.error('Error deleting fuel station:', error);
    res.status(500).json({ error: 'Failed to delete fuel station' });
  }
});

module.exports = router;