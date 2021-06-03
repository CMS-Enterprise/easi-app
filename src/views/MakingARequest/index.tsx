import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';

const MakingARequest = () => {
  const { t } = useTranslation('makingARequest');
  const reasons = t('reasonList.options', { returnObjects: true }) as string[];

  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container line-height-body-5 margin-bottom-5">
        <BreadcrumbNav className="margin-y-2">
          <li>
            <Link to="/">Home</Link>
            <i className="fa fa-angle-right margin-x-05" aria-hidden />
          </li>
          <li>IT Governance</li>
        </BreadcrumbNav>

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
