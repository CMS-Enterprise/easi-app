import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import PageWrapper from 'components/PageWrapper';
import usePrevious from 'hooks/usePrevious';
import { AppState } from 'reducers/rootReducer';
import { clearSystemIntake, fetchSystemIntake } from 'types/routines';
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
  const { systemId } = useParams<{
    systemId: string;
    formPage: string;
  }>();
  const dispatch = useDispatch();

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  const isLoading = useSelector(
    (state: AppState) => state.systemIntake.isLoading
  );
  const actionError = useSelector((state: AppState) => state.action.error);
  const isSubmitting = useSelector((state: AppState) => state.action.isPosting);
  const prevIsSubmitting = usePrevious(isSubmitting);

  // Handle redirect after submitting
  useEffect(() => {
    if (prevIsSubmitting && !isSubmitting && !actionError) {
      history.push(`/system/${systemId}/confirmation`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  useEffect(() => {
    if (systemId === 'new') {
      history.push('/system/request-type');
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
    <PageWrapper className="system-intake" data-testid="system-intake">
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbLink
              asCustom={Link}
              to={`/governance-task-list/${systemIntake.id || 'new'}`}
            >
              <span>Get governance approval</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Intake Request</Breadcrumb>
        </BreadcrumbBar>
        {/*
         * TODO
         * When the GraphQL query(ies) are implemented for Intake,
         * this loading probably snould be moved inside of the individual
         * pages.
         */}
        {isLoading ? (
          <PageLoading />
        ) : (
          <Switch>
            <Route
              path="/system/:systemId/contact-details"
              render={() => <ContactDetails systemIntake={systemIntake} />}
            />
            <Route
              path="/system/:systemId/request-details"
              render={() => <RequestDetails systemIntake={systemIntake} />}
            />
            <Route
              path="/system/:systemId/contract-details"
              render={() => <ContractDetails systemIntake={systemIntake} />}
            />
            <Route
              path="/system/:systemId/review"
              render={() => (
                <Review systemIntake={systemIntake} now={DateTime.local()} />
              )}
            />
            <Route
              path="/system/:systemId/confirmation"
              render={() => <Confirmation />}
            />
            <Route
              path="/system/:systemId/view"
              render={() => <SystemIntakeView systemIntake={systemIntake} />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemIntake;
