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
import AddGRTFeedbackKeepDraftBizCase from 'queries/AddGRTFeedbackKeepDraftBizCase';
import AddGRTFeedbackProgressToFinal from 'queries/AddGRTFeedbackProgressToFinal';
import AddGRTFeedbackRequestBizCaseQuery from 'queries/AddGRTFeedbackRequestBizCaseQuery';
import CreateSystemIntakeActionBusinessCaseNeeded from 'queries/CreateSystemIntakeActionBusinessCaseNeededQuery';
import CreateSystemIntakeActionBusinessCaseNeedsChanges from 'queries/CreateSystemIntakeActionBusinessCaseNeedsChangesQuery';
import CreateSystemIntakeActionGuideReceievedClose from 'queries/CreateSystemIntakeActionGuideReceievedCloseQuery';
import CreateSystemIntakeActionNoGovernanceNeeded from 'queries/CreateSystemIntakeActionNoGovernanceNeededQuery';
import CreateSystemIntakeActionNotItRequest from 'queries/CreateSystemIntakeActionNotItRequestQuery';
import CreateSystemIntakeActionNotRespondingClose from 'queries/CreateSystemIntakeActionNotRespondingCloseQuery';
import CreateSystemIntakeActionReadyForGRT from 'queries/CreateSystemIntakeActionReadyForGRTQuery';
import CreateSystemIntakeActionSendEmail from 'queries/CreateSystemIntakeActionSendEmailQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import { AppState } from 'reducers/rootReducer';
import { clearBusinessCase, fetchBusinessCase } from 'types/routines';
import ProvideGRTFeedbackToBusinessOwner from 'views/GovernanceReviewTeam/ActionsV1/ProvideGRTFeedbackToBusinessOwner';
import ProvideGRTRecommendationsToGRB from 'views/GovernanceReviewTeam/ActionsV1/ProvideGRTRecommendationsToGRB';
import NotFound from 'views/NotFound';

import ChooseAction from './Actions/ChooseAction';
import NextStep from './Actions/NextStep';
import RequestEdits from './Actions/RequestEdits';
import SubmitDecision from './Actions/SubmitDecision';
import { default as ChooseActionV1 } from './ActionsV1/ChooseAction';
import ExtendLifecycleId from './ActionsV1/ExtendLifecycleId';
import IssueLifecycleId from './ActionsV1/IssueLifecycleId';
import RejectIntake from './ActionsV1/RejectIntake';
import SubmitAction from './ActionsV1/SubmitAction';
import AccordionNavigation from './AccordionNavigation';
import BusinessCaseReview from './BusinessCaseReview';
import Dates from './Dates';
import Decision from './Decision';
import Documents from './Documents';
import IntakeReview from './IntakeReview';
import LifecycleID from './LifecycleID';
import Notes from './Notes';
import subNavItems from './subNavItems';
import Summary from './Summary';

import './index.scss';

