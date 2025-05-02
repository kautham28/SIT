const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

import stationOperatorRoutes from "./routes/station_operator";
const userRoutes = require('./routes/userRoutes');


const app = express();
app.use(cors());
// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);
app.use('/api/stationOperator', stationOperatorRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;