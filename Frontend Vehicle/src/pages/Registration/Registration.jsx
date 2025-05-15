import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

const Registration = () => {
  // Personal details state
  const [nic, setNic] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Vehicle details state
  const [vehicleNumberPart1, setVehicleNumberPart1] = useState('');
  const [vehicleNumberPart2, setVehicleNumberPart2] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [fuelType, setFuelType] = useState('');
  
  // Step tracking state
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();

  const handleSendOtp = () => {
    // Logic to send OTP
    console.log('Send OTP to:', mobile);
  };

  const handleVerifyOtp = () => {
    // Logic to verify OTP
    console.log('Verify OTP:', otp);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    // Move to vehicle details section
    setCurrentStep(2);
  };

  const handleBack = () => {
    // Go back to personal details section
    setCurrentStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission with both personal and vehicle details
    console.log({
      // Personal details
      nic, mobile, otp, firstName, lastName, address, password, confirmPassword,
      // Vehicle details
      vehicleNumber: `${vehicleNumberPart1} ${vehicleNumberPart2}`,
      vehicleType,
      chassisNumber,
      fuelType,
    });
    navigate('/qr'); // Redirect to QR page
  };

  return (
    <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit}>
      {currentStep === 1 ? (
        // Step 1: Personal Details
        <div className="form-section">
          <h1>REGISTRATION</h1>
          <p>
            Already have an account? <a href="/login">Login Here</a>
          </p>
          <h2>Personal Details</h2>
          <div className="form-group">
            <label>NIC Number *</label>
            <input
              type="text"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="NIC"
              required
            />
          </div>
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex: Saman"
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ex: Perera"
              required
            />
          </div>
          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: 399/8, Station Road, Colombo"
              required
            />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <div className="input-with-button">
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile Number"
                required
              />
              <button type="button" onClick={handleSendOtp}>
                Send OTP
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>OTP *</label>
            <div className="input-with-button">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Ex: 123456"
                required
              />
              <button type="button" onClick={handleVerifyOtp}>
                Verify
              </button>
            </div>
          </div>
          <button type="submit" className="next-button">
            Next
          </button>
        </div>
      ) : (
        // Step 2: Vehicle Details
        <div className="registration-vehicle-container">
          <h1>REGISTRATION</h1>
          <p>
            Already have an account? <a href="/login">Login Here</a>
          </p>
          <h2>Vehicle Details</h2>
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
        </div>
      )}
    </form>
  );
};

export default Registration;