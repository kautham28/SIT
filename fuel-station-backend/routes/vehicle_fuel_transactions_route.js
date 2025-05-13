const express = require('express');
const router = express.Router();
const db = require('../src/config/db'); // Import database connection
const authMiddleware = require('../middleware/stationauthmiddleware'); // Auth middleware

// Middleware to validate transaction data
const validateTransactionData = (req, res, next) => {
  const { vehicle_id, station_id, fuel_amount } = req.body;
  if (!vehicle_id || !station_id || !fuel_amount) {
    return res.status(400).json({ error: 'vehicle_id, station_id, and fuel_amount are required' });
  }
  if (fuel_amount <= 0 || fuel_amount > 999.99) {
    return res.status(400).json({ error: 'fuel_amount must be between 0.01 and 999.99' });
  }
  next();
};

// GET all transactions for authenticated station
router.get('/', authMiddleware, async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM vehicle_fuel_transactions WHERE station_id = ?',
      [req.user.station_id]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('GET /vehicle_fuel_transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a specific transaction by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    const connection = await db.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM vehicle_fuel_transactions WHERE transaction_id = ? AND station_id = ?',
      [id, req.user.station_id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(`GET /vehicle_fuel_transactions/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new transaction
router.post('/', authMiddleware, validateTransactionData, async (req, res) => {
  try {
    const { vehicle_id, station_id, fuel_amount } = req.body;
    if (station_id !== req.user.station_id) {
      return res.status(403).json({ error: 'Cannot create transaction for another station' });
    }

    const connection = await db.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO vehicle_fuel_transactions (vehicle_id, station_id, fuel_amount) VALUES (?, ?, ?)',
      [vehicle_id, station_id, fuel_amount]
    );
    connection.release();

    res.status(201).json({
      transaction_id: result.insertId,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid vehicle_id or station_id' });
    }
    console.error('POST /vehicle_fuel_transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT to update a transaction
router.put('/:id', authMiddleware, validateTransactionData, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    const { vehicle_id, station_id, fuel_amount } = req.body;
    if (station_id !== req.user.station_id) {
      return res.status(403).json({ error: 'Cannot update transaction for another station' });
    }

    const connection = await db.getConnection();
    const [result] = await connection.execute(
      'UPDATE vehicle_fuel_transactions SET vehicle_id = ?, station_id = ?, fuel_amount = ? WHERE transaction_id = ? AND station_id = ?',
      [vehicle_id, station_id, fuel_amount, id, req.user.station_id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid vehicle_id or station_id' });
    }
    console.error(`PUT /vehicle_fuel_transactions/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    const connection = await db.getConnection();
    const [result] = await connection.execute(
      'DELETE FROM vehicle_fuel_transactions WHERE transaction_id = ? AND station_id = ?',
      [id, req.user.station_id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(`DELETE /vehicle_fuel_transactions/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
