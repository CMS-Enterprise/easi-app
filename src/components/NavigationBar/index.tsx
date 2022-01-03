import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import './index.scss';

type NavigationProps = {
  mobile?: boolean;
  signout?: () => void;
  userName?: string;
};

export const navLinks = [
  {
    link: '/',
    label: 'home'
  },
  {
    link: '/system',
    label: 'systems'
  },
  {
    link: '/system/making-a-request',
    label: 'addSystem'
  },
  {
    link: '/508/making-a-request',
    label: 'add508Request'
  },
  {
    link: '/help',
    label: 'help'
  }
];

const NavigationBar = ({ mobile, signout, userName }: NavigationProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const flags = useFlags();

  const responsiveContainerClass = classnames('grid-container', {
    'navbar--container': !mobile
  });

  const responsiveNavClass = classnames('easi-nav', {
    'easi-nav__mobile': mobile
  });

  const responsiveNavItemClass = classnames('easi-nav__item', {
    'easi-nav__item__mobile': mobile
  });

  const responsiveNavLinkClass = classnames('easi-nav__link', {
    'easi-nav__link__mobile': mobile
  });

  const responsiveNavCurrentClass = classnames('easi-nav__current', {
    'easi-nav__current__mobile': mobile
  });

  return (
    <nav aria-label={t('header:navigation')} data-testid="navigation-bar">
      <div className="navbar--divider" />
      <ul className={responsiveContainerClass}>
        {navLinks.map(route =>
          (!flags.systemProfile && route.label === 'systems') ||
          (!flags.help && route.label === 'help') ? null : (
            <li className={responsiveNavClass} key={route.label}>
              <div className={responsiveNavItemClass}>
                <Link to={route.link} className={responsiveNavLinkClass}>
                  <em
                    className="usa-logo__text easi-nav__label"
                    aria-label={t(`header:${route.label}`)}
                  >
                    {t(`header:${route.label}`)}
                  </em>
                  {location.pathname === route.link && (
                    <div className={responsiveNavCurrentClass} />
                  )}
                </Link>
              </div>
            </li>
          )
        )}
        {mobile && userName && (
          <li className={responsiveNavClass} key="userName">
            <div className={responsiveNavItemClass}>
              <div className="logo__text nabar-link">{userName}</div>
            </div>
          </li>
        )}
        {mobile && signout && (
          <li className={responsiveNavClass} key="signout">
            <div className={responsiveNavItemClass}>
              <Link
                to="/"
                onClick={e => {
                  e.preventDefault();
                  signout();
                }}
                className="navbar-link"
              >
                <em className="usa-logo__text" aria-label={t('header:signOut')}>
                  {t('header:signOut')}
                </em>
              </Link>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar;
