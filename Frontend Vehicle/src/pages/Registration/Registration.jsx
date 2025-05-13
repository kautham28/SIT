import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

const Registration = () => {
  const [mobile, setMobile] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = () => {
    // Logic to send OTP
    console.log('Send OTP to:', mobile);
  };

  const handleVerifyOtp = () => {
    // Logic to verify OTP
    console.log('Verify OTP:', otp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log({ mobile, firstName, lastName, address });
    navigate('/registration-vehicle'); // Redirect to RegistrationVehicle page
  };

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <div className="form-section">
        <h1 className="page-title">REGISTRATION</h1>
        <p className="login-link">
          Already have an account? <a href="/login">Login Here</a>
        </p>
        <h2 className="section-title">Personal Details</h2>
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
    </form>
  );
};

export default Registration;