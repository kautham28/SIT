import React, { useState } from 'react';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login-ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset attempt', { email });
    // Here you could send a request to your backend
    // Store email in sessionStorage for other components
    sessionStorage.setItem('resetEmail', email);
    navigate('/verify-code');
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <div className="icon-container">
            <KeyRound className="icon" />
          </div>
          <h2 className="title">Reset Password</h2>
          <p className="subtitle">Enter your email to reset password</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Email address"
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            <span>Reset Password</span>
            <ArrowRight className="button-icon" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="forgot-password"
          >
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
