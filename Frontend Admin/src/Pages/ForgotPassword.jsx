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

  const handleForgotPasswordSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setMessage('');

  // Prepare the data to send to the API
  const userData = { email };

  try {
    // Make the API request
    const response = await fetch('http://localhost:5000/api/admin_auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Parse the response
    const data = await response.json();

    if (response.ok) {
      // Success case: API confirms email sent
      setMessage(data.message || 'A reset code has been sent to your email.');
      setStep(2); // Move to Verify Code step
    } else {
      // Error case: API returns an error (e.g., email not found)
      setError(data.error || 'Failed to send reset code. Please try again.');
    }
  } catch (err) {
    // Network or unexpected errors
    setError('An error occurred. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
};


  const handleVerifyCodeSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setMessage('');

  // Prepare the data to send to the API
  const verificationData = { email, code };

  try {
    // Make the API request to verify the code
    const response = await fetch('http://localhost:5000/api/admin_auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    // Parse the response
    const data = await response.json();

    if (response.ok) {
      // Success case: Code is verified
      setMessage(data.message || 'Code verified successfully.');
      setStep(3); // Move to Reset Password step
    } else {
      // Error case: Invalid code or other API error
      setError(data.error || 'Invalid code. Please try again.');
    }
  } catch (err) {
    // Network or unexpected errors
    setError('An error occurred. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
};


  const handleResetPasswordSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setMessage('');

  // Client-side validation before API call
  if (newPassword !== confirmPassword) {
    setError('Passwords do not match.');
    setLoading(false);
    return;
  } else if (newPassword.length < 6) {
    setError('Password must be at least 6 characters long.');
    setLoading(false);
    return;
  }

  // Prepare the data to send to the API
  const resetData = { email, code, newPassword };

  try {
    // Make the API request to reset the password
    const response = await fetch('http://localhost:5000/api/admin_auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    // Parse the response
    const data = await response.json();

    if (response.ok) {
      // Success case: Password reset successful
      setMessage(data.message || 'Password reset successfully! Redirecting to login...');
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      // Error case: API returns an error (e.g., invalid code, server issue)
      setError(data.error || 'Failed to reset password. Please try again.');
    }
  } catch (err) {
    // Network or unexpected errors
    setError('An error occurred. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
};


  const handleBackToLogin = () => {
    window.location.href = '/';
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
          <form className="form" onSubmit={handleForgotPasswordSubmit}>
            <div className="form-group">
              <div className="input-group">
                {/* <Mail className="input-icon" /> */}
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
          <form className="form" onSubmit={handleVerifyCodeSubmit}>
            <div className="form-group">
              <div className="input-group">
                {/* <Check className="input-icon" /> */}
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
          <form className="form" onSubmit={handleResetPasswordSubmit}>
            <div className="form-group">
              <div className="input-group">
                {/* <Lock className="input-icon" /> */}
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
                {/* <Lock className="input-icon" /> */}
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
