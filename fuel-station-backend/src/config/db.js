// db.js
const mysql = require('mysql2');
require('dotenv').config();  // Load environment variables from .env file

// Update the database connection configuration with correct credentials
// Check your MySQL setup and replace these values accordingly
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',  // Try with empty password if that's how your MySQL is configured
  database: process.env.DB_NAME || 'sit_project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise(); // Enable promise-based queries

console.log('Connected to the MySQL database');

module.exports = db;
