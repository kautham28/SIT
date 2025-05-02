const express = require('express');
const router = express.Router();
const db = require('../src/config/db'); // Assuming you have a database connection module

// Get all vehicle categories
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT category_id, category_name, category_description FROM vehicle_categories';
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching vehicle categories:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle categories' });
  }
});

// Add a new vehicle category (POST)
router.post('/', async (req, res) => {
  const { category_name, category_description } = req.body;
  try {
    const query = 'INSERT INTO vehicle_categories (category_name, category_description) VALUES (?, ?)';
    const [result] = await db.execute(query, [category_name, category_description]);
    res.status(201).json({ message: 'Vehicle category added successfully', category_id: result.insertId });
  } catch (error) {
    console.error('Error adding vehicle category:', error);
    res.status(500).json({ error: 'Failed to add vehicle category' });
  }
});

// Update a vehicle category (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { category_name, category_description } = req.body;
  try {
    const query = 'UPDATE vehicle_categories SET category_name = ?, category_description = ? WHERE category_id = ?';
    const [result] = await db.execute(query, [category_name, category_description, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle category not found' });
    }
    res.status(200).json({ message: 'Vehicle category updated successfully' });
  } catch (error) {
    console.error('Error updating vehicle category:', error);
    res.status(500).json({ error: 'Failed to update vehicle category' });
  }
});

// Delete a vehicle category (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM vehicle_categories WHERE category_id = ?';
    const [result] = await db.execute(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle category not found' });
    }
    res.status(200).json({ message: 'Vehicle category deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle category:', error);
    res.status(500).json({ error: 'Failed to delete vehicle category' });
  }
});

module.exports = router;