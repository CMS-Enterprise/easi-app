import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import Table from './Table';

const MyRequests = () => {
  const { t } = useTranslation('home');

  return (
    <MainContent className="margin-bottom-5">
      <div className="grid-container margin-y-2">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>{t('requestsTable.breadcrumb.home')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{t('requestsTable.breadcrumb.table')}</Breadcrumb>
        </BreadcrumbBar>
        <PageHeading>{t('requestsTable.heading')}</PageHeading>
        <Table />
      </div>
    </MainContent>
  );
};

export default MyRequests;
