import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import classnames from 'classnames';
import { DateTime } from 'luxon';
import AddGRTFeedbackKeepDraftBizCase from 'queries/AddGRTFeedbackKeepDraftBizCase';
import AddGRTFeedbackProgressToFinal from 'queries/AddGRTFeedbackProgressToFinal';
import AddGRTFeedbackRequestBizCaseQuery from 'queries/AddGRTFeedbackRequestBizCaseQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { GetSystemIntake } from 'queries/types/GetSystemIntake';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { AppState } from 'reducers/rootReducer';
import { fetchBusinessCase, fetchSystemIntake } from 'types/routines';
import ProvideGRTFeedback from 'views/GovernanceReviewTeam/Actions/ProvideGRTFeedback';

import ChooseAction from './Actions/ChooseAction';
import IssueLifecycleId from './Actions/IssueLifecycleId';
import RejectIntake from './Actions/RejectIntake';
import SubmitAction from './Actions/SubmitAction';
import BusinessCaseReview from './BusinessCaseReview';
import Dates from './Dates';
import Decision from './Decision';
import IntakeReview from './IntakeReview';
import Notes from './Notes';
import Summary from './Summary';

import './index.scss';

const RequestOverview = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const { t: actionsT } = useTranslation('action');
  const dispatch = useDispatch();
  const { systemId, activePage } = useParams();
  const { loading, data: graphData } = useQuery<GetSystemIntake>(
    GetSystemIntakeQuery,
    {
      variables: {
        id: systemId
      }
    }
  );
  const intake = graphData?.systemIntake;

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );

  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );

  useEffect(() => {
    dispatch(fetchSystemIntake(systemId));
  }, [dispatch, systemId]);

  useEffect(() => {
    if (systemIntake.businessCaseId) {
      dispatch(fetchBusinessCase(systemIntake.businessCaseId));
    }
  }, [dispatch, systemIntake.businessCaseId]);

  const getNavLinkClasses = (page: string) =>
    classnames('easi-grt__nav-link', {
      'easi-grt__nav-link--active': page === activePage
    });

  return (
    <PageWrapper className="easi-grt">
      <Header />
      <MainContent>
        {intake && <Summary intake={intake} />}
        <section className="grid-container grid-row margin-y-5 ">
          <nav className="tablet:grid-col-2 margin-right-2">
            <ul className="easi-grt__nav-list">
              <li>
                <i className="fa fa-angle-left margin-x-05" aria-hidden />
                <Link to="/">{t('back.allRequests')}</Link>
              </li>
              <li>
                <Link
                  to={`/governance-review-team/${systemId}/intake-request`}
                  aria-label={t('aria.openIntake')}
                  className={getNavLinkClasses('intake-request')}
                >
                  {t('general:intake')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/governance-review-team/${systemId}/business-case`}
                  aria-label={t('aria.openBusiness')}
                  className={getNavLinkClasses('business-case')}
                >
                  {t('general:businessCase')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/governance-review-team/${systemId}/decision`}
                  aria-label={t('aria.openDecision')}
                  className={getNavLinkClasses('decision')}
                >
                  {t('decision.title')}
                </Link>
              </li>
            </ul>
            <hr />
            <ul className="easi-grt__nav-list">
              <li>
                <Link
                  to={`/governance-review-team/${systemId}/actions`}
                  className={getNavLinkClasses('actions')}
                >
                  {t('actions')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/governance-review-team/${systemId}/notes`}
                  className={getNavLinkClasses('notes')}
                >
                  {t('notes.heading')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/governance-review-team/${systemId}/dates`}
                  className={getNavLinkClasses('dates')}
                >
                  {t('dates.heading')}
                </Link>
              </li>
            </ul>
          </nav>
          <section className="tablet:grid-col-9">
            <Route
              path="/governance-review-team/:systemId/intake-request"
              render={() => {
                if (loading) {
                  return <p>Loading...</p>;
                }
                return (
                  <IntakeReview systemIntake={intake} now={DateTime.local()} />
                );
              }}
            />
            <Route
              path="/governance-review-team/:systemId/business-case"
              render={() => <BusinessCaseReview businessCase={businessCase} />}
            />
            <Route
              path="/governance-review-team/:systemId/notes"
              render={() => <Notes />}
            />
            <Route
              path="/governance-review-team/:systemId/dates"
              render={() => <Dates systemIntake={systemIntake} />}
            />
            <Route
              path="/governance-review-team/:systemId/decision"
              render={() => <Decision systemIntake={systemIntake} />}
            />
            <Route
              path="/governance-review-team/:systemId/actions"
              exact
              render={() => (
                <ChooseAction
                  businessCase={businessCase}
                  systemIntakeType={systemIntake.requestType}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/not-it-request"
              render={() => (
                <SubmitAction
                  action="NOT_IT_REQUEST"
                  actionName={actionsT('actions.notItRequest')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/need-biz-case"
              render={() => (
                <SubmitAction
                  action="NEED_BIZ_CASE"
                  actionName={actionsT('actions.needBizCase')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-need-biz-case"
              render={() => (
                <ProvideGRTFeedback
                  query={AddGRTFeedbackRequestBizCaseQuery}
                  actionName={actionsT('actions.provideFeedbackNeedBizCase')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-keep-draft"
              render={() => (
                <ProvideGRTFeedback
                  query={AddGRTFeedbackKeepDraftBizCase}
                  actionName={actionsT('actions.provideGrtFeedbackKeepDraft')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-need-final"
              render={() => (
                <ProvideGRTFeedback
                  query={AddGRTFeedbackProgressToFinal}
                  actionName={actionsT('actions.provideGrtFeedbackNeedFinal')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/ready-for-grt"
              render={() => (
                <SubmitAction
                  action="READY_FOR_GRT"
                  actionName={actionsT('actions.readyForGrt')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/ready-for-grb"
              render={() => (
                <SubmitAction
                  action="READY_FOR_GRB"
                  actionName={actionsT('actions.readyForGrb')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/biz-case-needs-changes"
              render={() => (
                <SubmitAction
                  action="BIZ_CASE_NEEDS_CHANGES"
                  actionName={actionsT('actions.bizCaseNeedsChanges')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/no-governance"
              render={() => (
                <SubmitAction
                  action="NO_GOVERNANCE_NEEDED"
                  actionName={actionsT('actions.noGovernance')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/send-email"
              render={() => (
                <SubmitAction
                  action="SEND_EMAIL"
                  actionName={actionsT('actions.sendEmail')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/guide-received-close"
              render={() => (
                <SubmitAction
                  action="GUIDE_RECEIVED_CLOSE"
                  actionName={actionsT('actions.guideReceivedClose')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/not-responding-close"
              render={() => (
                <SubmitAction
                  action="NOT_RESPONDING_CLOSE"
                  actionName={actionsT('actions.notRespondingClose')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/issue-lcid"
              render={() => <IssueLifecycleId />}
            />
            <Route
              path="/governance-review-team/:systemId/actions/not-approved"
              render={() => <RejectIntake />}
            />
          </section>
        </section>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default RequestOverview;
