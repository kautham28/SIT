import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  // Check if user is logged in - this is a placeholder
  // In a real app, you would check authentication state
  const isLoggedIn = location.pathname === '/qr';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⛽</span>
          <span className="logo-text">Fuel Pass</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={isOpen ? 'hamburger active' : 'hamburger'}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/qr" className="nav-link" onClick={() => setIsOpen(false)}>
                  My QR
                </Link>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
