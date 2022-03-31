import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLaunch } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';

export default () => {
  const { t } = useTranslation('accessibility');
  return (
    <>
      <UswdsReactLink
        className="display-inline-block margin-top-3"
        target="_blank"
        rel="noopener noreferrer"
        to="/508/templates"
      >
        {t('requestDetails.testingTemplates')}
        <IconLaunch className="margin-left-05 margin-bottom-2px text-tbottom" />
      </UswdsReactLink>
      <UswdsReactLink
        className="display-inline-block margin-top-1"
        target="_blank"
        rel="noopener noreferrer"
        to="/508/testing-overview"
      >
        {t('requestDetails.testingSteps')}
        <IconLaunch className="margin-left-05 margin-bottom-2px text-tbottom" />
      </UswdsReactLink>
    </>
  );
};
