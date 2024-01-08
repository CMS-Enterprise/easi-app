import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import {
  attendGrbMeetingTag,
  businessCaseTag,
  decisionTag,
  finalBusinessCaseTag,
  initialReviewTag,
  intakeTag
} from 'data/taskList';
import useMessage from 'hooks/useMessage';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import { archiveSystemIntake, fetchBusinessCase } from 'types/routines';
import { parseAsUTC } from 'utils/date';
import { intakeHasDecision, isIntakeOpen } from 'utils/systemIntake';
import NotFound from 'views/NotFound';

import TaskListItem, {
  TaskListContainer,
  TaskListDescription
} from '../../components/TaskList';

import SideNavActions from './SideNavActions';
import {
  AttendGrbMeetingCta,
  BusinessCaseDraftCta,
  DecisionCta,
  IntakeDraftCta
} from './TaskListCta';

const GovernanceTaskList = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { showMessageOnNextPage } = useMessage();
  const { t } = useTranslation('taskList');

  const { loading, data } = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      variables: {
        id: systemId
      }
    }
  );

  const grtFeedback = data?.systemIntake?.governanceRequestFeedbacks;

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
      const message = t('withdraw_modal.confirmationText', {
        context: requestName ? 'name' : 'noName',
        requestName
      });
      showMessageOnNextPage(message, { type: 'success' });
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
    const dateTime = parseAsUTC(date);
    if (dateTime.isValid) {
      return dateTime.plus({ day: 1 }) > DateTime.local()
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
      className="grid-container margin-bottom-7"
      data-testid="governance-task-list"
    >
      <div className="grid-row">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>{t('navigation.home')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{t('navigation.governanceTaskList')}</Breadcrumb>
        </BreadcrumbBar>
      </div>
      {loading && <PageLoading />}
      {!loading && !!systemIntake && (
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-9">
            <PageHeading>
              {t('pageHeading')}
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
                <span>{t('decision.alert')}</span>
              </Alert>
            )}
            {/* If intake has had an LCID issued but is currently in an open status - display alert directing user to LCID info */}
            {systemIntake.lcid && isIntakeOpen(systemIntake.status) && (
              <Alert
                type="info"
                noIcon
                heading={t('lcidAlert.heading')}
                className="margin-bottom-5"
                data-testid="lcid-issued-alert"
              >
                <>
                  <span>
                    {t('lcidAlert.label')} {systemIntake.lcid}
                  </span>
                  <br />
                  <UswdsReactLink
                    variant="unstyled"
                    to={`/governance-task-list/${id}/lcid-info`}
                  >
                    {t('lcidAlert.link')}
                  </UswdsReactLink>
                </>
              </Alert>
            )}
            <TaskListContainer className="margin-top-4">
              <TaskListItem
                testId="task-list-intake-form"
                heading={t('requestForm.heading')}
                status={intakeTag(status || '')}
              >
                <TaskListDescription>
                  <p className="margin-top-0">{t('requestForm.description')}</p>
                </TaskListDescription>
                <IntakeDraftCta intake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                testId="task-list-intake-review"
                heading={t('initialReviewFeedback.heading')}
                status={initialReviewTag(status || '')}
              >
                <TaskListDescription>
                  <p className="margin-y-0">
                    {t('initialReviewFeedback.description')}
                  </p>
                </TaskListDescription>
                {/* Only display review Alert if intake is in initial stages (i.e. before review or request for business case) */}
                {['INTAKE_DRAFT', 'INTAKE_SUBMITTED'].includes(
                  status || ''
                ) && (
                  <Alert type="info">
                    <span>{t('initialReviewFeedback.alertOne')}</span>
                    <br />
                    <br />
                    <span>{t('initialReviewFeedback.alertTwo')}</span>
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
                      {t('initialReviewFeedback.link')}
                    </UswdsReactLink>
                  )}
              </TaskListItem>
              <TaskListItem
                testId="task-list-business-case-draft"
                heading={t('businessCase.heading')}
                status={businessCaseTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    {t('businessCase.descriptionOne')}
                  </p>
                  <p>{t('businessCase.descriptionTwo')}</p>

                  {businessCaseStage && (
                    <p>
                      <span className="text-bold">
                        {t('businessCase.status')}&nbsp;
                      </span>
                      <span>{businessCaseStage}</span>
                    </p>
                  )}
                  {grtDate && (
                    <p className="task-list__meeting-date">
                      {getMeetingDate(grtDate)}
                    </p>
                  )}
                </TaskListDescription>
                {grtFeedback &&
                  grtFeedback.length > 0 &&
                  status === 'BIZ_CASE_CHANGES_NEEDED' && (
                    <>
                      <UswdsReactLink
                        className="usa-button margin-bottom-2"
                        variant="unstyled"
                        to={`/governance-task-list/${id}/feedback`}
                      >
                        {t('initialReviewFeedback.link')}
                      </UswdsReactLink>
                      <br />
                    </>
                  )}
                <UswdsReactLink
                  className={`display-block ${
                    status === 'READY_FOR_GRT'
                      ? 'usa-button display-inline-block'
                      : ''
                  }`}
                  target="_blank"
                  variant="unstyled"
                  data-testid="prepare-for-grt-cta"
                  to="/help/it-governance/prepare-for-grt"
                >
                  {t('cta.prepareGRT')}
                </UswdsReactLink>
                <BusinessCaseDraftCta systemIntake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                testId="task-list-business-case-final"
                heading={t('finalApproval.heading')}
                status={finalBusinessCaseTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-y-0">{t('finalApproval.description')}</p>
                </TaskListDescription>
                {grtFeedback &&
                  grtFeedback.length > 0 &&
                  status === 'BIZ_CASE_FINAL_NEEDED' && (
                    <>
                      <UswdsReactLink
                        className="usa-button margin-top-2"
                        variant="unstyled"
                        to={`/governance-task-list/${id}/feedback`}
                      >
                        {t('initialReviewFeedback.link')}
                      </UswdsReactLink>
                      <br />
                    </>
                  )}
                {status === 'BIZ_CASE_FINAL_NEEDED' && (
                  <UswdsReactLink
                    className="usa-button margin-top-2"
                    variant="unstyled"
                    to={`/business/${businessCaseId}/general-request-info`}
                  >
                    {t('finalApproval.link')}
                  </UswdsReactLink>
                )}
              </TaskListItem>

              <TaskListItem
                testId="task-list-grb-meeting"
                heading={t('attendGRB.heading')}
                status={attendGrbMeetingTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">{t('attendGRB.description')}</p>
                  {grbDate && (
                    <p className="task-list__meeting-date margin-bottom-2">
                      {getMeetingDate(grbDate)}
                    </p>
                  )}
                </TaskListDescription>
                <AttendGrbMeetingCta intake={systemIntake} />
              </TaskListItem>
              <TaskListItem
                testId="task-list-decision"
                heading={t('decisionNextSteps.heading')}
                status={decisionTag(systemIntake)}
              >
                <TaskListDescription>
                  <p className="margin-top-0">
                    {t('decisionNextSteps.description')}
                  </p>
                </TaskListDescription>
                <DecisionCta id={id || ''} status={status || ''} />
              </TaskListItem>
            </TaskListContainer>
          </div>
          <div className="tablet:grid-col-3">
            <SideNavActions
              intake={systemIntake}
              archiveIntake={archiveIntake}
            />
          </div>
        </div>
      )}
    </MainContent>
  );
};

export default GovernanceTaskList;
