import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, withRouter } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import RequestRepository from 'components/RequestRepository';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';
import user from 'utils/user';

import SystemIntakeBanners from './SystemIntakeBanners';
import WelcomeText from './WelcomeText';

import './index.scss';

type BannersProps = {
  intakes: SystemIntakeForm[];
};
const Banners = ({ intakes }: BannersProps) => {
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
      <SystemIntakeBanners intakes={intakes} />
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { authState } = useOktaAuth();
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const openIntakes = useSelector(
    (state: AppState) => state.systemIntakes.openIntakes
  );
  const closedIntakes = useSelector(
    (state: AppState) => state.systemIntakes.closedIntakes
  );

  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchSystemIntakes());
    }
  }, [dispatch, authState.isAuthenticated]);

  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        {isUserSet &&
          (user.isGrtReviewer(userGroups) ? (
            <RequestRepository
              openIntakes={openIntakes}
              closedIntakes={closedIntakes}
            />
          ) : (
            <>
              <Banners intakes={openIntakes} />
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
