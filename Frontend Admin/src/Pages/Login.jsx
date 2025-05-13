import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login-ForgotPassword.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Create a simple data object
      const userData = { 
        username, 
        password 
      };

      console.log('Sending login request with data:', userData);

      // Make the API request
      const response = await fetch('http://localhost:5000/api/admin_auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      // Parse the JSON response
      const data = await response.json();
      console.log('Login response:', data);
      
      // Check if login was successful
      if (data.success) {
        // Store the token in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        
        // Redirect to admin dashboard
        navigate('/FuelDash');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <div className="icon-container">
            <Lock className="icon" />
          </div>
          <h2 className="title">Admin Login</h2>
          <p className="subtitle">Sign in to manage the fuel system</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Username"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Password"
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            {!loading && <ArrowRight className="button-icon" />}
          </button>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="forgot-password"
            disabled={loading}
          >
            Forgot your password?
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
