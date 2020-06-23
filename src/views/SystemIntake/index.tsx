import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SecureRoute, useOktaAuth } from '@okta/okta-react';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import { AppState } from 'reducers/rootReducer';
import {
  fetchSystemIntake,
  storeSystemIntake,
  clearSystemIntake
} from 'types/routines';
import ContactDetails from './ContactDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import './index.scss';

export const SystemIntake = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { systemId, formPage } = useParams();
  const { authService } = useOktaAuth();

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );

  useEffect(() => {
    if (systemId === 'new') {
      authService.getUser().then((user: any) => {
        dispatch(
          storeSystemIntake({
            requester: {
              name: user.name,
              component: ''
            }
          })
        );
      });
    } else {
      dispatch(fetchSystemIntake(systemId));
    }
    // This return will clear system intake from store when component is unmounted
    return () => {
      dispatch(clearSystemIntake());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (systemIntake.id) {
      history.replace(`/system/${systemIntake.id}/${formPage}`);
    }
  }, [history, systemIntake.id, formPage]);

  useEffect(() => {
    // If a user tries to visit a form page we don't have, send them to contact details
    const currentPage = String(formPage);
    const pageSlugs = ['contact-details', 'request-details', 'review'];
    if (!pageSlugs.includes(currentPage)) {
      history.replace(`/system/${systemId}/contact-details`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemId, formPage]);

  return (
    <div className="system-intake margin-bottom-5">
      <Header name="EASi System Intake" />
      <MainContent className="grid-container">
        <SecureRoute
          path="/system/:systemId/contact-details"
          render={() => <ContactDetails initialValues={systemIntake} />}
        />
        <SecureRoute
          path="/system/:systemId/request-details"
          render={() => <RequestDetails initialValues={systemIntake} />}
        />
        <SecureRoute
          path="/system/:systemId/review"
          render={() => <Review />}
        />
      </MainContent>
    </div>
  );
};

export default SystemIntake;
