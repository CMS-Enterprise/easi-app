import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageWrapper from 'components/PageWrapper';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import { AppState } from 'reducers/rootReducer';
import {
  fetchBusinessCase,
  fetchSystemIntake,
  saveSystemIntake
} from 'types/routines';
import {
  isIntakeClosed,
  isIntakeOpen,
  translateRequestType
} from 'utils/systemIntake';
import user from 'utils/user';
import ProvideGRTFeedback from 'views/GovernanceReviewTeam/Actions/ProvideGRTFeedback';
import NotFound from 'views/NotFound';

import ChooseAction from './Actions/ChooseAction';
import IssueLifecycleId from './Actions/IssueLifecycleId';
import RejectIntake from './Actions/RejectIntake';
import SubmitAction from './Actions/SubmitAction';
import BusinessCaseReview from './BusinessCaseReview';
import Dates from './Dates';
import Decision from './Decision';
import IntakeReview from './IntakeReview';
import Notes from './Notes';

import './index.scss';

const GovernanceReviewTeam = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const { t: actionsT } = useTranslation('action');
  const dispatch = useDispatch();
  const { systemId, activePage } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);

  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

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

  const component = cmsDivisionsAndOffices.find(
    c => c.name === systemIntake.requester.component
  );

  const requesterNameAndComponent = component
    ? `${systemIntake.requester.name}, ${component.acronym}`
    : systemIntake.requester.name;

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

  const getNavLinkClasses = (page: string) =>
    classnames('easi-grt__nav-link', {
      'easi-grt__nav-link--active': page === activePage
    });

  const RenderPage = () => (
    <PageWrapper className="easi-grt">
      <Header />
      <MainContent>
        <section className="easi-grt__request-summary">
          <div className="grid-container padding-y-2">
            <BreadcrumbNav>
              <li>
                <Link className="text-white" to="/">
                  Home
                </Link>
                <i className="fa fa-angle-right margin-x-05" aria-hidden />
              </li>
              <li>{systemIntake.requestName}</li>
            </BreadcrumbNav>
            <dl className="easi-grt__request-info">
              <div>
                <dt>{t('intake:fields.projectName')}</dt>
                <dd>{systemIntake.requestName}</dd>
              </div>
              <div className="easi-grt__request-info-col">
                <div className="easi-grt__description-group">
                  <dt>{t('intake:fields.requester')}</dt>
                  <dd>{requesterNameAndComponent}</dd>
                </div>
                <div className="easi-grt__description-group">
                  <dt>{t('intake:fields.submissionDate')}</dt>
                  <dd>
                    {systemIntake.submittedAt
                      ? systemIntake.submittedAt.toLocaleString(
                          DateTime.DATE_FULL
                        )
                      : 'N/A'}
                  </dd>
                </div>
                <div className="easi-grt__description-group">
                  <dt>{t('intake:fields.requestFor')}</dt>
                  <dd>{translateRequestType(systemIntake.requestType)}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div
            className={classnames({
              'bg-base-lightest': isIntakeClosed(systemIntake.status),
              'easi-grt__status--open': isIntakeOpen(systemIntake.status)
            })}
          >
            <div className="grid-container overflow-auto">
              <dl className="easi-grt__status-group">
                <div className="easi-grt__status-info text-gray-90">
                  <dt className="text-bold">{t('status.label')}</dt>
                  &nbsp;
                  <dd
                    className="text-uppercase text-white bg-base-dark padding-05 font-body-3xs"
                    data-testid="grt-status"
                  >
                    {isIntakeClosed(systemIntake.status)
                      ? t('status.closed')
                      : t('status.open')}
                  </dd>
                  {systemIntake.lcid && (
                    <>
                      <dt>{t('intake:lifecycleId')}:&nbsp;</dt>
                      <dd data-testid="grt-lcid">{systemIntake.lcid}</dd>
                    </>
                  )}
                </div>
                <div className="text-gray-90">
                  <dt className="text-bold">{t('intake:fields.adminLead')}</dt>
                  <dt className="padding-1">{getAdminLead()}</dt>
                  <dt>
                    <Button
                      type="button"
                      unstyled
                      onClick={() => {
                        // Reset newAdminLead to value in intake
                        resetNewAdminLead();
                        setModalOpen(true);
                      }}
                    >
                      {t('governanceReviewTeam:adminLeads.changeLead')}
                    </Button>
                    <Modal
                      title={t(
                        'governanceReviewTeam:adminLeads:assignModal.title'
                      )}
                      isOpen={isModalOpen}
                      closeModal={() => {
                        setModalOpen(false);
                      }}
                    >
                      <h1 className="margin-top-0 font-heading-2xl line-height-heading-2">
                        {t(
                          'governanceReviewTeam:adminLeads:assignModal.header',
                          { requestName: systemIntake.requestName }
                        )}
                      </h1>
                      <RadioGroup>
                        {grtMembers.map(k => (
                          <AdminLeadRadioOption
                            key={k}
                            checked={k === newAdminLead}
                            label={k}
                            onChange={() => {
                              setAdminLead(k);
                            }}
                          />
                        ))}
                      </RadioGroup>
                      <Button
                        type="button"
                        className="margin-right-4"
                        onClick={() => {
                          // Set admin lead as newAdminLead in the intake
                          saveAdminLead();
                          setModalOpen(false);
                        }}
                      >
                        {t('governanceReviewTeam:adminLeads:assignModal.save')}
                      </Button>
                      <Button
                        type="button"
                        unstyled
                        onClick={() => {
                          setModalOpen(false);
                        }}
                      >
                        {t(
                          'governanceReviewTeam:adminLeads:assignModal.noChanges'
                        )}
                      </Button>
                    </Modal>
                  </dt>
                </div>
              </dl>
            </div>
          </div>
        </section>
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
                <ProvideGRTFeedback
                  action="PROVIDE_FEEDBACK_NEED_BIZ_CASE"
                  actionName={actionsT('actions.provideFeedbackNeedBizCase')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-keep-draft"
              render={() => (
                <ProvideGRTFeedback
                  action="PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT"
                  actionName={actionsT('actions.provideGrtFeedbackKeepDraft')}
                />
              )}
            />
            <Route
              path="/governance-review-team/:systemId/actions/provide-feedback-need-final"
              render={() => (
                <ProvideGRTFeedback
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

  if (isUserSet) {
    if (user.isGrtReviewer(userGroups)) {
      return <RenderPage />;
    }
    return <NotFound />;
  }

  return <p>Loading...</p>;
};

export default GovernanceReviewTeam;
