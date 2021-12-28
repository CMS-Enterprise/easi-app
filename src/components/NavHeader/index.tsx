import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import './index.scss';

const navLinks = [
  {
    link: '/',
    label: 'home'
  },
  {
    link: '/system/systems-list',
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

const NavHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <nav aria-label={t('header:navigation')}>
      <div className="navbar--divider" />
      <ul className="navbar--container grid-container">
        {navLinks.map(route => (
          <li className="easi-nav" key={route.label}>
            <div className="easi-nav__item">
              <Link to={route.link} className="navbar-link">
                <em
                  className="usa-logo__text absolute"
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
      </ul>
    </nav>
  );
};

export default NavHeader;
