import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login-ForgotPassword.css';

function VerifyCode() {
    const [verificationCode, setVerificationCode] = useState('');
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
      console.log('Verification attempt', { email, verificationCode });
      navigate('/new-password');
    };
    
    return (
        <div className="container">
          <div className="login-card">
            <div className="header">
              <div className="icon-container">
                <ShieldCheck className="icon" />
              </div>
              <h2 className="title">Verify Code</h2>
              <p className="subtitle">Enter the verification code sent to {email}</p>
            </div>
    
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-group">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="input text-center"
                    placeholder="Enter verification code"
                    maxLength={6}
                    style={{ letterSpacing: '0.5em' }}
                  />
                </div>
              </div>
    
              <button type="submit" className="submit-button">
                <span>Verify Code</span>
                <ArrowRight className="button-icon" />
              </button>
    
              <p className="resend-text">
                Didn't receive the code? <button type="button" className="resend-button">Resend</button>
              </p>
            </form>
          </div>
        </div>
      );
    }

export default VerifyCode;