const RequestOverview = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const { t: actionsT } = useTranslation('action');
  const dispatch = useDispatch();
  const { systemId, activePage } = useParams<{
    systemId: string;
    activePage: string;
  }>();

  const flags = useFlags();

  const { loading, data, refetch } = useQuery<
    GetSystemIntake,
    GetSystemIntakeVariables
  >(GetSystemIntakeQuery, {
    variables: {
      id: systemId
    }
  });

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
      {systemIntake && (
        <Summary
          id={systemIntake.id}
          requester={systemIntake.requester}
          requestName={systemIntake.requestName || ''}
          requestType={systemIntake.requestType}
          status={systemIntake.status}
          adminLead={systemIntake.adminLead}
          submittedAt={systemIntake.submittedAt}
          lcid={systemIntake.lcid}
        />
      )}
      <AccordionNavigation
        activePage={activePage}
        subNavItems={subNavItems(systemId)}
      />
      <section className="grid-container margin-bottom-5 margin-top-7">
        <Grid row gap>
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
              {subNavItems(systemId).map(({ aria, groupEnd, route, text }) => (
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
          {loading && (
            <div className="margin-x-auto">
              <PageLoading />
            </div>
          )}
          {!loading && !!systemIntake && (
            <section className="desktop:grid-col-9">
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
                    grtFeedbacks={systemIntake.grtFeedbacks}
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
                path="/governance-review-team/:systemId/decision"
                render={() => <Decision systemIntake={systemIntake} />}
              />
              <Route
                path="/governance-review-team/:systemId/lcid"
                render={() => <LifecycleID systemIntake={systemIntake} />}
              />

              {
                /**
                 * IT Gov V2 action routes
                 *
                 * TODO: Clean up routes after flag is deprecated
                 * */
                flags.itGovV2Enabled ? (
                  <>
                    <Route
                      path="/governance-review-team/:systemId/actions"
                      exact
                      render={() => (
                        <ChooseAction
                          systemIntake={systemIntake}
                          businessCase={businessCase}
                        />
                      )}
                    />
                    <Route
                      path="/governance-review-team/:systemId/actions/request-edits"
                      render={() => <RequestEdits />}
                    />
                    <Route
                      path="/governance-review-team/:systemId/actions/next-step"
                      render={() => <NextStep />}
                    />
                    <Route
                      path="/governance-review-team/:systemId/actions/decision"
                      render={() => <SubmitDecision />}
                    />
                  </>
                ) : (
                  // Actions page - Version 1
                  <Route
                    path="/governance-review-team/:systemId/actions"
                    exact
                    render={() => (
                      <ChooseActionV1
                        systemIntake={systemIntake}
                        businessCase={businessCase}
                      />
                    )}
                  />
                )
              }

              <Route
                path="/governance-review-team/:systemId/actions/not-it-request"
                render={() => (
                  <SubmitAction
                    query={CreateSystemIntakeActionNotItRequest}
                    actionName={actionsT('actions.notItRequest')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/need-biz-case"
                render={() => (
                  <SubmitAction
                    query={CreateSystemIntakeActionBusinessCaseNeeded}
                    actionName={actionsT('actions.needBizCase')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/provide-feedback-need-biz-case"
                render={() => (
                  <ProvideGRTFeedbackToBusinessOwner
                    query={AddGRTFeedbackRequestBizCaseQuery}
                    actionName={actionsT('actions.provideFeedbackNeedBizCase')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/provide-feedback-keep-draft"
                render={() => (
                  <ProvideGRTFeedbackToBusinessOwner
                    query={AddGRTFeedbackKeepDraftBizCase}
                    actionName={actionsT('actions.provideGrtFeedbackKeepDraft')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/provide-feedback-need-final"
                render={() => (
                  <ProvideGRTFeedbackToBusinessOwner
                    query={AddGRTFeedbackProgressToFinal}
                    actionName={actionsT('actions.provideGrtFeedbackNeedFinal')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/ready-for-grt"
                render={() => (
                  <SubmitAction
                    query={CreateSystemIntakeActionReadyForGRT}
                    actionName={actionsT('actions.readyForGrt')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/ready-for-grb"
                render={() => <ProvideGRTRecommendationsToGRB />}
              />
              <Route
                path="/governance-review-team/:systemId/actions/biz-case-needs-changes"
                render={() => (
                  <SubmitAction
                    query={CreateSystemIntakeActionBusinessCaseNeedsChanges}
                    actionName={actionsT('actions.bizCaseNeedsChanges')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/no-governance"
                render={() => (
                  <SubmitAction
                    query={CreateSystemIntakeActionNoGovernanceNeeded}
                    actionName={actionsT('actions.noGovernance')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/send-email"
                render={() => (
                  <SubmitAction
                    query={CreateSystemIntakeActionSendEmail}
                    actionName={actionsT('actions.sendEmail')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/guide-received-close"
                render={() => (
                  <SubmitAction
                    query={CreateSystemIntakeActionGuideReceievedClose}
                    actionName={actionsT('actions.guideReceivedClose')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/not-responding-close"
                render={() => (
                  <SubmitAction
                    query={CreateSystemIntakeActionNotRespondingClose}
                    actionName={actionsT('actions.notRespondingClose')}
                  />
                )}
              />
              <Route
                path="/governance-review-team/:systemId/actions/issue-lcid"
                render={() => <IssueLifecycleId refetch={refetch} />}
              />

              {/* Only display extend LCID action if status is LCID_ISSUED or there has been an lcid issued in the past */}
              {(data?.systemIntake?.status === 'LCID_ISSUED' ||
                data?.systemIntake?.lcid != null) && (
                <Route
                  path="/governance-review-team/:systemId/actions/extend-lcid"
                  render={() => (
                    <ExtendLifecycleId
                      lcid={data.systemIntake?.lcid || ''}
                      lcidExpiresAt={data.systemIntake?.lcidExpiresAt || ''}
                      lcidScope={data.systemIntake?.lcidScope || ''}
                      lcidNextSteps={data.systemIntake?.decisionNextSteps || ''}
                      lcidCostBaseline={
                        data.systemIntake?.lcidCostBaseline || ''
                      }
                      onSubmit={refetch}
                    />
                  )}
                />
              )}
              <Route
                path="/governance-review-team/:systemId/actions/not-approved"
                render={() => <RejectIntake />}
              />
            </section>
          )}
        </Grid>
      </section>
    </MainContent>
  );
};

export default RequestOverview;
