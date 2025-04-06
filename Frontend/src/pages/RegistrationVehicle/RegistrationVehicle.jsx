import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationVehicle.css';

const RegistrationVehicle = () => {
  const [vehicleNumberPart1, setVehicleNumberPart1] = useState('');
  const [vehicleNumberPart2, setVehicleNumberPart2] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [fuelType, setFuelType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log({
      vehicleNumber: `${vehicleNumberPart1} ${vehicleNumberPart2}`,
      vehicleType,
      chassisNumber,
      fuelType,
    });
  };

  const handleBack = () => {
    navigate('/'); // Navigate to the Registration page
  };

  return (
    <div className="registration-vehicle-container">
      <h1>REGISTRATION</h1>
      <p>
        Already have an account? <a href="/login">Login Here</a>
      </p>
      <h2>Vehicle Details</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Vehicle Number *</label>
          <div className="vehicle-number-inputs">
            <input
              type="text"
              value={vehicleNumberPart1}
              onChange={(e) => setVehicleNumberPart1(e.target.value)}
              placeholder="Ex: ABC"
              required
            />
            <input
              type="text"
              value={vehicleNumberPart2}
              onChange={(e) => setVehicleNumberPart2(e.target.value)}
              placeholder="Ex: 1234"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Vehicle Type *</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Truck">Truck</option>
          </select>
        </div>
        <div className="form-group">
          <label>Chassis Number *</label>
          <input
            type="text"
            value={chassisNumber}
            onChange={(e) => setChassisNumber(e.target.value)}
            placeholder="Ex: N786543322"
            required
          />
        </div>
        <div className="form-group">
          <label>Select Fuel Type:</label>
          <div className="fuel-type-options">
            <label>
              <input
                type="radio"
                value="Diesel"
                checked={fuelType === 'Diesel'}
                onChange={(e) => setFuelType(e.target.value)}
              />
              Diesel
            </label>
            <label>
              <input
                type="radio"
                value="Petrol"
                checked={fuelType === 'Petrol'}
                onChange={(e) => setFuelType(e.target.value)}
              />
              Petrol
            </label>
          </div>
        </div>
        <div className="form-footer">
          <div className="form-buttons">
            <button type="button" className="back-button" onClick={handleBack}>
              Back
            </button>
            <button type="submit" className="register-button">
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationVehicle;
