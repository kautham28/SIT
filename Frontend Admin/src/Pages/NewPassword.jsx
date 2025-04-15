import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import './Login-ForgotPass.css';

function NewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const resetEmail = sessionStorage.getItem('resetEmail');
    if (!resetEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(resetEmail);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('New password set attempt', { email, password });
    sessionStorage.removeItem('resetEmail'); // Clean up
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <div className="icon-container">
            <Lock className="icon" />
          </div>
          <h2 className="title">Set New Password</h2>
          <p className="subtitle">Create a new password for your account</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
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
                placeholder="New password"
                minLength={8}
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" />
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
            <ArrowRight className="button-icon" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;