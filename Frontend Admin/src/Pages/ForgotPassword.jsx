import React, { useState } from 'react';
import { KeyRound, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import './Login-ForgotPassword.css'; // Assuming you have a separate CSS file for styling

const ForgotPassword = () => {
  // State to manage the current step (1: Forgot Password, 2: Verify Code, 3: Reset Password)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <div className="icon-container">
            <KeyRound className="icon" />
          </div>
          <h2 className="title">
            {step === 1 ? 'Reset Password' : step === 2 ? 'Verify Code' : 'Set New Password'}
          </h2>
          <p className="subtitle">
            {step === 1
              ? 'Enter your email to reset password'
              : step === 2
              ? 'Enter the code sent to your email'
              : 'Enter your new password'}
          </p>
        </div>

        {/* Display success message if available */}
        {message && (
          <div className="success-message" style={{ color: 'green', margin: '10px 0', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {/* Display error message if available */}
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Step 1: Forgot Password - Email Input */}
        {step === 1 && (
          <form className="form" >
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

            <button type="submit" className="submit-button" disabled={loading}>
              <span>{loading ? 'Sending...' : 'Reset Password'}</span>
              <ArrowRight className="button-icon" />
            </button>

            <button type="button" onClick={handleBackToLogin} className="forgot-password">
              Back to login
            </button>
          </form>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <form className="form">
            <div className="form-group">
              <div className="input-group">
                <Check className="input-icon" />
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input"
                  placeholder="Verification Code"
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
              <ArrowRight className="button-icon" />
            </button>

            <button type="button" onClick={() => setStep(1)} className="forgot-password">
              Back to Email
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form className="form" >
            <div className="form-group">
              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  placeholder="New Password"
                />
              </div>
            </div>

            <div className="form-group">
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
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              <span>{loading ? 'Resetting...' : 'Set New Password'}</span>
              <ArrowRight className="button-icon" />
            </button>

            <button type="button" onClick={() => setStep(2)} className="forgot-password">
              Back to Verify Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
