import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/navBar.css';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../image/logo.png';

function Navbar({ isLoggedIn, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const navigateToMarketplace = () => {
    closeMenus();
    navigate('/productList');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <Link to="/" className="navbar-logo" onClick={closeMenus}>
            <img src={logo} alt="Apartment CMS Logo" className="logo-image" />
          </Link>
        </div>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMenus}>
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/parking" className="nav-links" onClick={closeMenus}>
              About Us
            </Link>
          </li>

          <li className={`nav-item dropdown ${isDropdownOpen ? 'active' : ''}`}>
            <span className="nav-links dropdown-toggle" onClick={toggleDropdown}>
              Features ▾
            </span>
            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              <li>
                <span className="dropdown-link" onClick={navigateToMarketplace}>
                  Marketplace
                </span>
              </li>
              <li>
                <Link to="/payments" className="dropdown-link" onClick={closeMenus}>
                  Maintenance Request
                </Link>
              </li>
              <li>
                <Link to="/resident-portal" className="dropdown-link" onClick={closeMenus}>
                  Resident Portal
                </Link>
              </li>
              <li>
                <Link to="/smart-parking" className="dropdown-link" onClick={closeMenus}>
                  Smart Parking
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={closeMenus}>
              Contact Us
            </Link>
          </li>
        </ul>

        <div className="navbar-buttons">
          <Link to="/signup" className="get-started-btn" onClick={closeMenus}>
            Get Started
          </Link>
          {isLoggedIn ? (
            <button className="login-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <Link to="/login" className="login-btn" onClick={closeMenus}>
              <FaUser /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
