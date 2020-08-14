import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { SecureRoute, useOktaAuth } from '@okta/okta-react';
import { FormikProps } from 'formik';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import { AppState } from 'reducers/rootReducer';
import {
  clearSystemIntake,
  fetchSystemIntake,
  postSystemIntake,
  saveSystemIntake,
  storeSystemIntake
} from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

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

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );

  const isSaving = useSelector(
    (state: AppState) => state.systemIntake.isSaving
  );

  const dispatchSave = () => {
    const { current }: { current: FormikProps<SystemIntakeForm> } = formikRef;
    if (current && current.dirty && !isSaving) {
      if (systemId === 'new') {
        dispatch(postSystemIntake({ ...systemIntake, ...current.values }));
      } else {
        dispatch(
          saveSystemIntake({ ...systemIntake, ...current.values, id: systemId })
        );
      }
      current.resetForm({ values: current.values, errors: current.errors });
    }
  };

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
              component: '',
              email: user.email
            }
          })
        );
      });
    } else {
      dispatch(fetchSystemIntake(systemId));
    }
    return () => {
      // clear system intake from store when component is unmounting
      dispatch(clearSystemIntake());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pageSlugs = ['contact-details', 'request-details', 'review'];
    if (!pageSlugs.includes(formPage)) {
      history.replace(`/system/${systemId}/contact-details`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemId, formPage]);

  return (
    <div className="system-intake margin-bottom-5">
      <Header />
      <MainContent className="grid-container">
        {isLoading === false && (
          <>
            <SecureRoute
              path="/system/:systemId/contact-details"
              render={() => (
                <ContactDetails
                  formikRef={formikRef}
                  systemIntake={systemIntake}
                  dispatchSave={dispatchSave}
                />
              )}
            />
            <SecureRoute
              path="/system/:systemId/request-details"
              render={() => (
                <RequestDetails
                  formikRef={formikRef}
                  systemIntake={systemIntake}
                  dispatchSave={dispatchSave}
                />
              )}
            />
            <SecureRoute
              path="/system/:systemId/review"
              render={() => <Review systemIntake={systemIntake} />}
            />
          </>
        )}
      </MainContent>
    </div>
  );
};

export default SystemIntake;
