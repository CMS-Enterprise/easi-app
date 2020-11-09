import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, withRouter } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import RequestRepository from 'components/RequestRepository';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';

import SystemIntakeBanners from './SystemIntakeBanners';
import WelcomeText from './WelcomeText';

import './index.scss';

const Banners = () => {
  const location = useLocation<any>();

  return (
    <div className="margin-y-6">
      {location.state && location.state.confirmationText && (
        <div className="border-05 border-green">
          <div className="fa fa-check fa-2x display-inline-block text-middle text-green margin-left-1 margin-right-2" />
          <p className="display-inline-block text-middle margin-y-105">
            {location.state.confirmationText}
          </p>
        </div>
      )}
      <SystemIntakeBanners />
    </div>
  );
};

const Home = () => {
  const { authState } = useOktaAuth();
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const userGroupsSet = useSelector(
    (state: AppState) => state.auth.userGroupsSet
  );

  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        {userGroupsSet &&
          (user.isGrtReviewer(userGroups) ? (
            <RequestRepository />
          ) : (
            <>
              <Banners />
              <WelcomeText />
            </>
          ))}
        {!authState.isAuthenticated && <WelcomeText />}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default withRouter(Home);
