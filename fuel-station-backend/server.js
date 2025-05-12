const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
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


app.use('/api/vehicles', vehiclesRouter);
app.use('/api/vehicle_fuel_transactions', vehicleFuelTransactionsRouter);
app.use('/api/station_fuel_transactions', FuelTransactionRouter);
app.use('/api/users', usersRouter);
app.use('/api/vehicle_categories', vehicleCategoryRouter);
app.use('/api/fuel_stations', fuelStationRouter);
app.use('/api/motor_traffic', MotorTrafficRouter);
app.use('/api/fuel_station_operators', fuelStationOperatorsRouter);



app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
