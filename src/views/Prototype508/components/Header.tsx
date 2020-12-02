import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import UsGovBanner from 'components/UsGovBanner';

import 'components/Header/index.scss';

const Header = () => {
  const { t } = useTranslation();
  return (
    <header
      className="usa-header easi-header"
      style={{ zIndex: 10 }}
      role="banner"
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
    </header>
  );
};

export default Header;
