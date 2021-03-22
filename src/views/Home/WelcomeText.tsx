import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import PlainInfo from 'components/PlainInfo';

const WelcomeText = () => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();

  return (
    <div className="tablet:grid-col-9">
      <PageHeading>{t('home:title')}</PageHeading>
      <p className="line-height-body-5 font-body-lg text-light">
        {t('home:subtitle')}
      </p>
      <div className="margin-bottom-6">
        <PlainInfo>
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
        </PlainInfo>
      </div>
      {authState.isAuthenticated ? (
        <UswdsLink
          className="usa-button"
          asCustom={Link}
          variant="unstyled"
          to="/system/request-type"
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
