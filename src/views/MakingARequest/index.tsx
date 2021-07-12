import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Link as UswdsLink
} from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';

const MakingARequest = () => {
  const { t } = useTranslation('makingARequest');
  const reasons = t('reasonList.options', { returnObjects: true }) as string[];

  return (
    <PageWrapper data-testid="making-a-system-request">
      <Header />
      <MainContent className="grid-container line-height-body-5 margin-bottom-5">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>IT Governance</Breadcrumb>
        </BreadcrumbBar>

        <PageHeading>{t('heading')}</PageHeading>
        <p>{t('reasonList.intro')}</p>
        <ul>
          {reasons.map(option => (
            <li key={option}>{option}</li>
          ))}
        </ul>
        <p>
          {t('forEnterpriseArchitectureHelp.message')}&nbsp;
          <UswdsLink
            href={`mailto:${t('forEnterpriseArchitectureHelp.email')}`}
          >
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
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default MakingARequest;
