const express = require('express');
const router = express.Router();
const db = require('../src/config/db');  // The database connection you defined

// 1. GET all fuel stations
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.station_id, s.station_name, s.location, s.owner_id 
      FROM fuel_stations s
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to retrieve fuel stations' });
  }
});

// 2. GET a fuel station by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM fuel_stations WHERE station_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Fuel station not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to retrieve fuel station' });
  }
});

// 3. POST a new fuel station
router.post('/', async (req, res) => {
  const { station_name, location, owner_id } = req.body;
  
  if (!station_name || !location) {
    return res.status(400).send({ message: 'Station name and location are required' });
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO fuel_stations (station_name, location, owner_id) VALUES (?, ?, ?)',
      [station_name, location, owner_id]
    );
    res.status(201).json({ 
      message: 'Fuel station created successfully', 
      station_id: result.insertId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to create fuel station' });
  }
});

// 4. PUT (Update) a fuel station by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { station_name, location, owner_id } = req.body;
  
  if (!station_name || !location) {
    return res.status(400).send({ message: 'Station name and location are required' });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE fuel_stations SET station_name = ?, location = ?, owner_id = ? WHERE station_id = ?',
      [station_name, location, owner_id, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Fuel station not found' });
    }
    
    res.status(200).json({ message: 'Fuel station updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update fuel station' });
  }
});

// 5. DELETE a fuel station by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM fuel_stations WHERE station_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Fuel station not found' });
    }
    
    res.status(200).json({ message: 'Fuel station deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to delete fuel station' });
  }
});

module.exports = router;
