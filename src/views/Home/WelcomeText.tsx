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
    <div className="tablet:grid-col-9 margin-bottom-8">
      <PageHeading className="margin-bottom-1">{t('home:title')}</PageHeading>
      <p className="margin-top-1 margin-bottom-5 font-body-lg text-light line-height-body-5">
        {t('easiIntro')}
      </p>
      <p className="font-body-lg text-light line-height-body-5 margin-bottom-1">
        {t('easiPurpose')}
      </p>
      <ul className="font-body-lg text-light line-height-body-5 margin-top-1 margin-bottom-4">
        {easiTasks.map(task => (
          <li key={task}>{task}</li>
        ))}
      </ul>
      {authState?.isAuthenticated ? (
        <UswdsReactLink
          className="usa-button"
          variant="unstyled"
          to="/system/request-type"
        >
          {t('startNow')}
        </UswdsReactLink>
      ) : (
        <UswdsReactLink className="usa-button" variant="unstyled" to="/signin">
          {t('signIn')}
        </UswdsReactLink>
      )}
    </div>
  );
};

export default WelcomeText;
