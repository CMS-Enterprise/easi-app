import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import useAuth from 'hooks/useAuth';
import './index.scss';

type HeaderProps = {
  auth: any;
  secondaryNavList: any[];
  activeNavListItem: string;
};

export const Header = ({
  auth,
  secondaryNavList = [],
  activeNavListItem
}: HeaderProps) => {
  const [isAuthenticated, user = {}, handleLogout] = useAuth(auth);
  return (
    <header className="usa-header site-header easi-header" role="banner">
      <div className="usa-nav-container usa-navbar site-header-navbar">
        <div className="usa-logo site-logo" id="logo">
          <em className="usa-logo__text">
            <Link to="/" title="Home" aria-label="EASi home">
              EASi
            </Link>
          </em>
        </div>
        <button type="button" className="usa-menu-btn">
          <span className="fa fa-bars" />
        </button>
        <div className="navbar--container">
          {user && user.email && (
            <span className="easi-navbar-link">{user.email}</span>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              className="easi-navbar-link"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link className="easi-navbar-link" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Secondary Nav */}
      {secondaryNavList.length > 0 && (
        <nav aria-label="Primary navigation" className="easi-secondary-nav">
          <div className="usa-nav-container">
            <div className="usa-nav__inner">
              <button type="button" className="usa-nav__close">
                <span className="fa fa-close" />
              </button>
              <ul className="usa-nav__primary usa-accordion">
                {secondaryNavList.map(item => (
                  <li
                    className={`usa-nav__primary-item ${
                      activeNavListItem === item.slug ? 'usa-current' : ''
                    }`.trim()}
                  >
                    <Link className="usa-nav__link" to={item.link}>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Display */}
      <nav role="navigation" className="usa-nav site-nav sidenav-mobile">
        <button type="button" className="usa-nav__close">
          <span className="fa fa-close" />
        </button>

        <div className="usa-nav__inner">
          {secondaryNavList.length > 0 && (
            <ul className="usa-nav__primary usa-accordion">
              {secondaryNavList.map(item => (
                <li className="usa-nav__primary-item">
                  <Link to={item.slug}>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              className="easi-navbar-link"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <a className="easi-navbar-link" href="/download/">
              Login
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};

export default withAuth(Header);
