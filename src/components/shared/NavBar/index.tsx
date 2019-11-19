import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import useAuth from 'hooks/useAuth';
import './index.scss';

type NavBarProps = {
  auth: any;
};

const NavBar = ({ auth }: NavBarProps) => {
  const [isAuthenticated, _user, handleLogout] = useAuth(auth);

  return (
    <nav className="navbar">
      <Link to="/">
        <img
          alt="Logo"
          className="navbar__logo"
          src="https://pngimage.net/wp-content/uploads/2018/05/demo-logo-png.png"
        />
      </Link>
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

export default withAuth(NavBar);
