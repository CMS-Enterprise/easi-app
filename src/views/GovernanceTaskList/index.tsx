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
import NotFound from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

import GovTaskIntakeForm from './GovTaskIntakeForm';

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
