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

  const responsiveCurrentClass = (current: boolean) =>
    classnames('easi-nav__item', {
      'easi-nav__not-current': !current
    });

  return (
    <nav aria-label={t('header:navigation')} data-testid="navigation-bar">
      <div className="navbar--divider" />
      <ul className={responsiveContainerClass}>
        {navLinks.map(route =>
          (!flags.systemProfile && route.label === 'systems') ||
          (!flags.help && route.label === 'help') ? null : (
            <li className="easi-nav" key={route.label}>
              <div
                className={responsiveCurrentClass(
                  location.pathname === route.link
                )}
              >
                <Link to={route.link} className="easi-nav__link">
                  <em
                    className="usa-logo__text easi-nav__label"
                    aria-label={t(`header:${route.label}`)}
                  >
                    {t(`header:${route.label}`)}
                  </em>
                  {location.pathname === route.link && (
                    <div className="easi-nav__current" />
                  )}
                </Link>
              </div>
            </li>
          )
        )}
        {mobile && userName && signout && (
          <div className="easi-nav__signout-container">
            <div className="easi-nav__user margin-bottom-1">{userName}</div>
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
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar;
