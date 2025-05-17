import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [registrationNumber, setVehicleNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [forgotMobile, setForgotMobile] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSubmitting, setForgotPasswordSubmitting] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  
  // New state variables for OTP flow
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Enter mobile, 2: Enter OTP, 3: Create new password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Connect to the vehicle-login API endpoint
      const response = await axios.post('http://localhost:5000/api/auth/vehicle-login', {
        registrationNumber,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Store authentication token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        navigate('/qr');
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Display appropriate error message
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || 'Invalid credentials. Please try again.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error setting up request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setForgotPasswordSubmitting(true);
    setForgotPasswordMessage('');

    try {
      // Connect to the send-otp API endpoint
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', {
        mobileNumber: forgotMobile,
      });

      if (response.data.success) {
        setForgotPasswordMessage('OTP sent to your mobile number.');
        setForgotPasswordStep(2); // Move to OTP verification step
      } else {
        setForgotPasswordMessage(response.data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setForgotPasswordMessage('Error sending OTP. Please try again later.');
    } finally {
      setForgotPasswordSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setForgotPasswordSubmitting(true);
    setForgotPasswordMessage('');

    try {
      // Connect to the verify-otp API endpoint
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        mobileNumber: forgotMobile,
        otp: otp
      });

      if (response.data.success) {
        setForgotPasswordMessage('OTP verified successfully.');
        setForgotPasswordStep(3); // Move to reset password step
      } else {
        setForgotPasswordMessage(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setForgotPasswordMessage('Error verifying OTP. Please try again.');
    } finally {
      setForgotPasswordSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setForgotPasswordMessage('Passwords do not match.');
      return;
    }
    
    setForgotPasswordSubmitting(true);
    setForgotPasswordMessage('');

    try {
      // Connect to the reset-password API endpoint
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        mobileNumber: forgotMobile,
        otp: otp,
        newPassword: newPassword
      });

      if (response.data.success) {
        setForgotPasswordMessage('Password reset successfully.');
        // Reset the form and go back to login after a short delay
        setTimeout(() => {
          toggleForgotPassword();
        }, 2000);
      } else {
        setForgotPasswordMessage(response.data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setForgotPasswordMessage('Error resetting password. Please try again later.');
    } finally {
      setForgotPasswordSubmitting(false);
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setForgotPasswordMessage('');
    setForgotMobile('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotPasswordStep(1);
  };

  // Render different form based on the current step in forgot password flow
  const renderForgotPasswordForm = () => {
    switch (forgotPasswordStep) {
      case 1: // Enter mobile number
        return (
          <form className="forgot-password-form" onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                value={forgotMobile}
                onChange={(e) => setForgotMobile(e.target.value)}
                required
                placeholder="Enter your mobile number"
                pattern="[0-9]{10}"
                title="Please enter a valid 10 digit mobile number"
              />
            </div>
            
            <button type="submit" disabled={forgotPasswordSubmitting}>
              {forgotPasswordSubmitting ? 'Sending...' : 'Send OTP'}
            </button>
            
            <button type="button" className="back-button" onClick={toggleForgotPassword}>
              Back to Login
            </button>
          </form>
        );
      
      case 2: // Verify OTP
        return (
          <form className="forgot-password-form" onSubmit={handleVerifyOTP}>
            <div>
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP received on your mobile"
                pattern="[0-9]*"
                maxLength="6"
              />
            </div>
            
            <button type="submit" disabled={forgotPasswordSubmitting}>
              {forgotPasswordSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <button type="button" className="back-button" onClick={() => setForgotPasswordStep(1)}>
              Back
            </button>
          </form>
        );
      
      case 3: // Reset password
        return (
          <form className="forgot-password-form" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                minLength="6"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                minLength="6"
              />
            </div>
            
            <button type="submit" disabled={forgotPasswordSubmitting}>
              {forgotPasswordSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <button type="button" className="back-button" onClick={() => setForgotPasswordStep(2)}>
              Back
            </button>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="login-container">
      {!showForgotPassword ? (
        <>
          <h1>Login</h1>
          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label htmlFor="vehicleNumber">Vehicle Number</label>
              <input
                type="text"
                id="vehicleNumber"
                value={registrationNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                required
                placeholder="Enter your vehicle number"
              />
            </div>
            
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <div className="forgot-password-link">
                <a href="#" onClick={toggleForgotPassword}>Forgot Password?</a>
              </div>
            </div>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </>
      ) : (
        <>
          <h1>Forgot Password</h1>
          {forgotPasswordMessage && (
            <div className={forgotPasswordMessage.includes('success') || forgotPasswordMessage.includes('verified') || forgotPasswordMessage.includes('sent') ? "success-message" : "error-message"}>
              {forgotPasswordMessage}
            </div>
          )}
          
          {renderForgotPasswordForm()}
        </>
      )}
    </div>
  );
};

export default Login;