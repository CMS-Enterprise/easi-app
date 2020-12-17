import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import UsGovBanner from 'components/UsGovBanner';

import 'components/Header/index.scss';
// import './index.scss';

const Header = () => {
  const { t } = useTranslation();
  return (
    <header
      className="usa-header easi-header"
      style={{ zIndex: 10 }}
      role="banner"
      aria-label="United States website banner"
    >
      <UsGovBanner />
      <div
        className="grid-container easi-header__basic"
        style={{ height: '48px' }}
      >
        <div className="usa-logo site-logo" id="logo">
          <Link to="/">
            <em className="usa-logo__text" aria-label={t('header:returnHome')}>
              {t('general:appName')}
            </em>
          </Link>
        </div>
      </div>
      <nav className="site-nav-secondary sticky" style={{ display: 'none' }}>
        <ul>
          <li className="usa-nav__submenu-item">
            <a href="/how-to-use-uswds/">
              <span>How to use USWDS</span>
            </a>
          </li>

          <li className="usa-nav__submenu-item">
            <a href="/design-principles/">
              <span>Design principles</span>
            </a>
          </li>

          <li className="usa-nav__submenu-item is-current">
            <a href="/components/" className="usa-current">
              <span>Components</span>
            </a>
          </li>

          <li className="usa-nav__submenu-item">
            <a href="/design-tokens/">
              <span>Design tokens</span>
            </a>
          </li>

          <li className="usa-nav__submenu-item">
            <a href="/utilities/">
              <span>Utilities</span>
            </a>
          </li>

          <li className="usa-nav__submenu-item">
            <a href="/page-templates/">
              <span>Page templates</span>
            </a>
          </li>

          <li className="usa-nav__submenu-item">
            <a href="/about/">
              <span>About</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
