import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

const WelcomeText = () => {
  const { t } = useTranslation('home');
  const { authState } = useOktaAuth();

  const easiTasks: string[] = t('easiTasks', {
    returnObjects: true
  });

  return (
    <div className="tablet:grid-col-9">
      <PageHeading>{t('home:title')}</PageHeading>
      <p>{t('easiPurpose')}</p>
      <ul className="line-height-body-5 margin-bottom-4">
        {easiTasks.map(task => (
          <li key={task}>{task}</li>
        ))}
      </ul>
      {authState.isAuthenticated ? (
        <UswdsLink
          className="usa-button"
          asCustom={Link}
          variant="unstyled"
          to="/system/request-type"
        >
          {t('startNow')}
        </UswdsLink>
      ) : (
        <UswdsLink
          className="usa-button"
          asCustom={Link}
          variant="unstyled"
          to="/signin"
        >
          {t('signIn')}
        </UswdsLink>
      )}
    </div>
  );
};

export default WelcomeText;
