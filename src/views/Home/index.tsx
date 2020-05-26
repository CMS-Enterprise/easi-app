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
import Button from 'components/shared/Button';

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
        case 'SUBMITTED':
          return (
            <ActionBanner
              key={intake.id}
              title={
                intake.requestName
                  ? `${intake.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="Your intake form has been submitted. The admin team will be in touch with you to fill out a Business Case"
              onClick={() => {
                // TODO: Append /general-request-info to the end when the route gets merged.
                history.push(`/business/new`);
              }}
              label="Start my Business Case"
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
          <p className="line-height-body-5 font-body-lg text-light">
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
                href="https://share.cms.gov/Office/OIT/CIOCorner/Lists/Intake/NewForm.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                alternative request form
              </a>
              .
            </p>
          </div>
          {authState.isAuthenticated ? (
            <Button to="/governance-overview">Start now</Button>
          ) : (
            <Button to="/login">Sign in to start</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Home);
