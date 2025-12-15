import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Link as UswdsLink,
  SummaryBox,
  SummaryBoxContent
} from '@trussworks/react-uswds';
import Table from 'features/Home/MyRequests/Table';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const MakingARequest = () => {
  const { t } = useTranslation('makingARequest');
  const reasons = t('reasonList.options', { returnObjects: true }) as string[];
  const environmentName = 'icpg-dev.crm9';
  const appID = 'bc878d88-0468-f011-bec2-001dd8062d4a';

  return (
    <MainContent
      className="grid-container line-height-body-5 margin-bottom-5"
      data-testid="making-a-system-request"
    >
      <PageHeading className="margin-bottom-0 margin-top-5">
        {t('heading')}
      </PageHeading>
      <p className="margin-top-0 font-body-lg">{t('subheading')}</p>
      <SummaryBox className="easi-request__container margin-bottom-3 padding-x-2 padding-y-1">
        <SummaryBoxContent>
          <p>{t('reasonList.intro')}</p>
          <ul>
            {reasons.map(option => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        </SummaryBoxContent>
      </SummaryBox>
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
      <Button
        type="button"
        className="usa-button"
        onClick={() => {
          window.open(
            `https://${environmentName}.dynamics.com/main.aspx?appid=${appID}&pagetype=entityrecord&etn=new_systemintake`,
            '_blank'
          );
        }}
        data-testid="collapsable-link"
      >
        {t('nextStep')}
      </Button>
      {/* <Link to="http://google.com" className="usa-button">
        {t('nextStep')}
      </Link> */}
      <h2 className="padding-top-2 margin-top-5 easi-section__border-top">
        {t('myRequests')}
      </h2>
      <Table
        type="itgov"
        hiddenColumns={[
          'Governance',
          'Upcoming meeting date',
          'Related systems'
        ]}
      />
    </MainContent>
  );
};

export default MakingARequest;
