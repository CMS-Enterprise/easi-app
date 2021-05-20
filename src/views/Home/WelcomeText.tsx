import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

const WelcomeText = () => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();

  return (
    <div className="tablet:grid-col-9">
      <PageHeading>{t('home:title')}</PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-bottom-6">
        {t('home:subtitle')}
      </p>
      {!authState.isAuthenticated && (
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
