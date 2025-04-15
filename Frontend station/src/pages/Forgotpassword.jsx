import React, { useState } from "react";
import "./ForgotPassword.css"; // Import the CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle password reset
    console.log("Reset password for email:", email);
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2 className="forgot-password-title">
          <FontAwesomeIcon icon={faKey} className="forgot-password-icon" /> Forgot Password
        </h2>
        <p className="forgot-password-instructions">
          Enter your email address to reset your password.
        </p>
        <div className="input-container">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="forgot-password-input"
            required
          />
        </div>
        <button type="submit" className="forgot-password-button">
          Reset Password
        </button>

        {/* Back to Login */}
<div className="back-to-login">
  <a href="/" className="login-link">Back to Login</a>
</div>
      </form>
    </div>
  );
};

export default ForgotPassword;