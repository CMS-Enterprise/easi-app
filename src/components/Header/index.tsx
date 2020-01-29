import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import useAuth from 'hooks/useAuth';
import HeaderWrapper from 'components/Header/HeaderWrapper';
import './index.scss';

type HeaderProps = {
  auth: any;
  children: React.ReactNode | React.ReactNodeArray;
  name: string;
};

const easiLogo = (
  <Link to="/" title="Home" aria-label="EASi home">
    EASi
  </Link>
);

const intakeLogo = <span aria-label="EASi home">CMS System Intake</span>;

export const Header = ({ auth, children, name }: HeaderProps) => {
  const [isAuthenticated, user = {}, handleLogout] = useAuth(auth);
  let logo;
  if (name === 'EASI') {
    logo = easiLogo;
  } else if (name === 'INTAKE') {
    logo = intakeLogo;
  }
  return (
    <header
      className="usa-header usa-header--extended easi-header"
      role="banner"
    >
      <HeaderWrapper className="usa-navbar">
        <div className="usa-logo site-logo" id="logo">
          <em className="usa-logo__text">{logo}</em>
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
      </HeaderWrapper>

      <div className="easi-header--desktop">{children}</div>

      {/* Mobile Display */}
      <div className="usa-nav sidenav-mobile">
        <button type="button" className="usa-nav__close">
          <span className="fa fa-close" />
        </button>
        <div className="usa-nav__inner">
          {children}
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
