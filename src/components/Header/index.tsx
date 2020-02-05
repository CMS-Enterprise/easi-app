import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { withAuth } from '@okta/okta-react';
import useAuth from 'hooks/useAuth';
import HeaderWrapper from './HeaderWrapper';
import { UserActionList, UserAction } from './UserActionList';
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
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const dropdownNode = useRef<any>();

  let logo;
  if (name === 'INTAKE') {
    logo = intakeLogo;
  } else {
    logo = easiLogo;
  }

  const handleClick = (e: Event) => {
    if (
      dropdownNode &&
      dropdownNode.current &&
      dropdownNode.current.contains(e.target)
    ) {
      return;
    }

    setDisplayDropdown(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, []);

  const arrowClassname = classnames(
    'fa',
    'fa-angle-down',
    'easi-header__caret',
    {
      'easi-header__caret--rotate': displayDropdown
    }
  );
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
          {user && user.name && (
            <span className="easi-header__username">{user.name}</span>
          )}
          {isAuthenticated ? (
            <div className="easi-header__dropdown-wrapper" ref={dropdownNode}>
              <button
                type="button"
                className={arrowClassname}
                onClick={() => {
                  setDisplayDropdown(!displayDropdown);
                }}
              />
              {displayDropdown && (
                <UserActionList>
                  <UserAction link="/system/new">Add New System</UserAction>
                  <UserAction onClick={handleLogout}>Log Out</UserAction>
                </UserActionList>
              )}
            </div>
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
        <button type="button" className="usa-nav__close" aria-label="Close">
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
