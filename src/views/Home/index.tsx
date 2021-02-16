import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, withRouter } from 'react-router-dom';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import RequestRepository from 'components/RequestRepository';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import List from 'views/Accessibility/AccessibiltyRequest/List';

import SystemIntakeBanners from './SystemIntakeBanners';
import WelcomeText from './WelcomeText';

import './index.scss';

const Banners = () => {
  const history = useHistory();
  const location = useLocation<any>();
  const [confirmationText, setIsConfirmationText] = useState('');

  useEffect(() => {
    if (location.state && location.state.confirmationText) {
      setIsConfirmationText(location.state.confirmationText);
      history.replace({
        pathname: '/',
        state: {}
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="margin-y-6">
      {confirmationText && (
        <div className="border-05 border-green">
          <div className="fa fa-check fa-2x display-inline-block text-middle text-green margin-left-1 margin-right-2" />
          <p
            role="alert"
            className="display-inline-block text-middle margin-y-105"
          >
            {confirmationText}
          </p>
        </div>
      )}
      <SystemIntakeBanners />
    </div>
  );
};

const Home = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  const renderView = () => {
    if (isUserSet) {
      if (
        user.isAccessibilityAdmin(userGroups) ||
        user.isAccessibilityTester(userGroups)
      ) {
        return <List />;
      }

      if (user.isGrtReviewer(userGroups)) {
        return (
          <div className="grid-container">
            <RequestRepository />
          </div>
        );
      }

      if (user.isBasicUser(userGroups)) {
        return (
          <div className="grid-container">
            <Banners />
            <WelcomeText />
          </div>
        );
      }
    }
    return (
      <div className="grid-container">
        <WelcomeText />
      </div>
    );
  };

  return (
    <PageWrapper>
      <Header />
      <MainContent className="margin-bottom-5">{renderView()}</MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default withRouter(Home);
