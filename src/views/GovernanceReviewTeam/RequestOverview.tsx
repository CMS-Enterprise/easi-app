/* eslint-disable import/no-named-default */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, IconArrowBack } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import useMessage from 'hooks/useMessage';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import { AppState } from 'reducers/rootReducer';
import { clearBusinessCase, fetchBusinessCase } from 'types/routines';
import AdditionalInformation from 'views/AdditionalInformation';
import NotFound from 'views/NotFound';

import AccordionNavigation from './AccordionNavigation';
import Actions from './Actions';
import BusinessCaseReview from './BusinessCaseReview';
import Dates from './Dates';
import Decision from './Decision';
import Documents from './Documents';
import Feedback from './Feedback';
import IntakeReview from './IntakeReview';
import LifecycleID from './LifecycleID';
import Notes from './Notes';
import subNavItems from './subNavItems';
import Summary from './Summary';

import './index.scss';

const RequestOverview = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const flags = useFlags();

  const { Message } = useMessage();

  const dispatch = useDispatch();
  const { systemId, activePage, subPage } = useParams<{
    systemId: string;
    activePage: string;
    subPage?: string;
  }>();

  /** Hides summary and side navigation for all action subpages */
  const fullPageLayout: boolean =
    activePage === 'resolutions' || activePage === 'manage-lcid' || !!subPage;

  const { loading, data } = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      variables: {
        id: systemId
      }
    }
  );

  const systemIntake = data?.systemIntake;

  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );

  useEffect(() => {
    if (systemIntake?.businessCaseId) {
      dispatch(fetchBusinessCase(systemIntake.businessCaseId));
    } else {
      dispatch(clearBusinessCase());
    }
  }, [dispatch, systemIntake?.businessCaseId]);

  const getNavLinkClasses = (route: string) =>
    classnames('easi-grt__nav-link', {
      'easi-grt__nav-link--active': route.split('/')[3] === activePage
    });

  if (!loading && !systemIntake) {
    return <NotFound />;
  }

  return (
    <MainContent className="easi-grt" data-testid="grt-request-overview">
      {systemIntake && !fullPageLayout && (
        <Summary
          id={systemIntake.id}
          requester={systemIntake.requester}
          requestName={systemIntake.requestName || ''}
          requestType={systemIntake.requestType}
          statusAdmin={systemIntake.statusAdmin}
          adminLead={systemIntake.adminLead}
          submittedAt={systemIntake.submittedAt}
          lcid={systemIntake.lcid}
          contractNumbers={
            systemIntake?.contractNumbers?.map(c => c.contractNumber) || []
          }
          state={systemIntake?.state}
        />
      )}
      {!fullPageLayout && (
        <AccordionNavigation
          activePage={activePage}
          subNavItems={subNavItems(systemId, flags)}
        />
      )}
      <section
        className={classnames('grid-container', {
          'margin-bottom-5 margin-top-7': !fullPageLayout
        })}
      >
        <Message className="margin-bottom-6 margin-top-neg-4" />
        <Grid row gap>
          {!fullPageLayout && (
            <nav className="desktop:grid-col-3 desktop:display-block display-none">
              <ul className="easi-grt__nav-list margin-top-0">
                <li className="margin-bottom-6 margin-top-0">
                  <Link
                    to="/"
                    className="display-flex flex-align-center hover:text-primary-dark"
                  >
                    <IconArrowBack className="margin-right-1" aria-hidden />
                    {t('back.allRequests')}
                  </Link>
                </li>
                {subNavItems(systemId, flags).map(
                  ({ aria, groupEnd, route, text }) => (
                    <li
                      key={`desktop-sidenav-${text}`}
                      className={classnames({
                        'easi-grt__nav-link--border': groupEnd
                      })}
                    >
                      {aria ? (
                        <Link
                          to={route}
                          aria-label={t(aria)}
                          className={getNavLinkClasses(route)}
                          data-testid={`grt-nav-${text}-link`}
                        >
                          {t(text)}
                        </Link>
                      ) : (
                        <Link
                          to={route}
                          className={getNavLinkClasses(route)}
                          data-testid={`grt-nav-${text}-link`}
                        >
                          {t(text)}
                        </Link>
                      )}
                    </li>
                  )
                )}
              </ul>
            </nav>
          )}
          {loading && (
            <div className="margin-x-auto">
              <PageLoading />
            </div>
          )}
          {!loading && !!systemIntake && (
            <section
              className={classnames({ 'desktop:grid-col-9': !fullPageLayout })}
            >
              <Route
                path="/governance-review-team/:systemId/intake-request"
                render={() => {
                  return <IntakeReview systemIntake={systemIntake} />;
                }}
              />
              <Route
                path="/governance-review-team/:systemId/documents"
                render={() => {
                  return <Documents systemIntake={systemIntake} />;
                }}
              />
              <Route
                path="/governance-review-team/:systemId/business-case"
                render={() => (
                  <BusinessCaseReview
                    businessCase={businessCase}
                    grtFeedbacks={systemIntake.governanceRequestFeedbacks}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/notes"
                render={() => <Notes />}
              />
              <Route
                path="/governance-review-team/:systemId/dates"
                render={() => {
                  return <Dates systemIntake={systemIntake} />;
                }}
              />

              <Route
                path="/governance-review-team/:systemId/feedback"
                render={() => <Feedback systemIntakeId={systemId} />}
              />

              <Route
                path="/governance-review-team/:systemId/decision"
                render={() => <Decision {...systemIntake} />}
              />

              <Route
                exact
                path="/governance-review-team/:systemId/additional-information"
              >
                <AdditionalInformation request={systemIntake} type="itgov" />
              </Route>

              <Route
                path="/governance-review-team/:systemId/lcid"
                render={() => <LifecycleID systemIntake={systemIntake} />}
              />

              <Route
                path="/governance-review-team/:systemId/(actions|resolutions|manage-lcid)/:subPage?"
                render={() => <Actions systemIntake={systemIntake} />}
              />
            </section>
          )}
        </Grid>
      </section>
    </MainContent>
  );
};

export default RequestOverview;
