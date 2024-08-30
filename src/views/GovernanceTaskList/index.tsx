import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Button,
  ButtonGroup,
  Grid,
  GridContainer,
  Link,
  ModalHeading
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { TaskListContainer } from 'components/TaskList';
import { IT_GOV_EMAIL } from 'constants/externalUrls';
import useMessage from 'hooks/useMessage';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';
import {
  ITGovIntakeFormStatus,
  SystemIntakeDecisionState,
  SystemIntakeState,
  SystemIntakeStep
} from 'types/graphql-global-types';
import NotFound from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

import { useArchiveSystemIntakeMutation } from '../../gql/gen/graphql';

import AdditionalRequestInfo from './AdditionalRequestInfo';
import GovTaskBizCaseDraft from './GovTaskBizCaseDraft';
import GovTaskBizCaseFinal from './GovTaskBizCaseFinal';
import GovTaskDecisionAndNextSteps from './GovTaskDecisionAndNextSteps';
import GovTaskFeedbackFromInitialReview from './GovTaskFeedbackFromInitialReview';
import GovTaskGrbMeeting from './GovTaskGrbMeeting';
import GovTaskGrtMeeting from './GovTaskGrtMeeting';
import GovTaskIntakeForm from './GovTaskIntakeForm';

function GovernanceTaskList() {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('itGov');
  const history = useHistory();

  const { showMessageOnNextPage, showMessage, Message } = useMessage();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const { data, loading, error } = useQuery<
    GetGovernanceTaskList,
    GetGovernanceTaskListVariables
  >(GetGovernanceTaskListQuery, {
    variables: {
      id: systemId
    }
  });

  const [archive] = useArchiveSystemIntakeMutation({
    variables: {
      id: systemId
    }
  });

  const systemIntake = data?.systemIntake;
  const requestName = systemIntake?.requestName;

  const archiveIntake = async () => {
    archive()
      .then(() => {
        const message = t<string>('taskList:withdraw_modal.confirmationText', {
          context: requestName ? 'name' : 'noName',
          requestName
        });

        showMessageOnNextPage(message, { type: 'success' });
        history.push('/');
      })
      .catch(() => {
        const message = t<string>('taskList:withdraw_modal.error', {
          context: requestName ? 'name' : 'noName',
          requestName
        });

        showMessage(message, { type: 'error' });
        setModalOpen(false);
      });
  };

  const isClosed = systemIntake?.state === SystemIntakeState.CLOSED;

  const hasDecision =
    systemIntake?.decisionState !== SystemIntakeDecisionState.NO_DECISION;

  /** Returns true if request has decision and is either closed OR in the decision step */
  const showDecisionAlert =
    hasDecision &&
    (isClosed ||
      systemIntake?.step === SystemIntakeStep.DECISION_AND_NEXT_STEPS);

  if (error) {
    return <NotFound />;
  }

  return (
    <MainContent
      className="margin-bottom-5 desktop:margin-bottom-10"
      data-testid="governance-task-list"
    >
      <GridContainer className="width-full">
        <Message className="margin-top-5 margin-bottom-3" />

        <Breadcrumbs
          items={[
            { text: t('itGovernance'), url: '/system/making-a-request' },
            {
              text: t('taskList.heading')
            }
          ]}
        />

        {loading && <PageLoading />}

        {!loading && systemIntake && (
          <Grid row gap className="margin-top-6">
            <Grid tablet={{ col: 9 }}>
              <PageHeading className="margin-y-0">
                {t('taskList.heading')}
              </PageHeading>

              <div className="line-height-body-4">
                {requestName && (
                  <p className="font-body-lg line-height-body-5 text-light margin-y-0">
                    {t('taskList.description', { requestName })}
                  </p>
                )}

                {isClosed && !hasDecision && (
                  <Alert
                    type="warning"
                    heading={t('Request closed')}
                    className="margin-bottom-6"
                    data-testid="closed-alert"
                  >
                    <Trans
                      i18nKey="itGov:taskList.closedAlert.text"
                      components={{
                        emailLink: (
                          <Link href={`mailto:${IT_GOV_EMAIL}`}> </Link>
                        ),
                        email: IT_GOV_EMAIL
                      }}
                    />
                  </Alert>
                )}

                {
                  // Decision issued alert
                  showDecisionAlert && (
                    <Alert
                      type="info"
                      heading={t('taskList.decisionAlert.heading')}
                      className="margin-bottom-6"
                      data-testid="decision-alert"
                    >
                      <Trans
                        i18nKey="itGov:taskList.decisionAlert.text"
                        components={{
                          decisionLink: <Link href="#decision"> </Link>,
                          emailLink: (
                            <Link href={`mailto:${IT_GOV_EMAIL}`}> </Link>
                          ),
                          email: IT_GOV_EMAIL
                        }}
                      />
                    </Alert>
                  )
                }

                {
                  // General feedback banner with link
                  systemIntake.governanceRequestFeedbacks.length > 0 && (
                    <div className="bg-base-lightest padding-2 margin-top-3">
                      <h4 className="margin-0">
                        {t('taskList.generalFeedback.heading')}
                      </h4>
                      <p className="margin-top-05 line-height-body-5">
                        {t('taskList.generalFeedback.text')}
                      </p>
                      <UswdsReactLink
                        className="usa-button usa-button--outline"
                        to={`/governance-task-list/${systemIntake.id}/feedback`}
                      >
                        {t('button.viewFeedback')}
                      </UswdsReactLink>
                    </div>
                  )
                }

                <TaskListContainer className="margin-top-4">
                  {/* 1. Fill out the Intake Request form */}
                  <GovTaskIntakeForm {...systemIntake} />
                  {/* 2. Feedback from initial review */}
                  <GovTaskFeedbackFromInitialReview {...systemIntake} />
                  {/* 3. Prepare a draft Business Case */}
                  <GovTaskBizCaseDraft {...systemIntake} />
                  {/* 4. Attend the GRT meeting */}
                  <GovTaskGrtMeeting {...systemIntake} />
                  {/* 5. Submit your Business Case for final approval */}
                  <GovTaskBizCaseFinal {...systemIntake} />
                  {/* 6. Attend the GRB meeting */}
                  <GovTaskGrbMeeting {...systemIntake} />
                  {/* 7. Decision and next steps */}
                  <GovTaskDecisionAndNextSteps {...systemIntake} />
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
                {/* Only allow removal if the intake form has not yet been submitted */}
                {[
                  ITGovIntakeFormStatus.READY,
                  ITGovIntakeFormStatus.IN_PROGRESS
                ].includes(systemIntake.itGovTaskStatuses.intakeFormStatus) && (
                  <div className="margin-top-1">
                    <Button
                      type="button"
                      className="text-error"
                      onClick={() => setModalOpen(true)}
                      unstyled
                    >
                      {t('button.removeYourRequest')}
                    </Button>
                  </div>
                )}

                <AdditionalRequestInfo {...systemIntake} requestType="itgov" />

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

      {/* Remove request modal */}
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <ModalHeading>
          {t('taskList:withdraw_modal:header', {
            requestName: requestName || 'this request'
          })}
        </ModalHeading>

        <p>{t('taskList:withdraw_modal:warning')}</p>

        <ButtonGroup>
          <Button
            className="margin-right-1"
            type="button"
            onClick={archiveIntake}
          >
            {t('taskList:withdraw_modal:confirm')}
          </Button>

          <Button type="button" unstyled onClick={() => setModalOpen(false)}>
            {t('taskList:withdraw_modal:cancel')}
          </Button>
        </ButtonGroup>
      </Modal>
    </MainContent>
  );
}

export default GovernanceTaskList;
