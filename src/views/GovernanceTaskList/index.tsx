import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Alert, Link as UswdsLink } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import { ImproveEasiSurvey } from 'components/Survey';
import {
  attendGrbMeetingTag,
  businessCaseTag,
  decisionTag,
  finalBusinessCaseTag,
  initialReviewTag,
  intakeTag
} from 'data/taskList';
import { AppState } from 'reducers/rootReducer';
import {
  archiveSystemIntake,
  fetchBusinessCase,
  fetchSystemIntake
} from 'types/routines';

import SideNavActions from './SideNavActions';
import {
  AttendGrbMeetingCta,
  BusinessCaseDraftCta,
  DecisionCta,
  IntakeDraftCta
} from './TaskListCta';
import TaskListItem, { TaskListDescription } from './TaskListItem';

import './index.scss';

const GovernanceTaskList = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );

  useEffect(() => {
    if (systemId !== 'new') {
      dispatch(fetchSystemIntake(systemId));
    }
  }, [dispatch, systemId]);

  useEffect(() => {
    if (systemId === 'new' && systemIntake.id) {
      history.replace(`/governance-task-list/${systemIntake.id}`);
    }
  }, [history, systemIntake.id, systemId]);

  useEffect(() => {
    if (systemIntake.id && systemIntake.businessCaseId) {
      dispatch(fetchBusinessCase(systemIntake.businessCaseId));
    }
  }, [dispatch, systemIntake.id, systemIntake.businessCaseId]);

  const archiveIntake = () => {
    const redirect = () => {
      history.push('/', {
        confirmationText: t('taskList:withdraw_modal.confirmationText', {
          context: systemIntake.requestName ? 'name' : 'noName',
          requestName: systemIntake.requestName
        })
      });
    };
    dispatch(archiveSystemIntake({ intakeId: systemId, redirect }));
  };

  const businessCaseStage = (() => {
    switch (systemIntake.status) {
      case 'BIZ_CASE_DRAFT_SUBMITTED':
        return 'Business case submitted. Waiting for feedback.';
      case 'BIZ_CASE_CHANGES_NEEDED':
        return 'Read feedback in your email, make updates to your business case and re-submit it.';
      case 'READY_FOR_GRT':
        return 'Attend GRT meeting. The admin team will email you to schedule a time.';
      default:
        return '';
    }
  })();

  const isRecompete = systemIntake.requestType === 'RECOMPETE';

  // The meeting date is "scheduled" until the next day since there is no time
  // associated with meeting dates.
  const getMeetingDate = (date: DateTime | null): string => {
    if (date) {
      return date.plus({ day: 1 }).toMillis() > DateTime.local().toMillis()
        ? `Scheduled for ${date.toLocaleString(DateTime.DATE_FULL)}`
        : `Attended on ${date.toLocaleString(DateTime.DATE_FULL)}`;
    }
    return '';
  };

  return (
    <PageWrapper className="governance-task-list">
      <Header />
      <MainContent className="grid-container margin-bottom-7">
        <div className="grid-row">
          <BreadcrumbNav className="margin-y-2 tablet:grid-col-12">
            <li>
              <Link to="/">Home</Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>
              <Link to="/governance-task-list" aria-current="location">
                Get governance approval
              </Link>
            </li>
          </BreadcrumbNav>
        </div>
        <div className="grid-row">
          <div className="tablet:grid-col-9">
            <PageHeading>
              Get governance approval
              {systemIntake.requestName && (
                <span className="display-block line-height-body-5 font-body-lg text-light">
                  {isRecompete
                    ? 'for re-competing a contract without any changes to systems or services'
                    : `for ${systemIntake.requestName}`}
                </span>
              )}
            </PageHeading>
            {['NO_GOVERNANCE', 'NOT_IT_REQUEST'].includes(
              systemIntake.status
            ) && (
              <Alert type="warning">
                <span>
                  The governance team closed your request, you can view their
                  decision at the bottom of this page. Please check the email
                  sent to you for further information.
                </span>
              </Alert>
            )}
            <ol className="governance-task-list__task-list governance-task-list__task-list--primary">
              <TaskListItem
                data-testid="task-list-intake-form"
                heading="Fill in the request form"
                status={intakeTag(systemIntake.status)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    Tell the Governance Admin Team about your idea. This step
                    lets CMS build context about your request and start
                    preparing for discussions with your team.
                  </p>
                </TaskListDescription>
                <IntakeDraftCta intake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                data-testid="task-list-intake-review"
                heading="Feedback from initial review"
                status={initialReviewTag(systemIntake.status)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    The Governance Admin Team will review your request and
                    decide if it needs further governance. If it does, they’ll
                    direct you to go through the remaining steps.
                  </p>
                </TaskListDescription>
                <Alert type="info">
                  <span>
                    To help with that review, someone from the IT Governance
                    team will schedule a phone call with you and Enterprise
                    Architecture (EA).
                  </span>
                  <br />
                  <br />
                  <span>
                    After that phone call, the governance team will decide if
                    you need to go through a full governance process.
                  </span>
                </Alert>
              </TaskListItem>
              <TaskListItem
                data-testid="task-list-business-case-draft"
                heading="Prepare your Business Case for the GRT"
                status={businessCaseTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    Draft a business case to communicate the business need, the
                    solutions and its associated costs. Meet with the Governance
                    Review Team to discuss your draft, receive feedback and
                    refine your business case.
                  </p>
                  <p>
                    This step can take some time due to scheduling and
                    availability. You may go through multiple rounds of editing
                    your business case and receiving feedback.
                  </p>
                  {businessCaseStage && (
                    <p>
                      <span className="text-bold">Status:&nbsp;</span>
                      <span>{businessCaseStage}</span>
                    </p>
                  )}
                  {systemIntake.grtDate && (
                    <span className="governance-task-list__meeting-date">
                      {getMeetingDate(systemIntake.grtDate)}
                    </span>
                  )}
                </TaskListDescription>
                <BusinessCaseDraftCta systemIntake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                data-testid="task-list-business-case-final"
                heading="Submit the business case for final approval"
                status={finalBusinessCaseTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    Update the Business Case based on feedback from the review
                    meeting and submit it to the Governance Review Board.
                  </p>
                </TaskListDescription>
                {systemIntake.status === 'BIZ_CASE_FINAL_NEEDED' && (
                  <UswdsLink
                    className="usa-button"
                    variant="unstyled"
                    asCustom={Link}
                    to={`/business/${systemIntake.businessCaseId}/general-request-info`}
                  >
                    Review and Submit
                  </UswdsLink>
                )}
              </TaskListItem>

              <TaskListItem
                data-testid="task-list-grb-meeting"
                heading="Attend the GRB meeting"
                status={attendGrbMeetingTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    The Governance Review Board will discuss and make decisions
                    based on the Business Case and recommendations from the
                    Review Team.
                  </p>
                  {systemIntake.grbDate && (
                    <span className="governance-task-list__meeting-date">
                      {getMeetingDate(systemIntake.grbDate)}
                    </span>
                  )}
                </TaskListDescription>
                <AttendGrbMeetingCta intake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                data-testid="task-list-decision"
                heading="Decision and next steps"
                status={decisionTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    If your Business Case is approved you will receive a unique
                    Lifecycle ID. If it is not approved, you would need address
                    the concerns to proceed.
                  </p>
                </TaskListDescription>
                <DecisionCta intake={systemIntake} />
              </TaskListItem>
            </ol>
          </div>
          <div className="tablet:grid-col-1" />
          <div className="tablet:grid-col-2">
            <SideNavActions
              intakeStatus={systemIntake.status}
              archiveIntake={archiveIntake}
            />
          </div>
        </div>
        <ImproveEasiSurvey />
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default GovernanceTaskList;
