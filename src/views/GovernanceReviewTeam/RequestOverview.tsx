import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useParams } from 'react-router-dom';
<<<<<<< HEAD
=======
import { useQuery } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
>>>>>>> ab443d67 (GRT page queries intake using graph.)
import classnames from 'classnames';
import { DateTime } from 'luxon';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { GetSystemIntake } from 'queries/types/GetSystemIntake';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { AppState } from 'reducers/rootReducer';
import { fetchBusinessCase, fetchSystemIntake } from 'types/routines';

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
  const { data: graphData } = useQuery<GetSystemIntake>(GetSystemIntakeQuery, {
    variables: {
      id: systemId
    }
  });
  const intake = graphData?.systemIntake;
  console.log(intake);

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

<<<<<<< HEAD
=======
  const component = cmsDivisionsAndOffices.find(
    c => c.name === intake?.requester.component
  );

  const requesterNameAndComponent = component
    ? `${intake?.requester.name}, ${component.acronym}`
    : intake?.requester.name;

  // Get admin lead assigned to intake
  const getAdminLead = () => {
    if (systemIntake.adminLead) {
      return systemIntake.adminLead;
    }
    return (
      <>
        <i className="fa fa-exclamation-circle text-secondary margin-right-05" />
        {t('governanceReviewTeam:adminLeads.notAssigned')}
      </>
    );
  };

  const [newAdminLead, setAdminLead] = useState('');

  // Resets newAdminLead to what is in intake currently. This is used to
  // reset state of modal upon exit without saving
  const resetNewAdminLead = () => {
    setAdminLead(systemIntake.adminLead);
  };

  // Send newly selected admin lead to database
  const saveAdminLead = () => {
    const data = {
      ...systemIntake,
      adminLead: newAdminLead
    };
    dispatch(saveSystemIntake({ ...data }));
  };

  // List of current GRT admin team members
  const grtMembers: string[] = t('governanceReviewTeam:adminLeads.members', {
    returnObjects: true
  });

  // Admin lead modal radio button
  type AdminLeadRadioOptionProps = {
    checked: boolean;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };

  const AdminLeadRadioOption = ({
    checked,
    label,
    onChange
  }: AdminLeadRadioOptionProps) => {
    const radioFieldClassName = 'margin-y-3';

    return (
      <RadioField
        checked={checked}
        id={label}
        label={label}
        name={label}
        value={label}
        onChange={onChange}
        className={radioFieldClassName}
      />
    );
  };

>>>>>>> 54719a52 (Requester in schema matches how we use it in the frontend.)
  const getNavLinkClasses = (page: string) =>
    classnames('easi-grt__nav-link', {
      'easi-grt__nav-link--active': page === activePage
    });

  return (
    <PageWrapper className="easi-grt">
      <Header />
      <MainContent>
        <Summary intake={systemIntake} />
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
              render={() => (
                <IntakeReview
                  systemIntake={systemIntake}
                  now={DateTime.local()}
                />
              )}
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
                <SubmitAction
                  action="PROVIDE_FEEDBACK_NEED_BIZ_CASE"
                  actionName={actionsT('actions.provideFeedbackNeedBizCase')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-keep-draft"
              render={() => (
                <SubmitAction
                  action="PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT"
                  actionName={actionsT('actions.provideGrtFeedbackKeepDraft')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-need-final"
              render={() => (
                <SubmitAction
                  action="PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL"
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
