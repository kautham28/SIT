import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login-ForgotPass.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt', { email, password });
    // You can add authentication logic here
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
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            <span>Sign in</span>
            <ArrowRight className="button-icon" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="forgot-password"
          >
            Forgot your password?
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
