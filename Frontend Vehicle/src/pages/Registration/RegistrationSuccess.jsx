import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './RegistrationSuccess.css';

const RegistrationSuccess = () => {
  const location = useLocation();
  const registrationData = location.state?.registrationData || {};

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1>Registration Successful!</h1>
        <p>Your vehicle has been successfully registered in the system.</p>
        
        {registrationData.registrationNumber && (
          <div className="registration-details">
            <h2>Registration Details</h2>
            <p><strong>Vehicle Number:</strong> {registrationData.registrationNumber}</p>
            <p><strong>Fuel Quota:</strong> {registrationData.fuelQuota} liters</p>
            <p><strong>Category ID:</strong> {registrationData.categoryId}</p>
          </div>
        )}
        
        <p className="info-text">You can now use the vehicle number to log in to the system and manage your fuel quota.</p>
        
        <div className="button-container">
          <Link to="/login" className="login-btn">
            Login Now
          </Link>
          <Link to="/" className="home-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;