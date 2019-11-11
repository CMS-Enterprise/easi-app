import React from 'react';
import { Link } from 'react-router-dom';

type NavBarProps = {
  isAuthenticated: boolean | null;
  handleLogout: () => void | null;
};

const NavBar = ({ isAuthenticated, handleLogout }: NavBarProps) => {
  return (
    <nav className="navbar">
      <img
        alt="Logo"
        className="navbar__logo"
        src="https://pngimage.net/wp-content/uploads/2018/05/demo-logo-png.png"
      />
      <div className="navbar__link-container">
        <Link className="navbar__nav-link" to="/">
          Home
        </Link>
        {isAuthenticated ? (
          <button
            className="navbar__logout-btn"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link className="navbar__nav-link" to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

NavBar.defaultProps = {
  isAuthenticated: false,
  handleLogout: () => {}
};

export default NavBar;
