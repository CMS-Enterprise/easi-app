import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import classnames from 'classnames';

import UsGovBanner from 'components/UsGovBanner';

import { UserAction, UserActionList } from './UserActionList';

import './index.scss';

type HeaderProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const Header = ({ children }: HeaderProps) => {
  const { authState, authService } = useOktaAuth();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const dropdownNode = useRef<any>();

  useEffect(() => {
    if (authState.isAuthenticated) {
      authService.getUser().then((info: any) => {
        setUserName(info.name);
      });
    }
  }, [authState, authService]);

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
    <header className="usa-header easi-header" role="banner">
      <UsGovBanner />
      <div className="grid-container easi-header__basic">
        <div className="usa-logo site-logo" id="logo">
          <Link to="/">
            <em className="usa-logo__text" aria-label={t('header:returnHome')}>
              {t('general:appName')}
            </em>
          </Link>
        </div>
        <button type="button" className="usa-menu-btn">
          <span className="fa fa-bars" />
        </button>
        <div className="navbar--container">
          {authState.isAuthenticated ? (
            <div className="easi-header__dropdown-wrapper" ref={dropdownNode}>
              <button
                aria-label={
                  displayDropdown ? 'Collapse User Menu' : 'Expand User Menu'
                }
                aria-expanded={displayDropdown}
                aria-controls="Header-UserActionsList"
                type="button"
                className="easi-header__username"
                onClick={() => {
                  setDisplayDropdown(!displayDropdown);
                }}
              >
                {userName}
                <i className={arrowClassname} />
              </button>
              {displayDropdown && (
                <UserActionList id="Header-UserActionsList">
                  <UserAction link="/governance-overview">
                    {t('header:addSystem')}
                  </UserAction>
                  <UserAction
                    onClick={() => {
                      authService.logout();
                    }}
                  >
                    {t('header:signOut')}
                  </UserAction>
                </UserActionList>
              )}
            </div>
          ) : (
            <Link className="easi-header__nav-link" to="/signin">
              {t('header:signIn')}
            </Link>
          )}
        </div>
      </div>

      <div className="grid-container easi-header--desktop ">{children}</div>

      {/* Mobile Display */}
      <div className="usa-nav sidenav-mobile">
        <button type="button" className="usa-nav__close" aria-label="Close">
          <span className="fa fa-close" />
        </button>
        <div className="usa-nav__inner">
          {children}
          {authState.isAuthenticated ? (
            <button
              type="button"
              className="easi-header__nav-link"
              onClick={() => {
                authService.logout();
              }}
            >
              {t('header:signOut')}
            </button>
          ) : (
            <a className="easi-header__nav-link" href="/signin">
              {t('header:signIn')}
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
