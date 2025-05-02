const express = require('express');
const router = express.Router();
const db = require('../src/config/db');  // The database connection you defined

// 1. GET all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to retrieve users' });
  }
});

// 2. GET a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to retrieve user' });
  }
});

// 3. POST a new user
router.post('/', async (req, res) => {
  const { First_name, Last_name, username, password, role, email, phone_number } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO users (First_name, Last_name, username, password, role, email, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [First_name, Last_name, username, password, role, email, phone_number]
    );
    res.status(201).json({ message: 'User created successfully', user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to create user' });
  }
});

// 4. PUT (Update) a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { First_name, Last_name, username, password, role, email, phone_number } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE users SET First_name = ?, Last_name = ?, username = ?, password = ?, role = ?, email = ?, phone_number = ? WHERE user_id = ?',
      [First_name, Last_name, username, password, role, email, phone_number, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to update user' });
  }
});

// 5. DELETE a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to delete user' });
  }
});

module.exports = router;
