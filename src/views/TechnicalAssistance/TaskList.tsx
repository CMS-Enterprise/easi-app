import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, Grid, GridContainer, Link } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import TaskListItem, {
  TaskListContainer,
  TaskListDescription
} from 'components/TaskList';
import GetTrbTasklistQuery from 'queries/GetTrbTasklistQuery';
import {
  GetTrbTasklist,
  GetTrbTasklistVariables
} from 'queries/types/GetTrbTasklist';
import {
  TRBAdviceLetterStatus,
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus
} from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import NotFoundPartial from 'views/NotFound/NotFoundPartial';

import Breadcrumbs from './Breadcrumbs';

function TaskList() {
  const { t } = useTranslation('technicalAssistance');
  const requestTypeText = t<Record<string, { heading: string }>>(
    'requestType.type',
    {
      returnObjects: true
    }
  );
  const taskListText = t<{ heading: string; text: string; list?: string[] }[]>(
    'taskList.taskList',
    {
      returnObjects: true
    }
  );

  const { id } = useParams<{
    id: string;
  }>();

  const { data, error, loading } = useQuery<
    GetTrbTasklist,
    GetTrbTasklistVariables
  >(GetTrbTasklistQuery, {
    variables: {
      id
    }
  });

  if (error) {
    return (
      <GridContainer className="width-full">
        <NotFoundPartial />
      </GridContainer>
    );
  }

  const taskStatuses = data?.trbRequest.taskStatuses;

  const formStatus = data?.trbRequest.form.status;

  const editsRequested: boolean =
    taskStatuses?.feedbackStatus === TRBFeedbackStatus.EDITS_REQUESTED;

  const initialRequestButtonText = (): string => {
    if (editsRequested) {
      return t('button.update');
    }
    if (formStatus === TRBFormStatus.READY_TO_START) {
      return t('button.start');
    }
    return t('button.continue');
  };

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('heading'), url: '/trb' },
          {
            text: t('taskList.heading')
          }
        ]}
      />

      {data && formStatus ? (
        <Grid row gap className="margin-top-6">
          <Grid tablet={{ col: 9 }}>
            <PageHeading className="margin-y-0">
              {t('taskList.heading')}
            </PageHeading>

            <div className="line-height-body-4">
              {data && (
                <div>
                  <div className="trb-request-type text-light font-body-lg">
                    {requestTypeText[data.trbRequest.type].heading}
                  </div>

                  <UswdsReactLink to={`/trb/type/${id}`}>
                    {t('steps.changeRequestType')}
                  </UswdsReactLink>
                </div>
              )}

              <TaskListContainer className="margin-top-4">
                {/* Fill out the initial request form */}
                <TaskListItem
                  heading={taskListText[0].heading}
                  status={formStatus}
                  testId={kebabCase(taskListText[0].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[0].text}</p>

                    {editsRequested && formStatus !== TRBFormStatus.COMPLETED && (
                      <Alert type="warning" slim className="margin-bottom-205">
                        {t('taskList.editsRequestedWarning')}
                      </Alert>
                    )}
                  </TaskListDescription>
                  {/* Continue to fill out the request form or view the submitted request if it's completed */}
                  {formStatus === TRBFormStatus.COMPLETED ? (
                    <UswdsReactLink
                      target="_blank"
                      to={`/trb/requests/${id}/view`}
                    >
                      {t('taskList.viewSubmittedTrbRequest')}
                    </UswdsReactLink>
                  ) : (
                    <UswdsReactLink
                      variant="unstyled"
                      className="usa-button"
                      to={`/trb/requests/${id}`}
                    >
                      {initialRequestButtonText()}
                    </UswdsReactLink>
                  )}
                </TaskListItem>

                {/* Feedback from initial review */}
                <TaskListItem
                  heading={taskListText[1].heading}
                  status={taskStatuses?.feedbackStatus}
                  testId={kebabCase(taskListText[1].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[1].text}</p>
                  </TaskListDescription>

                  {data?.trbRequest.feedback.length === 0 &&
                    taskStatuses?.feedbackStatus ===
                      TRBFeedbackStatus.COMPLETED && (
                      <Grid desktop={{ col: 10 }}>
                        <Alert type="info" slim className="margin-bottom-0">
                          {t('taskList.noFeedback')}{' '}
                          <Link
                            href="mailto:cms-trb@cms.hhs.gov"
                            aria-label={t('taskList.sendAnEmail')}
                            target="_blank"
                          >
                            cms-trb@cms.hhs.gov
                          </Link>
                        </Alert>
                      </Grid>
                    )}

                  {data?.trbRequest.feedback.length !== 0 && (
                    <UswdsReactLink
                      variant="unstyled"
                      className="usa-button usa-button--outline"
                      to={{
                        pathname: `/trb/requests/${id}/feedback`,
                        state: { fromTaskList: true }
                      }}
                    >
                      {t('editsRequested.viewFeedback')}
                    </UswdsReactLink>
                  )}
                </TaskListItem>

                {/* Prepare for the TRB consult session */}
                <TaskListItem
                  heading={taskListText[2].heading}
                  status={taskStatuses?.consultPrepStatus}
                  testId={kebabCase(taskListText[2].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[2].text}</p>
                    <ul className="margin-bottom-2 list-disc">
                      <li>{taskListText[2].list![0]}</li>
                      <li>{taskListText[2].list![1]}</li>
                      <li>{taskListText[2].list![2]}</li>
                    </ul>

                    {taskStatuses?.consultPrepStatus !==
                    TRBConsultPrepStatus.CANNOT_START_YET ? (
                      <div>
                        <UswdsReactLink
                          variant="unstyled"
                          className="usa-button"
                          to="/help/it-governance/prepare-for-trb-consult" // TODO: replace with link to help article
                        >
                          {t('taskList.downloadTemplates')}
                        </UswdsReactLink>

                        <UswdsReactLink
                          className="display-block margin-top-2"
                          to={`/trb/request/${id}/upload-document`} // TODO: replace with link to document upload
                        >
                          {t('taskList.uploadDocuments')}
                        </UswdsReactLink>

                        <UswdsReactLink
                          className="display-block margin-top-2"
                          target="_blank"
                          to={`/trb/request/${id}/attendee-list`} // TODO: replace with link to view advice letter
                        >
                          {t('taskList.reviewAttendeeList')}
                        </UswdsReactLink>
                      </div>
                    ) : (
                      <UswdsReactLink
                        className="display-block margin-top-2"
                        to="/help/it-governance/prepare-for-trb-consult" // TODO: replace with link to help article
                      >
                        {t('taskList.prepareForTRB')}
                      </UswdsReactLink>
                    )}
                  </TaskListDescription>
                </TaskListItem>

                {/* Attend the TRB consult session */}
                <TaskListItem
                  heading={taskListText[3].heading}
                  status={taskStatuses?.attendConsultStatus}
                  testId={kebabCase(taskListText[3].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[3].text}</p>

                    {taskStatuses?.attendConsultStatus ===
                      TRBAttendConsultStatus.SCHEDULED && (
                      <Alert
                        type="info"
                        slim
                        className="margin-bottom-0 margin-top-205"
                      >
                        <h4 className="margin-0">
                          {data.trbRequest.consultMeetingTime &&
                            t('taskList.trbConsultInfoHeading', {
                              datetime: formatDateLocal(
                                data.trbRequest.consultMeetingTime,
                                'MM/dd/yyyy'
                              )
                            })}
                        </h4>
                        {t('taskList.trbConsultInfo')}{' '}
                        <Link
                          href="mailto:cms-trb@cms.hhs.gov"
                          aria-label={t('taskList.sendAnEmail')}
                          target="_blank"
                        >
                          cms-trb@cms.hhs.gov
                        </Link>
                      </Alert>
                    )}

                    {taskStatuses?.attendConsultStatus ===
                      TRBAttendConsultStatus.COMPLETED && (
                      <>
                        <Alert
                          type="info"
                          slim
                          className="margin-bottom-0 margin-top-205"
                        >
                          {data.trbRequest.consultMeetingTime &&
                            t('taskList.trbConsultAttended', {
                              datetime: formatDateLocal(
                                data.trbRequest.consultMeetingTime,
                                'MM/dd/yyyy'
                              )
                            })}
                        </Alert>
                        <UswdsReactLink
                          className="display-block margin-top-2"
                          target="_blank"
                          to={`/trb/request/${id}/attendee-list`} // TODO: replace with link to view attendee list
                        >
                          {t('taskList.viewAttendeeList')}
                        </UswdsReactLink>
                      </>
                    )}
                  </TaskListDescription>
                </TaskListItem>

                {/* Advice letter and next steps */}
                <TaskListItem
                  heading={taskListText[4].heading}
                  status={taskStatuses?.adviceLetterStatus}
                  testId={kebabCase(taskListText[4].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[4].text}</p>
                  </TaskListDescription>

                  {taskStatuses?.adviceLetterStatus ===
                    TRBAdviceLetterStatus.COMPLETED && (
                    <UswdsReactLink
                      variant="unstyled"
                      className="usa-button"
                      to={`/trb/requests/${id}/advice-letter`} // TODO: replace with link to view advice letter
                    >
                      {t('taskList.viewAdviceLetter')}
                    </UswdsReactLink>
                  )}
                </TaskListItem>
              </TaskListContainer>
            </div>
          </Grid>

          {/* Sidebar */}
          <Grid tablet={{ col: 3 }}>
            <div className="line-height-body-4 padding-top-3 border-top border-top-width-05 border-primary-lighter">
              <div>
                <UswdsReactLink to="/trb">
                  {t('button.saveAndExit')}
                </UswdsReactLink>
              </div>
              <div className="margin-top-1">
                <Button type="button" unstyled className="text-error">
                  {t('button.removeYourRequest')}
                </Button>
              </div>
              <h4 className="line-height-body-2 margin-top-3 margin-bottom-1">
                {t('taskList.additionalHelp')}
              </h4>
              <div className="text-base">{t('taskList.helpLinksNewTab')}</div>
              <div className="margin-top-1">
                <UswdsReactLink to=".">
                  {t('taskList.stepsInvolved')}
                </UswdsReactLink>
              </div>
              <div className="margin-top-1">
                <UswdsReactLink to=".">
                  {t('taskList.sampleRequest')}
                </UswdsReactLink>
              </div>
            </div>
          </Grid>
        </Grid>
      ) : (
        loading && <PageLoading />
      )}
    </GridContainer>
  );
}

export default TaskList;
