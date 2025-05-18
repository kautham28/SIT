import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/fuel_stations/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("resetEmail", email);
        setMessage(data.message);
        setTimeout(() => navigate("/verify"), 2000);
      } else {
        setError(data.error || "Failed to send reset code. Please try again.");
      }
    } catch (err) {
      console.error("Error in forgot password:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2 className="forgot-password-title">
          <FontAwesomeIcon icon={faKey} className="forgot-password-icon" /> Forgot Password
        </h2>
        <p className="forgot-password-instructions">
          Enter your email address to reset your fuel station account password.
        </p>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
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
          Send
        </button>
        <div className="back-to-login">
          <a href="/" className="login-link">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;