const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

const app = express();

// Update CORS configuration to allow specific origin
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URL(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Routes
const vehiclesRouter = require('../fuel-station-backend/routes/vehicles_route.js');
const vehicleFuelTransactionsRouter = require('../fuel-station-backend/routes/vehicle_fuel_transactions_route.js');
const usersRouter = require('../fuel-station-backend/routes/user_route.js');
const FuelTransactionRouter = require('../fuel-station-backend/routes/station_fuel_transactions_route.js');
const vehicleCategoryRouter = require('../fuel-station-backend/routes/vehicle_category_route.js');
const fuelStationRouter = require('../fuel-station-backend/routes/fuel_stations_route.js');
const MotorTrafficRouter = require('./routes/motor_traffic_route.js');
const fuelStationOperatorsRouter = require('../fuel-station-backend/routes/fuel_station_operators.js');
const adminAuth = require('../fuel-station-backend/routes/adminAuth.js');
const vehicleRegistrationRouter = require('./routes/vehicle_registration_route.js');

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/vehicle_fuel_transactions', vehicleFuelTransactionsRouter);
app.use('/api/station_fuel_transactions', FuelTransactionRouter);
app.use('/api/users', usersRouter);
app.use('/api/vehicle_categories', vehicleCategoryRouter);
app.use('/api/fuel_stations', fuelStationRouter);
app.use('/api/motor_traffic', MotorTrafficRouter);
app.use('/api/fuel_station_operators', fuelStationOperatorsRouter);
app.use('/api/admin_auth', adminAuth);
app.use('/api/vehicle_registration', vehicleRegistrationRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('========= ERROR DETAILS =========');
  console.error('Error message:', err.message);
  console.error('Error code:', err.code);
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  console.error('Request body:', JSON.stringify(req.body, null, 2));
  console.error('Stack trace:', err.stack);
  console.error('=================================');
  
  res.status(500).json({
    error: 'Server error occurred',
    message: err.message,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
