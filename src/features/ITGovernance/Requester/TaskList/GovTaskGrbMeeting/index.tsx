import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetGovernanceTaskListQuery,
  ITGovGRBStatus,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import { kebabCase } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { formatDateUtc } from 'utils/date';

const GovTaskGrbMeeting = ({
  itGovTaskStatuses: { grbMeetingStatus },
  state,
  grbDate,
  grbReviewType,
  grbReviewStartedAt,
  grbReviewAsyncEndDate,
  grbReviewAsyncGRBMeetingTime
}: NonNullable<GetGovernanceTaskListQuery['systemIntake']>) => {
  const stepKey = 'grbMeeting';
  const { t } = useTranslation('itGov');
  const [modalOpen, setModalOpen] = useState(false);

  // TEMPORARY: Remove when scanning is implemented
  const isScanning = false;

  const dateMapping: Record<
    SystemIntakeGRBReviewType,
    Partial<Record<ITGovGRBStatus, string | null>>
  > = {
    STANDARD: {
      SCHEDULED: grbDate,
      AWAITING_DECISION: grbDate,
      COMPLETED: grbDate
    },
    ASYNC: {
      SCHEDULED: grbReviewAsyncGRBMeetingTime,
      AWAITING_GRB_REVIEW: grbReviewAsyncGRBMeetingTime,
      AWAITING_DECISION: grbReviewAsyncEndDate,
      COMPLETED: grbReviewAsyncEndDate
    }
  };

  const dateValue = dateMapping[grbReviewType]?.[grbMeetingStatus] ?? null;

  return (
    <>
      {/* Remove Presentation Modal */}
      <Modal
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        shouldCloseOnOverlayClick
        className="maxw-mobile-lg height-auto"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-0 margin-bottom-2 line-height-sans-2"
        >
          {t(`taskList.step.${stepKey}.removeModal.title`)}
        </PageHeading>
        <p
          className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-2"
          style={{ whiteSpace: 'break-spaces' }}
        >
          {t(`taskList.step.${stepKey}.removeModal.text`)}
        </p>
        <ButtonGroup style={{ gap: '1.5rem' }}>
          <Button
            type="button"
            className="bg-error"
            // TODO: Implement remove presentation functionality
            onClick={() => console.log('Remove Presentation')}
          >
            {t(`taskList.step.${stepKey}.removeModal.confirm`)}
          </Button>
          <Button type="button" unstyled onClick={() => setModalOpen(false)}>
            {t(`taskList.step.${stepKey}.removeModal.goBack`)}
          </Button>
        </ButtonGroup>
      </Modal>

      <TaskListItem
        heading={t(`taskList.step.${stepKey}.title`)}
        status={grbMeetingStatus}
        state={state}
        testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
      >
        <TaskListDescription>
          <p>{t(`taskList.step.${stepKey}.description`)}</p>

          {grbMeetingStatus !== ITGovGRBStatus.CANT_START &&
            grbMeetingStatus !== ITGovGRBStatus.NOT_NEEDED && (
              <>
                <p>
                  <Trans
                    i18nKey={`itGov:taskList.step.${stepKey}.reviewType.copy`}
                    components={{
                      strong: <strong />
                    }}
                    values={{
                      type: t(
                        `taskList.step.${stepKey}.reviewType.${grbReviewType}`
                      )
                    }}
                  />
                </p>
                <Alert slim type="info">
                  {t(
                    `taskList.step.${stepKey}.alertType.${grbReviewType}.${grbMeetingStatus}`,
                    {
                      date: dateValue
                        ? formatDateUtc(dateValue, 'MM/dd/yyyy')
                        : null,
                      dateStart: formatDateUtc(
                        grbReviewStartedAt,
                        'MM/dd/yyyy'
                      ),
                      dateEnd: formatDateUtc(
                        grbReviewAsyncEndDate,
                        'MM/dd/yyyy'
                      )
                    }
                  )}
                </Alert>
                {grbReviewType === SystemIntakeGRBReviewType.ASYNC && (
                  <div className="margin-top-2">
                    <UswdsReactLink
                      variant="unstyled"
                      className="usa-button"
                      // TODO: Update link to actual async recording upload page
                      to="#"
                      target="_blank"
                    >
                      {t(`taskList.step.${stepKey}.presentationUploadButton`)}
                    </UswdsReactLink>
                    <div>
                      {isScanning ? (
                        <span>
                          <em>
                            {t(`itGov:taskList.step.${stepKey}.scanning`)}
                          </em>
                        </span>
                      ) : (
                        <>
                          <span className="margin-right-1">
                            <Trans
                              i18nKey={`itGov:taskList.step.${stepKey}.uploadPresentation`}
                              components={{
                                strong: <strong />
                              }}
                              values={{
                                fileName: 'presentation.pdf'
                              }}
                            />
                          </span>
                          <Button
                            className="margin-right-1"
                            type="button"
                            unstyled
                            onClick={() => console.log('view')}
                          >
                            {t(`taskList.step.${stepKey}.view`)}
                          </Button>
                          <Button
                            className="text-error"
                            type="button"
                            unstyled
                            onClick={() => setModalOpen(true)}
                          >
                            {t(`taskList.step.${stepKey}.remove`)}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

          <div className="margin-top-2 display-flex flex-align-center">
            <UswdsReactLink
              to="/help/it-governance/prepare-for-grb"
              target="_blank"
              className={classNames(
                'margin-right-2 padding-right-2 border-right-1px border-base-lighter',
                {
                  'usa-button  border-right-0':
                    grbReviewType === SystemIntakeGRBReviewType.STANDARD &&
                    (grbMeetingStatus === ITGovGRBStatus.READY_TO_SCHEDULE ||
                      grbMeetingStatus === ITGovGRBStatus.SCHEDULED)
                }
              )}
            >
              {t(`taskList.step.${stepKey}.button`)}
            </UswdsReactLink>
            <UswdsReactLink
              to="/help/it-governance/prepare-for-grb"
              target="_blank"
            >
              {t(`taskList.step.${stepKey}.learnMore`)}
            </UswdsReactLink>
          </div>
        </TaskListDescription>
      </TaskListItem>
    </>
  );
};

export default GovTaskGrbMeeting;
