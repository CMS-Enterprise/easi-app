import React from 'react';
import { useTranslation } from 'react-i18next';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';

import Table from './Table';

const MyRequests = () => {
  const { t } = useTranslation('home');

  return (
    <PageWrapper>
      <Header />
      <MainContent className="margin-bottom-5">
        <div className="grid-container">
          <PageHeading>{t('requestsTable.heading')}</PageHeading>
          <Table />
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default MyRequests;
