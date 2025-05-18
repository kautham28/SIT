import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import './New.css';

function NewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const resetEmail = sessionStorage.getItem('resetEmail');
    const params = new URLSearchParams(location.search);
    const resetCode = params.get('code');
    const queryEmail = params.get('email');

    if (!resetEmail || !resetCode || resetEmail !== queryEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(resetEmail);
    setCode(resetCode);
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/fuel_stations/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully updated');
        sessionStorage.removeItem('resetEmail');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <div className="icon-container">
            <FontAwesomeIcon icon={faLock} className="icon" />
          </div>
          <h2 className="title">Set New Password</h2>
          <p className="subtitle">Create a new password for your fuel station account</p>
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="New password"
                minLength={8}
              />
            </div>
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Confirm new password"
                minLength={8}
              />
            </div>
          </div>
          <button type="submit" className="submit-button">
            <span>Set New Password</span>
          </button>
        </form>
        <div className="back-to-login">
          <a href="/" className="login-link">Back to Login</a>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;