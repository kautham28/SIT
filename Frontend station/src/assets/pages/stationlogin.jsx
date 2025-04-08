import React, { useState } from "react";
import "./stationlogin.css"; // Import the CSS file

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
        <h2 className="login-title">Login</h2>
        <label htmlFor="username" className="login-label"></label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="login-input"
          required
        />
        <label htmlFor="password" className="login-label"></label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="login-input"
          required
        />
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