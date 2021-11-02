import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';

const SystemProfileHome = () => {
  const { t } = useTranslation('systemProfile');

  return (
    <PageWrapper data-testid="system-profile">
      <Header />
      <MainContent className="grid-container line-height-body-5 margin-bottom-5">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>System Profile</Breadcrumb>
        </BreadcrumbBar>

        <PageHeading>{t('heading')}</PageHeading>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemProfileHome;
