import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-background">
        {/* Removed animated circles */}
      </div>
      
      <div className="home-content">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">⛽</span>
          </div>
        </div>
        
        <h1>National Fuel Pass System</h1>
        <div className="divider"></div>
        
        <p>
          Welcome to Sri Lanka's official fuel management platform. Access your fuel quota, 
          track consumption, and manage your vehicles with our state-of-the-art system.
        </p>
        
        <div className="feature-highlights">
          <div className="feature">
            <div className="feature-icon">🚗</div>
            <div className="feature-text">Manage Multiple Vehicles</div>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <div className="feature-text">Track Fuel Usage</div>
          </div>
          <div className="feature">
            <div className="feature-icon">📱</div>
            <div className="feature-text">Mobile Access</div>
          </div>
        </div>
        
        <div className="home-buttons">
          <button className="register-button" onClick={handleRegister}>
            <span className="btn-text">Register Now</span>
          </button>
          <button className="login-button" onClick={handleLogin}>
            <span className="btn-icon">→</span>
            <span>Login</span>
          </button>
        </div>
        
        <div className="footer-text">
          Ministry of Power and Energy - Sri Lanka
        </div>
      </div>
    </div>
  );
};

export default Home;
