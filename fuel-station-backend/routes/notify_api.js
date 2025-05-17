const express = require('express');
const router = express.Router();
const axios = require('axios');

// Notify.lk Configuration
const NOTIFY_API_KEY = '1L8ABPpQGSHWjr41cL8T';
const NOTIFY_SENDER_ID = 'NotifyDEMO';
const NOTIFY_API_URL = 'https://api.notify.lk/v1/send-sms';

// Test endpoint
router.get('/test', (req, res) => {
  try {
    res.status(200).json({ 
      message: 'Notification API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      message: 'Error in test endpoint',
      error: error.message
    });
  }
});

// Development mode helper endpoint - shows the universal test OTP
router.get('/dev-info', (req, res) => {
  try {
    res.status(200).json({
      message: 'Development Mode Information',
      universalTestOTP: '123456',
      instructions: 'Use this OTP for testing during development. This endpoint should be disabled in production.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dev info endpoint error:', error);
    res.status(500).json({ 
      message: 'Error in dev info endpoint',
      error: error.message
    });
  }
});

// Utility to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send generic SMS notification
router.post('/send-sms', async (req, res) => {
  const { mobile, message } = req.body;
  
  if (!mobile || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Mobile number and message are required' 
    });
  }
  
  try {
    const response = await axios.post(NOTIFY_API_URL, {
      to: mobile,
      message,
      sender_id: NOTIFY_SENDER_ID,
    }, {
      headers: {
        Authorization: `Bearer ${NOTIFY_API_KEY}`,
      },
    });
    
    res.status(200).json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send SMS', 
      error: error.message 
    });
  }
});

// Send post-pumping notification
router.post('/send-pumping-notification', async (req, res) => {
  const { mobile, vehicleNumber, pumpedLiters, remainingQuota } = req.body;
  
  if (!mobile || !vehicleNumber || !pumpedLiters || remainingQuota === undefined) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }
  
  try {
    const message = `Fuel Update: ${pumpedLiters}L pumped for vehicle ${vehicleNumber}. Remaining quota: ${remainingQuota}L.`;
    const response = await axios.post(NOTIFY_API_URL, {
      to: mobile,
      message,
      sender_id: NOTIFY_SENDER_ID,
    }, {
      headers: {
        Authorization: `Bearer ${NOTIFY_API_KEY}`,
      },
    });
    
    res.status(200).json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending pumping notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send notification', 
      error: error.message 
    });
  }
});

module.exports = router;