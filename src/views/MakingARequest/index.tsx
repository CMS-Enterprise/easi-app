import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

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
      <MainContent className="grid-container line-height-body-5">
        <PageHeading>{t('heading')}</PageHeading>
        <p>{t('reasonList.intro')}</p>
        <ul>
          {reasons.map(option => (
            <li>{option}</li>
          ))}
        </ul>
        <p>
          {t('forEnterpriseArchitectureHelp.message')}&nbsp;
          <Link href={`mailto:${t('forEnterpriseArchitectureHelp.email')}`}>
            {t('forEnterpriseArchitectureHelp.email')}
          </Link>
          .
        </p>
        <p>
          {t('forOtherQuestions.message')}&nbsp;
          <Link href={`mailto:${t('forOtherQuestions.email')}`}>
            {t('forOtherQuestions.email')}
          </Link>
          .
        </p>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default MakingARequest;
