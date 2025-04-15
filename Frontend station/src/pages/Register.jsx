import React, { useState } from "react";
import "./Register.css"; // Import the CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faMapPin,
  faEnvelope,
  faPhone,
  faLock,
  faUser,
  faGasPump,
  
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [formData, setFormData] = useState({
    stationName: "",
    location: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log("Form Data:", formData);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        {/* Icon and Heading */}
        <FontAwesomeIcon icon={faUserPlus} className="register-icon" />
        <h2 className="register-title">Create Account</h2>
        
        {/* Station Name Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faGasPump} className="input-icon" />
          <input
            type="text"
            name="stationName"
            value={formData.stationName}
            onChange={handleChange}
            placeholder="Station Name"
            className="register-input"
            required
          />
        </div>

        {/* Location Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faMapPin} className="input-icon" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="register-input"
            required
          />
        </div>

        {/* Username Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="register-input"
            required
          />
        </div>

        {/* Email Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="register-input"
            required
          />
        </div>

        {/* Phone Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faPhone} className="input-icon" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="register-input"
            required
          />
        </div>

        {/* Password Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="register-input"
            required
          />
        </div>

        {/* Confirm Password Field */}
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="register-input"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="register-button">
          Register
        </button>

        {/* Back to Login */}
<div className="back-to-login">
  <a href="/" className="login-link">Back to Login</a>
</div>
      </form>
    </div>
  );
};

export default Register;