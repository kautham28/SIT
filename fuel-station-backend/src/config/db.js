const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'SIT',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 10000, // Increase timeout for acquiring connection
  connectTimeout: 10000 // Increase connection timeout
});

const db = pool.promise(); // Enable promise-based queries

console.log('Connected to the MySQL database');

module.exports = db;