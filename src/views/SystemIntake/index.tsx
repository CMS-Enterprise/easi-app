import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { SecureRoute, useOktaAuth } from '@okta/okta-react';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import { AppState } from 'reducers/rootReducer';
import {
  fetchSystemIntake,
  storeSystemIntake,
  clearSystemIntake
} from 'types/routines';
import usePrevious from 'hooks/usePrevious';
import ContactDetails from './ContactDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import './index.scss';

export const SystemIntake = () => {
  const history = useHistory();
  const { systemId, formPage } = useParams();
  const { authService } = useOktaAuth();
  const dispatch = useDispatch();
  const formikRef: any = useRef();

  const isSubmitting = useSelector(
    (state: AppState) => state.systemIntake.isSubmitting
  );
  const isSaving = useSelector(
    (state: AppState) => state.systemIntake.isSaving
  );

  const error = useSelector((state: AppState) => state.systemIntake.error);
  const prevIsSubmitting = usePrevious(isSubmitting);

  useEffect(() => {
    if (systemIntake.id) {
      history.replace(`/system/${systemIntake.id}/${formPage}`);
    }
  }, [history, systemIntake.id, formPage]);

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
    // If a user tries to visit a form page we don't have, send them to contact details
    const currentPage = String(formPage);
    const pageSlugs = ['contact-details', 'request-details', 'review'];
    if (!pageSlugs.includes(currentPage)) {
      history.replace(`/system/${systemId}/contact-details`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemId, formPage]);

  useEffect(() => {
    if (prevIsSubmitting && !isSubmitting && !error) {
      history.push('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <div className="system-intake margin-bottom-5">
      <Header name="EASi System Intake" />
      <MainContent className="grid-container">
        <SecureRoute
          path="/system/:systemId/contact-details"
          render={() => (
            <ContactDetails formikRef={formikRef} systemId={systemId} />
          )}
        />
        <SecureRoute
          path="/system/:systemId/request-details"
          render={() => (
            <RequestDetails formikRef={formikRef} systemId={systemId} />
          )}
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
