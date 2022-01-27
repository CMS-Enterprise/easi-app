import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { ImproveEasiSurvey } from 'components/Survey';
import {
  attendGrbMeetingTag,
  businessCaseTag,
  decisionTag,
  finalBusinessCaseTag,
  initialReviewTag,
  intakeTag
} from 'data/taskList';
import useMessage from 'hooks/useMessage';
import GetGRTFeedbackQuery from 'queries/GetGRTFeedbackQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetGRTFeedback,
  GetGRTFeedbackVariables
} from 'queries/types/GetGRTFeedback';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import { archiveSystemIntake, fetchBusinessCase } from 'types/routines';
import { intakeHasDecision, isIntakeOpen } from 'utils/systemIntake';
import NotFound from 'views/NotFound';

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
  const { showMessageOnNextPage } = useMessage();
  const { t } = useTranslation();

  const { data: grtFeedbackData } = useQuery<
    GetGRTFeedback,
    GetGRTFeedbackVariables
  >(GetGRTFeedbackQuery, {
    variables: {
      intakeID: systemId
    }
  });

  const grtFeedback = grtFeedbackData?.systemIntake?.grtFeedbacks;

  const { loading, data } = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      variables: {
        id: systemId
      }
    }
  );

  const { systemIntake } = data || {};
  const {
    id,
    status,
    businessCaseId,
    requestName,
    requestType,
    grtDate,
    grbDate
  } = systemIntake || {};
  useEffect(() => {
    if (businessCaseId) {
      dispatch(fetchBusinessCase(businessCaseId));
    }
  }, [dispatch, id, businessCaseId]);

  const archiveIntake = () => {
    const redirect = () => {
      const message = t('taskList:withdraw_modal.confirmationText', {
        context: requestName ? 'name' : 'noName',
        requestName
      });
      showMessageOnNextPage(message);
      history.push('/');
    };
    dispatch(archiveSystemIntake({ intakeId: systemId, redirect }));
  };

  const businessCaseStage = (() => {
    switch (status) {
      case 'BIZ_CASE_DRAFT_SUBMITTED':
        return 'Business case submitted. Waiting for feedback.';
      case 'BIZ_CASE_CHANGES_NEEDED':
        return 'Review feedback and update draft business case';
      case 'READY_FOR_GRT':
        return 'Attend GRT meeting. The admin team will email you to schedule a time.';
      default:
        return '';
    }
  })();

  const isRecompete = requestType === 'RECOMPETE';

  // The meeting date is "scheduled" until the next day since there is no time
  // associated with meeting dates.
  const getMeetingDate = (date: string): string => {
    const dateTime = DateTime.fromISO(date);
    if (dateTime.isValid) {
      return dateTime.plus({ day: 1 }).toMillis() > DateTime.local().toMillis()
        ? `Scheduled for ${dateTime.toLocaleString(DateTime.DATE_FULL)}`
        : `Attended on ${dateTime.toLocaleString(DateTime.DATE_FULL)}`;
    }
    return '';
  };

  if (!loading && !systemIntake) {
    return <NotFound />;
  }

  return (
    <MainContent
      className="governance-task-list grid-container margin-bottom-7"
      data-testid="governance-task-list"
    >
      <div className="grid-row">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Get governance approval</Breadcrumb>
        </BreadcrumbBar>
      </div>
      {loading && <PageLoading />}
      {!loading && !!systemIntake && (
        <div className="grid-row">
          <div className="tablet:grid-col-9">
            <PageHeading>
              Get governance approval
              {requestName && (
                <span className="display-block line-height-body-5 font-body-lg text-light">
                  {isRecompete
                    ? 'for re-competing a contract without any changes to systems or services'
                    : `for ${requestName}`}
                </span>
              )}
            </PageHeading>
            {/* If intake has been closed w/ a decision - display an alert directing user to the decision information at the bottom of the page */}
            {intakeHasDecision(systemIntake.status) && (
              <Alert
                type="warning"
                className="margin-bottom-5"
                data-testid="task-list-closed-alert"
              >
                <span>
                  A decision has been made for this request, you can view the
                  decision at the bottom of this page. Please check the email
                  sent to you for further information.
                </span>
              </Alert>
            )}
            {/* If intake has had an LCID issued but is currently in an open status - display alert directing user to LCID info */}
            {systemIntake.lcid && isIntakeOpen(systemIntake.status) && (
              <Alert
                type="info"
                noIcon
                heading="Lifecycle ID Information"
                className="margin-bottom-5"
                data-testid="lcid-issued-alert"
              >
                <>
                  <span>LCID: {systemIntake.lcid}</span>
                  <br />
                  <UswdsReactLink
                    variant="unstyled"
                    to={`/governance-task-list/${id}/lcid-info`}
                  >
                    Read about this LCID
                  </UswdsReactLink>
                </>
              </Alert>
            )}
            <ol
              data-testid="task-list"
              className="governance-task-list__task-list governance-task-list__task-list--primary"
            >
              <TaskListItem
                testId="task-list-intake-form"
                heading="Fill in the request form"
                status={intakeTag(status || '')}
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
                testId="task-list-intake-review"
                heading="Feedback from initial review"
                status={initialReviewTag(status || '')}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    The Governance Admin Team will review your request and
                    decide if it needs further governance. If it does, they’ll
                    direct you to go through the remaining steps.
                  </p>
                </TaskListDescription>
                {/* Only display review Alert if intake is in initial stages (i.e. before review or request for business case) */}
                {['INTAKE_DRAFT', 'INTAKE_SUBMITTED'].includes(
                  status || ''
                ) && (
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
                )}
                {grtFeedback &&
                  grtFeedback.length > 0 &&
                  ['NEED_BIZ_CASE', 'BIZ_CASE_DRAFT'].includes(
                    status || ''
                  ) && (
                    <UswdsReactLink
                      className="usa-button margin-top-2"
                      variant="unstyled"
                      to={`/governance-task-list/${id}/feedback`}
                    >
                      Read feedback
                    </UswdsReactLink>
                  )}
              </TaskListItem>
              <TaskListItem
                testId="task-list-business-case-draft"
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
                  {grtDate && (
                    <span className="governance-task-list__meeting-date">
                      {getMeetingDate(grtDate)}
                    </span>
                  )}
                </TaskListDescription>
                <div>
                  {grtFeedback &&
                    grtFeedback.length > 0 &&
                    status === 'BIZ_CASE_CHANGES_NEEDED' && (
                      <>
                        <UswdsReactLink
                          className="usa-button margin-bottom-2"
                          variant="unstyled"
                          to={`/governance-task-list/${id}/feedback`}
                        >
                          Read feedback
                        </UswdsReactLink>
                        <br />
                      </>
                    )}
                  <BusinessCaseDraftCta systemIntake={systemIntake} />
                </div>
              </TaskListItem>
              <TaskListItem
                testId="task-list-business-case-final"
                heading="Submit the business case for final approval"
                status={finalBusinessCaseTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    Update the Business Case based on feedback from the review
                    meeting and submit it to the Governance Review Board.
                  </p>
                </TaskListDescription>
                {grtFeedback &&
                  grtFeedback.length > 0 &&
                  status === 'BIZ_CASE_FINAL_NEEDED' && (
                    <>
                      <UswdsReactLink
                        className="usa-button margin-y-2"
                        variant="unstyled"
                        to={`/governance-task-list/${id}/feedback`}
                      >
                        Read feedback
                      </UswdsReactLink>
                      <br />
                    </>
                  )}
                {status === 'BIZ_CASE_FINAL_NEEDED' && (
                  <UswdsReactLink
                    className="usa-button"
                    variant="unstyled"
                    to={`/business/${businessCaseId}/general-request-info`}
                  >
                    Review and Submit
                  </UswdsReactLink>
                )}
              </TaskListItem>

              <TaskListItem
                testId="task-list-grb-meeting"
                heading="Attend the GRB meeting"
                status={attendGrbMeetingTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    The Governance Review Board will discuss and make decisions
                    based on the Business Case and recommendations from the
                    Review Team.
                  </p>
                  {grbDate && (
                    <span className="governance-task-list__meeting-date">
                      {getMeetingDate(grbDate)}
                    </span>
                  )}
                </TaskListDescription>
                <AttendGrbMeetingCta intake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                testId="task-list-decision"
                heading="Decision and next steps"
                status={decisionTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    If your Business Case is approved you will receive a unique
                    Lifecycle ID. If it is not approved, you would need to
                    address the concerns to proceed.
                  </p>
                </TaskListDescription>
                <DecisionCta id={id} status={status || ''} />
              </TaskListItem>
            </ol>
          </div>
          <div className="tablet:grid-col-1" />
          <div className="tablet:grid-col-2">
            <SideNavActions
              intake={systemIntake}
              archiveIntake={archiveIntake}
            />
          </div>
        </div>
      )}
      <ImproveEasiSurvey />
    </MainContent>
  );
};

export default GovernanceTaskList;
