import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import useAuth from 'hooks/useAuth';
import './index.scss';

type HeaderProps = {
  auth: any;
  secondaryNavList?: any[];
  activeNavListItem?: string;
  onSearch?: () => void;
};

export const Header = ({
  auth,
  secondaryNavList = [],
  activeNavListItem,
  onSearch
}: HeaderProps) => {
  const [isAuthenticated, user = {}, handleLogout] = useAuth(auth);
  return (
    <header className="usa-header site-header easi-header" role="banner">
      <div className="usa-navbar site-header-navbar easi-header__wrapper">
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

      <div className="easi-header__secondary-wrapper easi-header__wrapper">
        {/* Secondary Nav */}
        {secondaryNavList.length > 0 && (
          <nav
            aria-label="Primary navigation"
            className="easi-header__secondary-nav"
          >
            <div className="usa-nav__inner">
              <button type="button" className="usa-nav__close">
                <span className="fa fa-close" />
              </button>
              <ul className="usa-nav__primary usa-accordion">
                {secondaryNavList.map(item => (
                  <li
                    key={item.id}
                    className={`usa-nav__primary-item ${
                      activeNavListItem === item.slug ? 'usa-current' : ''
                    }`.trim()}
                    data-testid="header-nav-item"
                  >
                    <Link
                      className="easi-header__secondary-nav-link"
                      to={item.link}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        {onSearch && (
          <form className="usa-search usa-search--small">
            <div role="search">
              <input
                className="usa-input"
                id="basic-search-field-small"
                type="search"
                name="system-search"
              />
              <button className="usa-button" type="submit">
                <span className="usa-sr-only">Search</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Display */}
      <nav role="navigation" className="usa-nav site-nav sidenav-mobile">
        <button type="button" className="usa-nav__close">
          <span className="fa fa-close" />
        </button>
        {onSearch && (
          <form className="usa-search usa-search--small">
            <div role="search">
              <input
                className="usa-input"
                id="basic-search-field-small"
                type="search"
                name="system-search"
              />
              <button className="usa-button" type="submit">
                <span className="usa-sr-only">Search</span>
              </button>
            </div>
          </form>
        )}
        <div className="usa-nav__inner">
          {secondaryNavList.length > 0 && (
            <ul className="usa-nav__primary usa-accordion">
              {secondaryNavList.map(item => (
                <li key={item.id} className="usa-nav__primary-item">
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
            <a className="easi-navbar-link" href="/login">
              Login
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};

export default withAuth(Header);
