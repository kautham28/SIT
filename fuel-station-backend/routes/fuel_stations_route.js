const express = require('express');
const router = express.Router();
const db = require('../src/config/db');
const jwt = require('jsonwebtoken');
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

  const connection = await db.getConnection(); // Get a connection from the pool
  await connection.beginTransaction(); // Start a transaction

  try {
    // Insert into users table
    const userQuery =
      'INSERT INTO users (first_name, last_name, username, password, email, phone_number, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [userResult] = await connection.execute(userQuery, [
      firstName,
      lastName,
      username,
      password,
      email,
      phone,
      'fuel_station_owner', // Role is always 'fuel_station_owner'
    ]);

    // Insert into fuel_stations table
    const stationQuery =
      'INSERT INTO fuel_stations (station_name, location, owner_id) VALUES (?, ?, ?)';
    await connection.execute(stationQuery, [
      stationName,
      location,
      userResult.insertId, // Use the user ID as the owner_id
    ]);

    await connection.commit(); // Commit the transaction
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    await connection.rollback(); // Rollback the transaction in case of an error
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to register' });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

// Login route
// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Validate JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Check if the user exists in the database with the role 'fuel_station_owner'
    const query = `
      SELECT u.user_id, u.username, u.role, u.first_name, u.last_name, u.email, u.phone_number, fs.station_id
      FROM users u
      LEFT JOIN fuel_stations fs ON u.user_id = fs.owner_id
      WHERE u.username = ? AND u.password = ? AND u.role = ?
    `;
    const [rows] = await db.execute(query, [username, password, 'fuel_station_owner']);
    console.log('Database query result:', rows); // Debug log

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username, password, or insufficient permissions' });
    }

    // Generate a JWT token
    const user = rows[0];
    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        role: user.role,
        station_id: user.station_id, // Include station_id in the token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated token:', token); // Debug log

    // Prepare user data for response
    const userData = {
      id: user.user_id,
      username: user.username,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      station_id: user.station_id || null, // Include station_id if available
    };

    res.status(200).json({ message: 'Login successful', token, user: userData });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
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