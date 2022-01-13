import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOktaAuth } from '@okta/okta-react';

import UswdsReactLink from 'components/LinkWrapper';
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
      {authState?.isAuthenticated ? (
        <UswdsReactLink
          className="usa-button"
          variant="unstyled"
          link="/system/request-type"
        >
          {t('startNow')}
        </UswdsReactLink>
      ) : (
        <UswdsReactLink
          className="usa-button"
          variant="unstyled"
          link="/signin"
        >
          {t('signIn')}
        </UswdsReactLink>
      )}
    </div>
  );
};

export default WelcomeText;
