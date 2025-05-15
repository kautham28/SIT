import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
import { vehicleRegistrationService } from '../../services/api';

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
  // Add email state since it's being used in handleSubmit
  const [email, setEmail] = useState('');
  
  // Vehicle details state
  const [vehicleNumberPart1, setVehicleNumberPart1] = useState('');
  const [vehicleNumberPart2, setVehicleNumberPart2] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [fuelType, setFuelType] = useState('');
  
  // Add loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();

  // Add state for vehicle categories
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  
  // Fetch vehicle categories when component mounts
  useEffect(() => {
    const fetchVehicleCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const categories = await vehicleRegistrationService.getVehicleCategories();
        setVehicleCategories(categories);
      } catch (err) {
        console.error('Error fetching vehicle categories:', err);
        setError('Failed to load vehicle types. Please refresh the page.');
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    
    fetchVehicleCategories();
  }, []);

  const handleSendOtp = () => {
    // Logic to send OTP
    console.log('Send OTP to:', mobile);
    // This is just a placeholder - you would implement real OTP service
    setSuccess('OTP sent successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleVerifyOtp = () => {
    // Logic to verify OTP
    console.log('Verify OTP:', otp);
    // This is just a placeholder - you would implement real OTP verification
    setSuccess('OTP verified!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    // Basic NIC validation
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!nicRegex.test(nic)) {
      setError('Invalid NIC format!');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    // Move to vehicle details section
    setCurrentStep(2);
  };

  const handleBack = () => {
    // Go back to personal details section
    setCurrentStep(1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Format vehicle number correctly
      const formattedVehicleNumber = `${vehicleNumberPart1.trim()}-${vehicleNumberPart2.trim()}`;
      
      // Log what we're sending to help with debugging
      console.log('Submitting registration data:', {
        personal: { firstName, lastName, nic, mobile, address },
        vehicle: { vehicleNumber: formattedVehicleNumber, vehicleType, chassisNumber, fuelType }
      });
      
      // Prepare the registration data
      const registrationData = {
        firstName,
        lastName,
        nic,
        password,
        mobile,
        address,
        ...(email && { email }),
        vehicleNumber: formattedVehicleNumber,
        vehicleType,
        chassisNumber,
        fuelType
      };
      
      // Call the API to register
      const response = await vehicleRegistrationService.register(registrationData);
      
      console.log('Registration successful:', response);
      setSuccess('Registration successful! Redirecting to QR page...');
      
      // Redirect after a brief delay to show the success message
      setTimeout(() => {
        navigate('/qr', { 
          state: { 
            userId: response.userId,
            vehicleId: response.vehicleId,
            registrationNumber: response.registrationNumber,
            fuelQuota: response.fuelQuota
          } 
        });
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Show a more user-friendly error message based on the response
      let errorMessage = 'Failed to register. Please try again.';
      
      if (err && err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Display error or success message
  const renderMessage = () => {
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    if (success) {
      return <div className="success-message">{success}</div>;
    }
    return null;
  };

  return (
    <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit}>
      {/* Show any error or success messages */}
      {renderMessage()}
      
      {/* Show loading indicator */}
      {isLoading && <div className="loading-spinner">Processing...</div>}
      
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
          {/* Add email field to the form */}
          <div className="form-group">
            <label>Email (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
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
            {isCategoriesLoading ? (
              <div className="loading-spinner">Loading vehicle types...</div>
            ) : (
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                {vehicleCategories.map((category) => (
                  <option key={category.category_id} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            )}
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
              <button 
                type="button" 
                className="back-button" 
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="register-button"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default Registration;