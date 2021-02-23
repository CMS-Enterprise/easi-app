import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Alert } from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import RequestRepository from 'components/RequestRepository';
import useConfirmationText from 'hooks/useConfirmationText';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import List from 'views/Accessibility/AccessibiltyRequest/List';

import SystemIntakeBanners from './SystemIntakeBanners';
import WelcomeText from './WelcomeText';

import './index.scss';

const Home = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const confirmationText = useConfirmationText();

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
            <div className="margin-y-6">
              <SystemIntakeBanners />
            </div>
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
      <MainContent className="margin-bottom-5">
        {confirmationText && (
          <div className="grid-container margin-top-6">
            <Alert type="success" slim role="alert">
              {confirmationText}
            </Alert>
          </div>
        )}
        {renderView()}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default withRouter(Home);
