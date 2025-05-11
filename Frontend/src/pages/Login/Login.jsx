import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = () => {
    // Logic to send OTP
    setOtpSent(true);
  };

  const handleLogin = () => {
    // Logic to verify OTP and log in
    navigate('/qr'); // Redirect to the QR page
  };

  return (
    <div className="login-container">
      <h1>LOGIN</h1>
      {!otpSent ? (
        <div className="login-form">
          <label htmlFor="mobileNumber">Mobile Number *</label>
          <input
            type="text"
            id="mobileNumber"
            placeholder="Ex: 0777123456"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <button onClick={handleSendOtp} disabled={!mobileNumber}>
            Send OTP
          </button>
        </div>
      ) : (
        <div className="otp-form">
          <p>Enter the 6 digit OTP number sent to mobile {mobileNumber} *</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleLogin} disabled={!otp}>
            Login
          </button>
          <button onClick={() => setOtpSent(false)}>Resend OTP</button>
        </div>
      )}
    </div>
  );
};

export default Login;
