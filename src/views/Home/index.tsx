import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { withAuth } from '@okta/okta-react';

import useAuth from 'hooks/useAuth';
import Header from 'components/Header';
import Button from 'components/shared/Button';
import ActionBanner from 'components/shared/ActionBanner';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';
import './index.scss';

type HomeProps = RouteComponentProps & {
  auth: any;
};

const Home = ({ auth, history }: HomeProps) => {
  const [isAuthenticated] = useAuth(auth);
  const dispatch = useDispatch();
  const systemIntakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSystemIntakes());
    }
  }, [dispatch, isAuthenticated]);

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
          <p className="easi-home__body">
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
          {isAuthenticated ? (
            <Button
              type="button"
              onClick={() => {
                history.push('/system/new');
              }}
            >
              Start now
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                history.push('/login');
              }}
            >
              Sign in to start
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(withAuth(Home));
