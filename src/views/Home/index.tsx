import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useLocation, withRouter } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import ActionBanner from 'components/shared/ActionBanner';
import { useFlags } from 'contexts/flagContext';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import { Flags } from 'types/flags';
import { fetchBusinessCases } from 'types/routines';

import SystemIntakeBanners from './SystemIntakeBanners';
import WelcomeText from './WelcomeText';

import './index.scss';

type HomeProps = RouteComponentProps;

const Home = ({ history }: HomeProps) => {
  const { authState } = useOktaAuth();
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const businessCases = useSelector(
    (state: AppState) => state.businessCases.businessCases
  );

  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchBusinessCases());
    }
  }, [dispatch, authState.isAuthenticated]);

  const getBusinessCaseBanners = (flags: Flags) => {
    return businessCases.map((busCase: BusinessCaseModel) => {
      const path = flags.taskListLite
        ? `/governance-task-list/${busCase.systemIntakeId}`
        : `/business/${busCase.id}/general-request-info`;
      switch (busCase.status) {
        case 'DRAFT':
          return (
            <ActionBanner
              key={busCase.id}
              title={
                busCase.requestName
                  ? `${busCase.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="Your Business Case is incomplete, please submit it when you are ready so that we can move you to the next phase"
              onClick={() => {
                history.push(path);
              }}
              label="Go to Business Case"
            />
          );
        case 'SUBMITTED':
          return (
            <ActionBanner
              key={busCase.id}
              title={
                busCase.requestName
                  ? `${busCase.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="The form has been submitted for review. You can update it and re-submit it any time in the process"
              onClick={() => {
                history.push(path);
              }}
              label="Update Business Case"
            />
          );
        default:
          return null;
      }
    });
  };

  const flags = useFlags();
  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container margin-bottom-5">
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
          {getBusinessCaseBanners(flags)}
        </div>
        <WelcomeText />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default withRouter(Home);
