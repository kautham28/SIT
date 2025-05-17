import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleRegistrationService } from '../../services/api';
import './Registration.css';

const Registration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Start with step 1
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    // Personal information
    firstName: '',
    lastName: '',
    nic: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    email: '',
    address: '',
    otp: '',
    
    // Vehicle information
    vehicleNumber: '',
    chassisNumber: '',
    vehicleType: '',
    fuelType: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    setError('');
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.mobile) {
      setError('Mobile number is required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await vehicleRegistrationService.sendOtp({ mobile: formData.mobile });
      
      if (response.success) {
        setOtpSent(true);
        setSuccess('OTP sent successfully. Please check your phone.');
      }
    } catch (error) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }
    
    try {
      setLoading(true);
      const response = await vehicleRegistrationService.verifyOtp({ 
        mobile: formData.mobile, 
        otp: formData.otp 
      });
      
      if (response.success) {
        setSuccess('OTP verified successfully');
        // Move to the next step
        setStep(2);
      }
    } catch (error) {
      setError(error.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // Validate vehicle
  const handleValidateVehicle = async (e) => {
    e.preventDefault();
    
    if (!formData.vehicleNumber || !formData.chassisNumber) {
      setError('Vehicle number and chassis number are required');
      return;
    }
    
    try {
      setLoading(true);
      const validateResponse = await vehicleRegistrationService.validateVehicle({
        vehicleNumber: formData.vehicleNumber,
        chassisNumber: formData.chassisNumber,
        vehicleType: formData.vehicleType,
        fuelType: formData.fuelType
      });
      
      if (validateResponse.success) {
        setSuccess('Vehicle validated successfully');
        
        // Proceed with registration directly after validation
        try {
          const response = await vehicleRegistrationService.register(formData);
          
          if (response.success) {
            setSuccess('Registration completed successfully!');
            // Redirect to success page or dashboard
            setTimeout(() => {
              navigate('/registration-success', { 
                state: { 
                  registrationData: response 
                }
              });
            }, 2000);
          }
        } catch (registrationError) {
          setError(registrationError.message || 'Registration failed');
        }
      }
    } catch (error) {
      setError(error.message || 'Vehicle validation failed');
    } finally {
      setLoading(false);
    }
  };

  console.log("Current step:", step); // Add this to debug which step is active

  return (
    <div className="registration-container">
      <h2>Vehicle Registration</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {/* STEP 1: Personal Information */}
      {step === 1 && (
        <div className="step-container">
          <h3>Step 1: Personal Information</h3>
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nic">NIC Number*</label>
              <input
                type="text"
                id="nic"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="Format: 123456789V or 123456789012"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number*</label>
              <div className="mobile-otp-container">
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Format: 0771234567 or +94771234567"
                  required
                />
                <button 
                  type="button" 
                  className="send-otp-btn"
                  onClick={handleSendOTP}
                  disabled={loading || !formData.mobile}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </div>
            
            {otpSent && (
              <div className="form-group">
                <label htmlFor="otp">Enter OTP*</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address*</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="button-group">
              <button 
                type="submit" 
                className="next-btn"
                disabled={loading || !otpSent}
              >
                {loading ? 'Processing...' : 'Verify & Continue'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* STEP 2: Vehicle Information */}
      {step === 2 && (
        <div className="step-container">
          <h3>Step 2: Vehicle Information</h3>
          <form onSubmit={handleValidateVehicle}>
            <div className="form-group">
              <label htmlFor="vehicleNumber">Vehicle Registration Number*</label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="chassisNumber">Chassis Number*</label>
              <input
                type="text"
                id="chassisNumber"
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="vehicleType">Vehicle Type*</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="SUV">SUV</option>
                <option value="Bus">Bus</option>
                <option value="Truck">Truck</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Three Wheeler">Three Wheeler</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="fuelType">Fuel Type*</label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Super Diesel">Super Diesel</option>
                <option value="Auto Diesel">Auto Diesel</option>
              </select>
            </div>
            
            <div className="button-group">
              <button 
                type="button" 
                className="back-btn"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="next-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Registration;