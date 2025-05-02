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
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/vehicle_fuel_transactions', vehicleFuelTransactionsRouter);

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