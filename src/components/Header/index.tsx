import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import useAuth from 'hooks/useAuth';

type HeaderProps = {
  auth: any;
};

export const Header = ({ auth }: HeaderProps) => {
  const [isAuthenticated, user = {}, handleLogout] = useAuth(auth);
  return (
    <header className="usa-header usa-header--basic" role="banner">
      <div className="usa-nav-container header-widescreen">
        <div className="usa-navbar">
          <div className="usa-logo" id="basic-logo">
            <em className="usa-logo__text">
              <Link to="/" title="Home" aria-label="Home">
                EASi
              </Link>
            </em>
          </div>
          <button type="button" className="usa-menu-btn">
            <span className="fa fa-bars" />
          </button>
        </div>
        <nav className="usa-nav" aria-label="Primary navigation">
          <button type="button" className="usa-nav__close">
            <span className="fa fa-close" />
          </button>
          <ul className="usa-nav__primary usa-accordion">
            {isAuthenticated && (
              <li className="usa-nav__primary-item">
                <a className="usa-nav__link" href="/">
                  {user && user.email}
                </a>
              </li>
            )}
            <li className="usa-nav__primary-item">
              {isAuthenticated ? (
                <button
                  type="button"
                  className="usa-nav__link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <Link className="usa-nav__link" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default withAuth(Header);
