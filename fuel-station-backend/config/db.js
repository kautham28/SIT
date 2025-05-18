const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',       // Replace with your MySQL username
  password: '2002',       // Replace with your MySQL password
  database: 'sit_project', // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error);
    return false;
  }
}

// Initialize connection test
testConnection();

// Export the pool for use in other files
module.exports = {
  query: (sql, params) => pool.query(sql, params),
  getConnection: () => pool.getConnection(),
  pool,
  testConnection,
};
