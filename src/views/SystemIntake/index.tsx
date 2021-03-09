import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Switch, useHistory, useParams } from 'react-router-dom';
import { SecureRoute, useOktaAuth } from '@okta/okta-react';
import { FormikProps } from 'formik';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import usePrevious from 'hooks/usePrevious';
import { AppState } from 'reducers/rootReducer';
import {
  clearSystemIntake,
  fetchSystemIntake,
  postSystemIntake,
  saveSystemIntake,
  storeSystemIntake
} from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';
import { NotFoundPartial } from 'views/NotFound';

import Confirmation from './Confirmation';
import ContactDetails from './ContactDetails';
import ContractDetails from './ContractDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import SystemIntakeView from './ViewOnly';

import './index.scss';

export const SystemIntake = () => {
  const history = useHistory();
  const { systemId, formPage } = useParams<{
    systemId: string;
    formPage: string;
  }>();
  const { oktaAuth } = useOktaAuth();
  const dispatch = useDispatch();
  const formikRef: any = useRef();

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );
  const actionError = useSelector((state: AppState) => state.action.error);
  const isSubmitting = useSelector((state: AppState) => state.action.isPosting);
  const prevIsSubmitting = usePrevious(isSubmitting);

  const dispatchSave = () => {
    const { current }: { current: FormikProps<SystemIntakeForm> } = formikRef;
    if (systemId === 'new') {
      dispatch(
        postSystemIntake({
          ...systemIntake,
          ...current.values
        })
      );
    } else {
      dispatch(
        saveSystemIntake({ ...systemIntake, ...current.values, id: systemId })
      );
    }
    current.resetForm({ values: current.values, errors: current.errors });
  };

  useEffect(() => {
    if (systemIntake.id) {
      history.replace(`/system/${systemIntake.id}/${formPage}`);
    }
  }, [history, systemIntake.id, formPage]);

  // Handle redirect after submitting
  useEffect(() => {
    if (prevIsSubmitting && !isSubmitting && !actionError) {
      history.push(`/system/${systemId}/confirmation`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  useEffect(() => {
    if (systemId === 'new') {
      oktaAuth.getUser().then((user: any) => {
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

  return (
    <PageWrapper className="system-intake">
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <BreadcrumbNav className="margin-y-2">
          <li>
            <Link to="/">Home</Link>
            <i className="fa fa-angle-right margin-x-05" aria-hidden />
          </li>
          <li>
            <Link to={`/governance-task-list/${systemIntake.id || 'new'}`}>
              Get governance approval
            </Link>
            <i className="fa fa-angle-right margin-x-05" aria-hidden />
          </li>
          <li>Intake Request</li>
        </BreadcrumbNav>
        {isLoading === false && (
          <Switch>
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
              path="/system/:systemId/contract-details"
              render={() => (
                <ContractDetails
                  formikRef={formikRef}
                  systemIntake={systemIntake}
                  dispatchSave={dispatchSave}
                />
              )}
            />
            <SecureRoute
              path="/system/:systemId/review"
              render={() => (
                <Review systemIntake={systemIntake} now={DateTime.local()} />
              )}
            />
            <SecureRoute
              path="/system/:systemId/confirmation"
              render={() => <Confirmation />}
            />
            <SecureRoute
              path="/system/:systemId/view"
              render={() => <SystemIntakeView systemIntake={systemIntake} />}
            />
            <SecureRoute path="*" render={() => <NotFoundPartial />} />
          </Switch>
        )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemIntake;
