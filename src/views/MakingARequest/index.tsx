import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { RequestType } from 'types/graphql-global-types';
import Table from 'views/MyRequests/Table';

const MakingARequest = () => {
  const { t } = useTranslation('makingARequest');
  const reasons = t('reasonList.options', { returnObjects: true }) as string[];

  return (
    <MainContent
      className="grid-container line-height-body-5 margin-bottom-5"
      data-testid="making-a-system-request"
    >
      <PageHeading>{t('heading')}</PageHeading>
      <p>{t('reasonList.intro')}</p>
      <ul>
        {reasons.map(option => (
          <li key={option}>{option}</li>
        ))}
      </ul>
      <p>
        {t('forEnterpriseArchitectureHelp.message')}&nbsp;
        <UswdsLink href={`mailto:${t('forEnterpriseArchitectureHelp.email')}`}>
          {t('forEnterpriseArchitectureHelp.email')}
        </UswdsLink>
        .
      </p>
      <p className="margin-bottom-3">
        {t('forOtherQuestions.message')}&nbsp;
        <UswdsLink href={`mailto:${t('forOtherQuestions.email')}`}>
          {t('forOtherQuestions.email')}
        </UswdsLink>
        .
      </p>
      <Link to="/system/request-type" className="usa-button">
        {t('nextStep')}
      </Link>
      <h2 className="padding-top-2 margin-top-5 easi-section__border-top">
        {t('myRequests')}
      </h2>
      <Table
        type={RequestType.GOVERNANCE_REQUEST}
        hiddenColumns={['Governance', 'Upcoming meeting date']}
      />
    </MainContent>
  );
};

export default MakingARequest;
