import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import classnames from 'classnames';

import NavigationBar from 'components/NavigationBar';
import UsGovBanner from 'components/UsGovBanner';
import { localAuthStorageKey } from 'constants/localAuth';

import './index.scss';

type HeaderProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const Header = ({ children }: HeaderProps) => {
  const { authState, oktaAuth } = useOktaAuth();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [isMobileSideNavExpanded, setIsMobileSideNavExpanded] = useState(false);
  const dropdownNode = useRef<any>();
  const mobileSideNav = useRef<any>();

  useEffect(() => {
    let isMounted = true;
    if (authState?.isAuthenticated) {
      oktaAuth.getUser().then((info: any) => {
        if (isMounted) {
          setUserName(info.name);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [authState, oktaAuth]);

  const handleClick = (e: Event) => {
    if (
      dropdownNode &&
      dropdownNode.current &&
      dropdownNode.current.contains(e.target)
    ) {
      return;
    }

    if (
      mobileSideNav &&
      mobileSideNav.current &&
      mobileSideNav.current.contains(e.target)
    ) {
      return;
    }

    setIsMobileSideNavExpanded(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isMobileSideNavExpanded && window.innerWidth > 1023) {
        setIsMobileSideNavExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mobileSideNavClasses = classnames('usa-nav', 'sidenav-mobile', {
    'is-visible': isMobileSideNavExpanded
  });

  const signout = () => {
    localStorage.removeItem(localAuthStorageKey);
    oktaAuth.signOut();
  };

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
        {authState?.isAuthenticated ? (
          <div>
            <div className="navbar--container easi-nav__user">
              {userName}
              <div>&nbsp; | &nbsp;</div>
              <button
                type="button"
                className="usa-button usa-button--unstyled"
                data-testid="signout-link"
                aria-expanded="false"
                aria-controls="sign-out"
                onClick={signout}
              >
                {t('header:signOut')}
              </button>
            </div>
            <button
              type="button"
              className="usa-menu-btn"
              onClick={() => setIsMobileSideNavExpanded(true)}
            >
              <span className="fa fa-bars" />
            </button>
          </div>
        ) : (
          <Link className="easi-header__nav-link" to="/signin">
            {t('header:signIn')}
          </Link>
        )}
      </div>

      {authState?.isAuthenticated && <NavigationBar />}

      <div className="grid-container easi-header--desktop ">{children}</div>
      <div
        className={classnames('usa-overlay', {
          'is-visible': isMobileSideNavExpanded
        })}
      />
      {/* Mobile Display */}
      <div ref={mobileSideNav} className={mobileSideNavClasses}>
        <button
          type="button"
          className="usa-nav__close"
          aria-label="Close"
          onClick={() => setIsMobileSideNavExpanded(false)}
        >
          <span className="fa fa-close fa-2x easi-header__close" />
        </button>
        <div className="usa-nav__inner">
          {children}
          {authState?.isAuthenticated ? (
            <NavigationBar mobile signout={signout} userName={userName} />
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
