import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./stationlogin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const StationLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/fuel_stations/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token); // Save token to localStorage
        console.log("Token saved to localStorage:", data.token); // Debug log
        navigate("/Dashboard"); // Redirect to the dashboard
      } else {
        setError(data.error || "Login failed. No token received.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <FontAwesomeIcon icon={faUserCircle} className="login-icon" />
        <h2 className="login-title">Welcome Back!</h2>

        {error && <p className="error-message">{error}</p>}

        {/* Username Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="login-input"
            required
          />
        </div>

        {/* Password Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
            required
          />
        </div>

        {/* Forgot Password Link */}
        <a href="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </a>

        {/* Login Button */}
        <button type="submit" className="login-button">
          Login
        </button>

        {/* Register Link */}
        <a href="/register" className="register-link">
          Don't have an account? Register
        </a>
      </form>
    </div>
  );
};

export default StationLogin;