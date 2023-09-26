import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { IconMenu } from '@trussworks/react-uswds';
import classnames from 'classnames';

import { NavContext } from 'components/Header/navContext';
import UswdsReactLink from 'components/LinkWrapper';
import NavigationBar from 'components/NavigationBar';
import ServiceAlert from 'components/ServiceAlert';
import { localAuthStorageKey } from 'constants/localAuth';
import useCheckResponsiveScreen from 'hooks/checkMobile';

import './index.scss';

type HeaderProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const Header = ({ children }: HeaderProps) => {
  const { authState, oktaAuth } = useOktaAuth();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const { isMobileSideNavExpanded, setIsMobileSideNavExpanded } = useContext(
    NavContext
  );
  const dropdownNode = useRef<any>();
  const mobileSideNav = useRef<any>();
  const navbarRef = useRef<HTMLDivElement | null>(null); // Ref used for setting setNavbarHeight

  const isMobile = useCheckResponsiveScreen('tablet');

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

  useEffect(() => {
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

    document.addEventListener('mouseup', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, [setIsMobileSideNavExpanded]);

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
    <>
      {!authState?.isAuthenticated && (
        <ServiceAlert translationKey="govShutdown" landing />
      )}
      <header
        className={classnames('usa-header easi-header', {
          'sticky sticky-nav-header display-block navigation__content': isMobile
        })}
        role="banner"
        ref={navbarRef}
      >
        <div className="grid-container easi-header__basic">
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
              <button
                type="button"
                className="usa-menu-btn"
                onClick={() => setIsMobileSideNavExpanded(true)}
              >
                <IconMenu size={3} />
              </button>
            </div>
          ) : (
            <Link className="easi-header__nav-link" to="/signin">
              {t('header:signIn')}
            </Link>
          )}
        </div>

        <div
          className={classnames('usa-overlay', {
            'is-visible': isMobileSideNavExpanded
          })}
        />

        {/* Mobile Display */}
        <div ref={mobileSideNav} className={mobileSideNavClasses}>
          <div className="usa-nav__inner">
            {children}
            {authState?.isAuthenticated ? (
              <NavigationBar
                mobile
                toggle={setIsMobileSideNavExpanded}
                signout={signout}
                userName={userName}
              />
            ) : (
              <UswdsReactLink className="easi-header__nav-link" to="/signin">
                {t('header:signIn')}
              </UswdsReactLink>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
