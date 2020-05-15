import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useOktaAuth } from '@okta/okta-react';

import Header from 'components/Header';
import ActionBanner from 'components/shared/ActionBanner';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';
import './index.scss';
import LinkButton from 'components/shared/LinkButton';

type HomeProps = RouteComponentProps;

const Home = ({ history }: HomeProps) => {
  const { authState } = useOktaAuth();
  const dispatch = useDispatch();
  const systemIntakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );
  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchSystemIntakes());
    }
  }, [dispatch, authState.isAuthenticated]);

  const getSystemIntakeBanners = () => {
    return systemIntakes.map((intake: SystemIntakeForm) => {
      switch (intake.status) {
        case 'DRAFT':
          // TODO: When content sweep gets merged, this needs to be requestName
          return (
            <ActionBanner
              key={intake.id}
              title={
                intake.requestName
                  ? `${intake.requestName}: Intake Request`
                  : 'Intake Request'
              }
              helpfulText="Your Intake Request is incomplete, please submit it when you are ready so that we can move you to the next phase"
              onClick={() => {
                history.push(`/system/${intake.id}`);
              }}
              label="Go to Intake Request"
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div>
      <Header />
      <div role="main" className="grid-container margin-y-6">
        {getSystemIntakeBanners()}
        <div className="tablet:grid-col-9">
          <h1 className="margin-top-6">Welcome to EASi</h1>
          <p className="line-height-body-5 font-body-lg">
            You can use EASi to go through the set of steps needed for Lifecycle
            ID approval by the Governance Review Board (GRB).
          </p>
          <div className="easi-home__info-wrapper">
            <div className="easi-home__info-icon">
              <i className="fa fa-info" />
            </div>
            <p className="line-height-body-5">
              Use this process only if you&apos;d like to add a new system,
              service or make major changes and upgrades to an existing one. For
              all other requests, please use the{' '}
              <a
                href="http://google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                alternative request form
              </a>
              .
            </p>
          </div>
          {authState.isAuthenticated ? (
            <LinkButton to="/overview">Start now</LinkButton>
          ) : (
            <LinkButton to="/login">Sign in to start</LinkButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Home);
