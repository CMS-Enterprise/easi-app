/* eslint-disable import/no-named-default */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, IconArrowBack } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { SystemIntakeGRBReviewerFragment } from 'gql/gen/graphql';
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
import UploadForm from 'views/SystemIntake/Documents/UploadForm';

import AccordionNavigation from './AccordionNavigation';
import Actions from './Actions';
import BusinessCaseReview from './BusinessCaseReview';
import Dates from './Dates';
import Decision from './Decision';
import Documents from './Documents';
import Feedback from './Feedback';
import GRBReview from './GRBReview';
import IntakeReview from './IntakeReview';
import LifecycleID from './LifecycleID';
import Notes from './Notes';
import subNavItems, { ReviewerKey } from './subNavItems';
import Summary from './Summary';

import './index.scss';

type RequestOverviewProps = {
  grbReviewers: SystemIntakeGRBReviewerFragment[];
};

const RequestOverview = ({ grbReviewers }: RequestOverviewProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const flags = useFlags();

  const { Message } = useMessage();

  const dispatch = useDispatch();

  const { reviewerType, systemId, activePage, subPage } = useParams<{
    reviewerType: ReviewerKey;
    systemId: string;
    activePage: string;
    subPage?: string;
  }>();

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

  /** Hides summary and side navigation for all action subpages */
  const fullPageLayout: boolean =
    activePage === 'resolutions' || activePage === 'manage-lcid' || !!subPage;

  const getNavLinkClasses = (route: string) =>
    classnames('easi-grt__nav-link', {
      'easi-grt__nav-link--active': route.split('/')[3] === activePage
    });

  const navItems = subNavItems(systemId, reviewerType, flags);

  useEffect(() => {
    if (systemIntake?.businessCaseId) {
      dispatch(fetchBusinessCase(systemIntake.businessCaseId));
    } else {
      dispatch(clearBusinessCase());
    }
  }, [dispatch, systemIntake?.businessCaseId]);

  if (!loading && !systemIntake) {
    return <NotFound />;
  }

  return (
    <MainContent className="easi-grt" data-testid="grt-request-overview">
      {systemIntake && !fullPageLayout && (
        <Summary
          {...systemIntake}
          requestName={systemIntake.requestName || ''}
          contractNumbers={
            systemIntake?.contractNumbers?.map(c => c.contractNumber) || []
          }
        />
      )}
      {!fullPageLayout && (
        <AccordionNavigation activePage={activePage} subNavItems={navItems} />
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
                {navItems.map(({ aria, groupEnd, route, text }) => (
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
                ))}
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
              <Switch>
                <Route
                  path={`/${reviewerType}/:systemId/intake-request`}
                  render={() => <IntakeReview systemIntake={systemIntake} />}
                />

                {flags?.grbReviewTab && (
                  <Route
                    path="/governance-review-team/:systemId/documents/upload"
                    render={() => <UploadForm type="admin" />}
                  />
                )}

                <Route
                  path={`/${reviewerType}/:systemId/documents`}
                  render={() => <Documents systemIntake={systemIntake} />}
                />

                <Route
                  path={`/${reviewerType}/:systemId/business-case`}
                  render={() => (
                    <BusinessCaseReview
                      businessCase={businessCase}
                      grtFeedbacks={systemIntake.governanceRequestFeedbacks}
                    />
                  )}
                />

                <Route
                  path={`/${reviewerType}/:systemId/notes`}
                  render={() => <Notes />}
                />

                <Route
                  path={`/${reviewerType}/:systemId/feedback`}
                  render={() => <Feedback systemIntakeId={systemId} />}
                />

                <Route
                  path={`/${reviewerType}/:systemId/decision`}
                  render={() => <Decision {...systemIntake} />}
                />

                <Route
                  exact
                  path={`/${reviewerType}/:systemId/additional-information`}
                  render={() => (
                    <AdditionalInformation
                      request={systemIntake}
                      type="itgov"
                    />
                  )}
                />

                <Route
                  path={`/${reviewerType}/:systemId/lcid`}
                  render={() => <LifecycleID systemIntake={systemIntake} />}
                />

                {flags?.grbReviewTab && (
                  <Route
                    path={`/:reviewerType(${reviewerType})/:systemId/grb-review/:action(add|edit)?`}
                    render={() => (
                      <GRBReview
                        {...systemIntake}
                        grbReviewers={grbReviewers}
                      />
                    )}
                  />
                )}

                {/* GRT only routes */}

                <Route
                  path="/governance-review-team/:systemId/dates"
                  render={() => <Dates systemIntake={systemIntake} />}
                />

                <Route
                  path="/governance-review-team/:systemId/(actions|resolutions|manage-lcid)/:subPage?"
                  render={() => <Actions systemIntake={systemIntake} />}
                />

                <Route path="*" component={NotFound} />
              </Switch>
            </section>
          )}
        </Grid>
      </section>
    </MainContent>
  );
};

export default RequestOverview;
