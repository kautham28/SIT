const db = require('./db');

// Execute schema setup
async function setupDatabase() {
  const connection = await db.getConnection();
  
  try {
    console.log('Setting up database schema...');
    
    // Create otps table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mobile VARCHAR(15) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if verified column exists in otps table
    const [columns] = await connection.query('SHOW COLUMNS FROM otps LIKE "verified"');
    
    if (columns.length === 0) {
      console.log('Adding verified column to otps table...');
      await connection.query('ALTER TABLE otps ADD COLUMN verified BOOLEAN DEFAULT false');
      console.log('Added verified column successfully');
    } else {
      console.log('Verified column already exists');
    }
    
    console.log('Database schema setup completed');
    
  } catch (error) {
    console.error('Database setup error:', error);
  } finally {
    connection.release();
  }
}

// Execute the setup if this file is run directly
if (require.main === module) {
  setupDatabase()
    .then(() => console.log('Database setup completed'))
    .catch(err => console.error('Database setup failed:', err))
    .finally(() => process.exit());
}

module.exports = { setupDatabase };
