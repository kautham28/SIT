// db.js
const mysql = require('mysql2');
require('dotenv').config();  // Load environment variables from .env file

const pool = mysql.createPool({
  host: process.env.DB_HOST,  // Use environment variables
  user: process.env.DB_USER,  // Use environment variables
  password: process.env.DB_PASSWORD,  // Use environment variables
  database: process.env.DB_NAME,  // Use environment variables
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 10000,
  connectTimeout: 10000
});

const db = pool.promise(); // Enable promise-based queries

console.log('Connected to the MySQL database');

module.exports = db;
