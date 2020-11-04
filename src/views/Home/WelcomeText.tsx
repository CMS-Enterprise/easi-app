import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link as UswdsLink } from '@trussworks/react-uswds';

const WelcomeText = () => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();

  return (
    <div className="tablet:grid-col-9">
      <h1 className="margin-top-6">{t('home:title')}</h1>
      <p className="line-height-body-5 font-body-lg text-light">
        {t('home:subtitle')}
      </p>
      <div className="easi-home__info-wrapper">
        <div className="easi-home__info-icon">
          <i className="fa fa-info" />
        </div>
        <p className="line-height-body-5">
          <Trans i18nKey="home:easiInfo">
            zeroIndex
            <a
              href="https://share.cms.gov/Office/OIT/CIOCorner/Lists/Intake/NewForm.aspx"
              target="_blank"
              rel="noopener noreferrer"
            >
              localeLink
            </a>
          </Trans>
        </p>
      </div>
      {authState.isAuthenticated ? (
        <UswdsLink
          className="usa-button"
          asCustom={Link}
          variant="unstyled"
          to="/governance-overview"
        >
          {t('home:startNow')}
        </UswdsLink>
      ) : (
        <UswdsLink
          className="usa-button"
          asCustom={Link}
          variant="unstyled"
          to="/signin"
        >
          {t('home:signIn')}
        </UswdsLink>
      )}
    </div>
  );
};

export default WelcomeText;
