import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import BreadcrumbNav from 'components/BreadcrumbNav';
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
        <div className="grid-container margin-y-2">
          <BreadcrumbNav>
            <li>
              <Link to="/">{t('requestsTable.breadcrumb.home')}</Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>{t('requestsTable.breadcrumb.table')}</li>
          </BreadcrumbNav>
          <PageHeading>{t('requestsTable.heading')}</PageHeading>
          <Table />
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default MyRequests;
