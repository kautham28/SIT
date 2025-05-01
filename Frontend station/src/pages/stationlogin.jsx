import React, { useState } from "react";
import "./stationlogin.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Import icons

const StationLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <FontAwesomeIcon icon={faUserCircle} className="login-icon" />
        <h2 className="login-title">Welcome Back!</h2>

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

        <a href="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </a>
        <button type="submit" className="login-button">
          Login
        </button>
        <a href="/register" className="register-link">
          Don't have an account? Register
        </a>
      </form>
    </div>
  );
};

export default StationLogin;