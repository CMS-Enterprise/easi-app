import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';
import useCheckResponsiveScreen from 'hooks/checkMobile';

import './index.scss';

export const Header = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');

  const isMobile = useCheckResponsiveScreen('tablet');

  const navbarRef = useRef<HTMLDivElement | null>(null); // Ref used for setting setNavbarHeight

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

  const signout = () => {
    localStorage.removeItem(localAuthStorageKey);
    oktaAuth.signOut();
  };

  return (
    <header className="usa-header easi-header" role="banner" ref={navbarRef}>
      <div className="grid-container easi-header__basic">
        {!isMobile && (
          <div className="usa-logo site-logo" id="logo">
            <Link to="/">
              <em
                className="usa-logo__text"
                aria-label={t('header:returnHome')}
              >
                {t('general:appName')}
              </em>
            </Link>
          </div>
        )}
        {authState?.isAuthenticated ? (
          <div>
            <div className="navbar--container easi-nav__user">
              <div className="easi-header__user">{userName}</div>
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
          </div>
        ) : (
          <Link className="easi-header__nav-link" to="/signin">
            {t('header:signIn')}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
