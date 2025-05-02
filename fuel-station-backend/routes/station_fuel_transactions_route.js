const express = require('express');
const router = express.Router();
const db = require('../src/config/db');  // The database connection you defined

// 1. GET all fuel transactions
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM station_fuel_transactions');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to retrieve fuel transactions' });
  }
});

// 2. GET a fuel transaction by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM station_fuel_transactions WHERE station_fuel_transaction_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Fuel transaction not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to retrieve fuel transaction' });
  }
});

// 3. POST a new fuel transaction
router.post('/', async (req, res) => {
  const { station_id, fuel_delivered } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO station_fuel_transactions (station_id, fuel_delivered) VALUES (?, ?)',
      [station_id, fuel_delivered]
    );
    res.status(201).json({ message: 'Fuel transaction created successfully', transaction_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to create fuel transaction' });
  }
});

// 4. PUT (Update) a fuel transaction by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { station_id, fuel_delivered } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE station_fuel_transactions SET station_id = ?, fuel_delivered = ? WHERE station_fuel_transaction_id = ?',
      [station_id, fuel_delivered, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Fuel transaction not found' });
    }
    res.status(200).json({ message: 'Fuel transaction updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update fuel transaction' });
  }
});

// 5. DELETE a fuel transaction by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM station_fuel_transactions WHERE station_fuel_transaction_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Fuel transaction not found' });
    }
    res.status(200).json({ message: 'Fuel transaction deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to delete fuel transaction' });
  }
});

module.exports = router;
