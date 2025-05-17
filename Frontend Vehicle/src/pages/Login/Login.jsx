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

  return (
    <div className="login-container">
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
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;