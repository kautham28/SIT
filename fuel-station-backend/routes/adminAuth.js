// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../../fuel-station-backend/src/config/db.js');  // The database connection you defined
const jwt = require('jsonwebtoken');
// const verifyAdminToken = require('../middleware/adminauthmiddleware');

// Admin login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required',
        success: false 
      });
    }
  
    try {
      // Query to find admin user with direct password comparison
      const [results] = await db.query(
        'SELECT * FROM users WHERE username = ? AND password = ? AND role = "admin"',
        [username, password]
      );
  
      // Check if admin exists and password matches
      if (results.length === 0) {
        return res.status(401).json({ 
          message: 'Invalid username or password',
          success: false 
        });
      }
  
      const admin = results[0];
  
      // Create JWT token
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );
  
      // Remove password from response
      const { password: _, ...adminData } = admin;
  
      // Send response
      res.status(200).json({
        message: 'Login successful',
        success: true,
        token,
        admin: adminData
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Server error',
        success: false 
      });
    }
  });

  
// Configure Nodemailer for sending emails-----------------------------
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Gmail SMTP server
  port: 465,
  secure: true, // Use TLS (STARTTLS) for port 587
  auth: {
    user: 'thujathaponnuthurai@gmail.com', // Hardcoded email address
    pass: 'wghcxvvvujzpcvdv', // Replace with your actual password or App Password
  },
  timeout: 60000, // Increased timeout to 60 seconds to handle slow connections
});

// Function to generate a 6-digit code
const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number between 100000 and 999999
};
// -------------------------------------------------------------------


router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received email for password reset:', email);

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Checking if user exists in the database...');
    console.log('Querying database for user with email:', email);

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No user found with this email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetCode = generateSixDigitCode(); // 6-digit code for email
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await db.query(
      'UPDATE users SET reset_code = ?, reset_token_expires = ? WHERE email = ?',
      [resetCode, resetTokenExpiry, email]
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetCode}`;

    // Email content with token directly included (NOT RECOMMENDED)
    const mailOptions = {
      from: 'thujathaponnuthurai@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use the following token to reset your password:\n\nCode: ${resetCode}\n\nAlternatively, click the link below:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `<p>You requested a password reset. Use the following token to reset your password:</p><p><strong>Code: ${resetCode}</strong></p><p>Alternatively, click the link below:</p><p><a href="${resetUrl}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'A reset code has been sent to your email' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Internal server error. Please try again' });
  }
});

// Verify Reset Code Route (POST)
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and code are required' });
    }

    // Check if the code matches and hasn't expired
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_token_expires > NOW()',
      [email, code]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or expired code' });
    }

    res.status(200).json({ success: true, message: 'Code verified successfully', token: rows[0].reset_token });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
});

// Reset Password Route (POST)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, code, and new password are required' });
    }

    // Check if the token is valid and hasn't expired
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_token_expires > NOW()',
      [email, code]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or expired code' });
    }

    // Store the new password in plain text (NOT RECOMMENDED FOR PRODUCTION)
    await db.query(
      'UPDATE users SET password = ?, reset_code = NULL, reset_token_expires = NULL WHERE email = ?',
      [newPassword, email]
    );

    console.log('Password updated successfully for email:', newPassword);

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
});

module.exports = router;
