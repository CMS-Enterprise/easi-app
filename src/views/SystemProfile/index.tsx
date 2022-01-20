import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  SummaryBox
} from '@trussworks/react-uswds';

import BookmarkCardIcon from 'components/BookmarkCard/BookmarkCardIcon';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
// import SystemProfileHealthCard from 'components/SystemProfileHealthCard';
import NotFound from 'views/NotFound';
import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import './index.scss';

const SystemProfile = () => {
  const { systemId } = useParams<{ systemId: string }>();

  // TODO: Use GQL query for single system of CEDAR data
  const systemInfo = mockSystemInfo.find(
    mockSystem => mockSystem.id === systemId
  );

  if (systemInfo === undefined) {
    return <NotFound />;
  }

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <SummaryBox heading="" className="system-profile__summary-box">
          <Grid className="grid-container">
            <BreadcrumbBar variant="wrap">
              <Breadcrumb>
                <span>&larr; </span>
                <BreadcrumbLink asCustom={Link} to="/system-profile">
                  <span>Back to All Systems</span>
                </BreadcrumbLink>
              </Breadcrumb>
            </BreadcrumbBar>

            <PageHeading className="bookmark__title margin-top-2">
              <BookmarkCardIcon size="sm" className="margin-right-1" />{' '}
              {systemInfo.name}{' '}
              <span className="system-profile__acronym">
                ({systemInfo.acronym})
              </span>
            </PageHeading>
          </Grid>
        </SummaryBox>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemProfile;
