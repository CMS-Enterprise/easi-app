import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';

import './index.scss';

type NavigationProps = {
  mobile?: Boolean;
  signout?: () => void;
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

const NavigationBar = ({ mobile, signout }: NavigationProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const responsiveContainerClass = classnames('grid-container', {
    'navbar--container': !mobile
  });

  const responsiveNavClass = classnames('easi-nav', {
    'easi-nav__mobile': mobile
  });

  const responsiveNavItemClass = classnames('easi-nav__item', {
    'easi-nav__item__mobile': mobile
  });

  return (
    <nav aria-label={t('header:navigation')} data-testid="navigation-bar">
      <div className="navbar--divider" />
      <ul className={responsiveContainerClass}>
        {navLinks.map(route => (
          <li className={responsiveNavClass} key={route.label}>
            <div className={responsiveNavItemClass}>
              <Link to={route.link} className="navbar-link">
                <em
                  className="usa-logo__text"
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
        ))}
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
