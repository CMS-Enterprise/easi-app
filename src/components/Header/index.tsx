import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import useAuth from 'hooks/useAuth';
import SearchBar from 'components/shared/SearchBar';
import SecondaryNav from 'components/shared/SecondaryNav';
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
    <header className="usa-header easi-header" role="banner">
      <div className="usa-navbar easi-header__wrapper">
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
            <span className="easi-header__nav-link">{user.email}</span>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              className="easi-header__nav-link"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link className="easi-header__nav-link" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="easi-header__wrapper easi-header__secondary-wrapper">
        {secondaryNavList.length > 0 && (
          <SecondaryNav
            secondaryNavList={secondaryNavList}
            activeNavItem={activeNavListItem}
          />
        )}

        {onSearch && <SearchBar name="system-search" onSearch={onSearch} />}
      </div>

      {/* Mobile Display */}
      <div className="usa-nav sidenav-mobile">
        <button type="button" className="usa-nav__close">
          <span className="fa fa-close" />
        </button>
        <div className="usa-nav__inner">
          {onSearch && <SearchBar name="system-search" onSearch={onSearch} />}
          {secondaryNavList.length > 0 && (
            <SecondaryNav
              secondaryNavList={secondaryNavList}
              activeNavItem={activeNavListItem}
            />
          )}

          {isAuthenticated ? (
            <button
              type="button"
              className="easi-header__nav-link"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <a className="easi-header__nav-link" href="/login">
              Login
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default withAuth(Header);
