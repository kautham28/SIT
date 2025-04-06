import React, { useState } from "react";
import "./ForgotPassword.css"; // Import the CSS file for styling

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
        <h2 className="forgot-password-title">Forgot Password</h2>
        <p className="forgot-password-instructions">
          Enter your email address to reset your password.
        </p>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="forgot-password-input"
          required
        />
        <button type="submit" className="forgot-password-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword; 