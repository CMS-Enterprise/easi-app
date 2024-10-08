import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  ButtonGroup,
  Grid,
  GridContainer,
  Link,
  ModalHeading
} from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import TaskListItem, {
  TaskListContainer,
  TaskListDescription
} from 'components/TaskList';
import useMessage from 'hooks/useMessage';
import GetTrbTasklistQuery from 'queries/GetTrbTasklistQuery';
import {
  GetTrbTasklist,
  GetTrbTasklistVariables
} from 'queries/types/GetTrbTasklist';
import {
  UpdateTrbRequestArchived,
  UpdateTrbRequestArchivedVariables
} from 'queries/types/UpdateTrbRequestArchived';
import UpdateTrbRequestArchivedQuery from 'queries/UpdateTrbRequestArchivedQuery';
import {
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBGuidanceLetterStatusTaskList
} from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import AdditionalRequestInfo from 'views/GovernanceTaskList/AdditionalRequestInfo';
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

  const history = useHistory();
  const { id } = useParams<{
    id: string;
  }>();

  const { showMessageOnNextPage } = useMessage();

  const { data, error, loading } = useQuery<
    GetTrbTasklist,
    GetTrbTasklistVariables
  >(GetTrbTasklistQuery, {
    variables: {
      id
    }
  });

  const requestName = data?.trbRequest.name;

  const [archive] = useMutation<
    UpdateTrbRequestArchived,
    UpdateTrbRequestArchivedVariables
  >(UpdateTrbRequestArchivedQuery);

  const [isRemoveRequestModalOpen, setRemoveRequestModalOpen] =
    useState<boolean>(false);

  const removeRequest = () => {
    archive({ variables: { id, archived: true } }).then(result => {
      const message = t('taskList:withdraw_modal.confirmationText', {
        context: requestName ? 'name' : 'noName',
        requestName
      });
      showMessageOnNextPage(message, { type: 'success' });
      history.push('/');
    });
  };

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

  let consultDate;
  let consultTime;

  // Breaking apart date and time as text is inserted in between
  if (data?.trbRequest.consultMeetingTime) {
    consultDate = formatDateLocal(
      data.trbRequest.consultMeetingTime,
      'MM/dd/yyyy'
    );

    consultTime = DateTime.fromISO(
      data?.trbRequest.consultMeetingTime
    ).toLocaleString(DateTime.TIME_SIMPLE);
  }

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
                  <div className="trb-request-type font-body-lg line-height-body-5 text-light">
                    {data.trbRequest.name || t('taskList.defaultName')}
                  </div>
                  <div>
                    <span className="font-body-md line-height-body-4 text-base margin-right-1">
                      {requestTypeText[data.trbRequest.type].heading}
                    </span>
                    <UswdsReactLink to={`/trb/type/${id}`}>
                      {t('steps.changeRequestType')}
                    </UswdsReactLink>
                  </div>
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

                    {editsRequested &&
                      formStatus !== TRBFormStatus.COMPLETED && (
                        <Alert
                          type="warning"
                          slim
                          className="margin-bottom-205"
                        >
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

                  {data?.trbRequest.feedback.length > 0 && (
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

                    {taskStatuses?.consultPrepStatus ===
                    TRBConsultPrepStatus.READY_TO_START ? (
                      <div>
                        <UswdsReactLink
                          variant="unstyled"
                          className="usa-button"
                          to="/help/trb/prepare-consult-meeting#download-presentation-templates"
                          target="_blank"
                        >
                          {t('taskList.downloadTemplates')}
                        </UswdsReactLink>

                        <UswdsReactLink
                          className="display-block margin-top-2"
                          to={`/trb/task-list/${id}/documents`}
                        >
                          {t('taskList.uploadDocuments')}
                        </UswdsReactLink>

                        <UswdsReactLink
                          className="display-block margin-top-2"
                          to={`/trb/task-list/${id}/attendees`}
                        >
                          {t('taskList.reviewAttendeeList')}
                        </UswdsReactLink>
                      </div>
                    ) : (
                      <UswdsReactLink
                        className="display-block margin-top-2"
                        to="/help/trb/prepare-consult-meeting"
                        target="_blank"
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
                              date: consultDate,
                              time: consultTime
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
                              date: consultDate,
                              time: consultTime
                            })}
                        </Alert>
                      </>
                    )}
                  </TaskListDescription>
                </TaskListItem>

                {/* Advice letter and next steps */}
                <TaskListItem
                  heading={taskListText[4].heading}
                  status={taskStatuses?.adviceLetterStatusTaskList}
                  testId={kebabCase(taskListText[4].heading)}
                >
                  <TaskListDescription>
                    <p>{taskListText[4].text}</p>
                  </TaskListDescription>

                  {taskStatuses?.adviceLetterStatusTaskList ===
                    TRBGuidanceLetterStatusTaskList.COMPLETED && (
                    <UswdsReactLink
                      variant="unstyled"
                      className="usa-button"
                      to={{
                        pathname: `/trb/advice-letter/${id}`,
                        state: { fromTaskList: true }
                      }}
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
                <Button
                  type="button"
                  unstyled
                  className="text-error"
                  onClick={() => setRemoveRequestModalOpen(true)}
                >
                  {t('button.removeYourRequest')}
                </Button>
              </div>

              <AdditionalRequestInfo
                {...data.trbRequest}
                id={id}
                requestType="trb"
              />

              <h4 className="line-height-body-2 margin-top-3 margin-bottom-1">
                {t('taskList.additionalHelp')}
              </h4>
              <div className="text-base">{t('taskList.helpLinksNewTab')}</div>
              <div className="margin-top-1">
                <UswdsReactLink
                  to="/help/trb/steps-involved-trb"
                  target="_blank"
                >
                  {t('taskList.stepsInvolved')}
                </UswdsReactLink>
              </div>

              <div className="margin-top-1">
                <UswdsReactLink
                  to="/help/trb/prepare-consult-meeting"
                  target="_blank"
                >
                  {t('taskList.prepareConsultMeeting')}
                </UswdsReactLink>
              </div>
            </div>
          </Grid>

          {/* Remove request modal */}
          <Modal
            isOpen={isRemoveRequestModalOpen}
            closeModal={() => setRemoveRequestModalOpen(false)}
          >
            <ModalHeading>{t('taskList:trbWithdrawModal.header')}</ModalHeading>

            <p>{t('taskList:trbWithdrawModal.warning')}</p>

            <ButtonGroup>
              <Button
                className="margin-right-1 bg-error"
                type="button"
                onClick={removeRequest}
              >
                {t('taskList:withdraw_modal:confirm')}
              </Button>

              <Button
                type="button"
                unstyled
                onClick={() => setRemoveRequestModalOpen(false)}
              >
                {t('taskList:trbWithdrawModal.cancel')}
              </Button>
            </ButtonGroup>
          </Modal>
        </Grid>
      ) : (
        loading && <PageLoading />
      )}
    </GridContainer>
  );
}

export default TaskList;
