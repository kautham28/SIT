// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'fuel_station_owner') {
      return res.status(403).json({ error: 'Insufficient permissions. Fuel station owner role required.' });
    }
    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Invalid token:', err);
    res.status(401).json({ error: 'Invalid token.' });
  }
};