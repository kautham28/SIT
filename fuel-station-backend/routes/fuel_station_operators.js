const express = require('express');
const router = express.Router();
const db = require('../src/config/db');  // The database connection you defined

// 1. GET all fuel station operators
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM fuel_station_operators');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to retrieve fuel station operators' });
  }
});

// 2. GET a fuel station operator by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM sit_project.fuel_station_operators WHERE operator_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Fuel station operator not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to retrieve fuel station operator' });
  }
});

// 3. POST a new fuel station operator
router.post('/', async (req, res) => {
  const { station_id, user_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO sit_project.fuel_station_operators (station_id, user_id) VALUES (?, ?)',
      [station_id, user_id]
    );
    res.status(201).json({ message: 'Fuel station operator created successfully', operator_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to create fuel station operator' });
  }
});

// 4. PUT (Update) a fuel station operator by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { station_id, user_id } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE sit_project.fuel_station_operators SET station_id = ?, user_id = ? WHERE operator_id = ?',
      [station_id, user_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Fuel station operator not found' });
    }
    res.status(200).json({ message: 'Fuel station operator updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update fuel station operator' });
  }
});

// 5. DELETE a fuel station operator by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM sit_project.fuel_station_operators WHERE operator_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Fuel station operator not found' });
    }
    res.status(200).json({ message: 'Fuel station operator deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to delete fuel station operator' });
  }
});

module.exports = router;