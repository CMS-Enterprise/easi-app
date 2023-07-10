import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import TaskListItem, {
  TaskListContainer,
  TaskListDescription
} from 'components/TaskList';
import { taskListState } from 'data/mock/govTaskList';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';
import {
  GovernanceRequestFeedbackSourceAction,
  GovernanceRequestFeedbackTargetForm,
  ITGovIntakeFormStatus
} from 'types/graphql-global-types';
import { ItGovTaskSystemIntake } from 'types/itGov';
import NotFound from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

export const GovTaskIntakeForm = ({
  itGovTaskStatuses,
  governanceRequestFeedbacks,
  submittedAt,
  updatedAt
}: ItGovTaskSystemIntake) => {
  const stepKey = 'intakeForm';
  const { t } = useTranslation('itGov');

  const statusButtonText = new Map<ITGovIntakeFormStatus, string>([
    [ITGovIntakeFormStatus.READY, 'start'],
    [ITGovIntakeFormStatus.IN_PROGRESS, 'continue'],
    [ITGovIntakeFormStatus.EDITS_REQUESTED, 'editForm']
  ]);

  const hasFeedback =
    governanceRequestFeedbacks.filter(
      feedback =>
        feedback.sourceAction ===
          GovernanceRequestFeedbackSourceAction.REQUEST_EDITS &&
        feedback.targetForm ===
          GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST
    ).length > 0;

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={itGovTaskStatuses.intakeFormStatus}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
      completedIso={submittedAt}
      lastUpdatedIso={updatedAt}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Warning about edits requested */}
        {itGovTaskStatuses.intakeFormStatus ===
          ITGovIntakeFormStatus.EDITS_REQUESTED && (
          <Alert slim type="warning">
            {t(`taskList.step.${stepKey}.editsRequestedWarning`)}
          </Alert>
        )}

        {/* Button to the intake form */}
        {statusButtonText.has(itGovTaskStatuses.intakeFormStatus) && (
          <div className="margin-top-2">
            <UswdsReactLink variant="unstyled" className="usa-button" to="./">
              {t(
                `button.${statusButtonText.get(
                  itGovTaskStatuses.intakeFormStatus
                )}`
              )}
            </UswdsReactLink>
          </div>
        )}

        {/* Link to the submitted request form */}
        {itGovTaskStatuses.intakeFormStatus ===
          ITGovIntakeFormStatus.COMPLETED &&
          submittedAt && (
            <div className="margin-top-2">
              <UswdsReactLink to="./">
                {t(`taskList.step.${stepKey}.viewSubmittedRequestForm`)}
              </UswdsReactLink>
            </div>
          )}

        {/* Link to view feedback */}
        {hasFeedback && (
          <div className="margin-top-2">
            <UswdsReactLink to="./">{t(`button.viewFeedback`)}</UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

function GovernanceTaskList() {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('itGov');

  const { data, loading, error } = useQuery<
    GetGovernanceTaskList,
    GetGovernanceTaskListVariables
  >(GetGovernanceTaskListQuery, {
    variables: {
      id: systemId
    }
  });

  const systemIntake = data?.systemIntake;
  const itGovTaskStatuses = systemIntake?.itGovTaskStatuses;

  if (error) {
    return <NotFound />;
  }

  return (
    <MainContent className="margin-bottom-5 desktop:margin-bottom-10">
      <GridContainer className="width-full">
        <Breadcrumbs
          items={[
            { text: t('itGovernance'), url: '/system/making-a-request' },
            {
              text: t('taskList.heading')
            }
          ]}
        />

        {loading && <PageLoading />}

        {!loading && systemIntake && itGovTaskStatuses && (
          <Grid row gap className="margin-top-6">
            <Grid tablet={{ col: 9 }}>
              <PageHeading className="margin-y-0">
                {t('taskList.heading')}
              </PageHeading>

              <div className="line-height-body-4">
                <p className="font-body-lg line-height-body-5 text-light margin-y-0">
                  {t('taskList.description')}
                </p>

                <TaskListContainer className="margin-top-4">
                  {/* 1. Fill out the Intake Request form */}
                  <GovTaskIntakeForm {...systemIntake} />
                  {/* Ui state previews from mockdata */}
                  {[
                    taskListState.intakeFormNotStarted,
                    taskListState.intakeFormInProgress,
                    taskListState.intakeFormSubmitted,
                    taskListState.intakeFormEditsRequested,
                    taskListState.intakeFormResubmittedAfterEdits
                  ].map(mockdata => (
                    <GovTaskIntakeForm {...mockdata.systemIntake!} />
                  ))}

                  {/* 2. Feedback from initial review */}
                  <TaskListItem
                    heading={t('taskList.step.feedbackFromInitialReview.title')}
                    status={itGovTaskStatuses.feedbackFromInitialReviewStatus}
                    testId={kebabCase(
                      t('taskList.step.feedbackFromInitialReview.title')
                    )}
                  >
                    <TaskListDescription>
                      <p>
                        {t(
                          'taskList.step.feedbackFromInitialReview.description'
                        )}
                      </p>
                      <Alert type="info" slim className="margin-bottom-0">
                        <Trans i18nKey="itGov:taskList.step.feedbackFromInitialReview.info" />
                      </Alert>
                    </TaskListDescription>
                  </TaskListItem>

                  {/* 3. Prepare a draft Business Case */}
                  <TaskListItem
                    heading={t('taskList.step.bizCaseDraft.title')}
                    status={itGovTaskStatuses.bizCaseDraftStatus}
                    testId={kebabCase(t('taskList.step.bizCaseDraft.title'))}
                  >
                    <TaskListDescription>
                      <p>{t('taskList.step.bizCaseDraft.description')}</p>
                    </TaskListDescription>
                  </TaskListItem>

                  {/* 4. Attend the GRT meeting */}
                  <TaskListItem
                    heading={t('taskList.step.grtMeeting.title')}
                    status={itGovTaskStatuses.grtMeetingStatus}
                    testId={kebabCase(t('taskList.step.grtMeeting.title'))}
                  >
                    <TaskListDescription>
                      <p>{t('taskList.step.grtMeeting.description')}</p>
                      <div className="margin-top-2">
                        <UswdsReactLink to="./">
                          {t('taskList.step.grtMeeting.link')}
                        </UswdsReactLink>
                      </div>
                    </TaskListDescription>
                  </TaskListItem>

                  {/* 5. Submit your Business Case for final approval */}
                  <TaskListItem
                    heading={t('taskList.step.bizCaseFinal.title')}
                    status={itGovTaskStatuses.bizCaseFinalStatus}
                    testId={kebabCase(t('taskList.step.bizCaseFinal.title'))}
                  >
                    <TaskListDescription>
                      <p>{t('taskList.step.bizCaseFinal.description')}</p>
                    </TaskListDescription>
                  </TaskListItem>

                  {/* 6. Attend the GRB meeting */}
                  <TaskListItem
                    heading={t('taskList.step.grbMeeting.title')}
                    status={itGovTaskStatuses.grbMeetingStatus}
                    testId={kebabCase(t('taskList.step.grbMeeting.title'))}
                  >
                    <TaskListDescription>
                      <p>{t('taskList.step.grbMeeting.description')}</p>
                      <div className="margin-top-2">
                        <UswdsReactLink to="./">
                          {t('taskList.step.grbMeeting.link')}
                        </UswdsReactLink>
                      </div>
                    </TaskListDescription>
                  </TaskListItem>

                  {/* 7. Decision and next steps */}
                  <TaskListItem
                    heading={t('taskList.step.decisionAndNextSteps.title')}
                    status={itGovTaskStatuses.decisionAndNextStepsStatus}
                    testId={kebabCase(
                      t('taskList.step.decisionAndNextSteps.title')
                    )}
                  >
                    <TaskListDescription>
                      <p>
                        {t('taskList.step.decisionAndNextSteps.description')}
                      </p>
                    </TaskListDescription>
                  </TaskListItem>
                </TaskListContainer>
              </div>
            </Grid>

            {/* Sidebar */}
            <Grid tablet={{ col: 3 }}>
              <div className="line-height-body-4 padding-top-3 border-top border-top-width-05 border-primary-lighter">
                <div>
                  <UswdsReactLink to="/system/making-a-request">
                    {t('button.saveAndExit')}
                  </UswdsReactLink>
                </div>
                <div className="margin-top-1">
                  <Button type="button" unstyled className="text-error">
                    {t('button.removeYourRequest')}
                  </Button>
                </div>

                <h4 className="line-height-body-2 margin-top-3 margin-bottom-1">
                  {t('taskList.help')}
                </h4>
                <div className="margin-top-1">
                  <UswdsReactLink
                    to="/help/it-governance/steps-overview/new-system"
                    target="_blank"
                  >
                    {t('taskList.stepsInvolved')}
                  </UswdsReactLink>
                </div>
                <div className="margin-top-1">
                  <UswdsReactLink
                    to="/help/it-governance/sample-business-case"
                    target="_blank"
                  >
                    {t('taskList.sampleBusinessCase')}
                  </UswdsReactLink>
                </div>
              </div>
            </Grid>
          </Grid>
        )}
      </GridContainer>
    </MainContent>
  );
}

export default GovernanceTaskList;
