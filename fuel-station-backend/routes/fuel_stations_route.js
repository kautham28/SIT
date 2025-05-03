const express = require('express');
const router = express.Router();
const db = require('../src/config/db'); // Adjust this path as necessary

// Get all fuel stations
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT station_id, station_name, location, owner_id FROM fuel_stations';
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching fuel stations:', error);
    res.status(500).json({ error: 'Failed to fetch fuel stations' });
  }
});

// Add a new fuel station
router.post('/', async (req, res) => {
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

// Update a fuel station
router.put('/:id', async (req, res) => {
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

// Delete a fuel station
router.delete('/:id', async (req, res) => {
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
