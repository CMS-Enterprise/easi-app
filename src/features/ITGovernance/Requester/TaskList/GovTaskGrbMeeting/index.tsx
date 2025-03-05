import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetGovernanceTaskListQuery,
  ITGovGRBStatus,
  SystemIntakeDocumentStatus,
  SystemIntakeGRBReviewType,
  useDeleteSystemIntakeGRBPresentationLinksMutation
} from 'gql/generated/graphql';
import { kebabCase } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import useMessage from 'hooks/useMessage';
import { formatDateUtc } from 'utils/date';

const GovTaskGrbMeeting = ({
  id,
  itGovTaskStatuses: { grbMeetingStatus },
  state,
  grbDate,
  grbReviewType,
  grbReviewStartedAt,
  grbReviewAsyncEndDate,
  grbReviewAsyncGRBMeetingTime,
  grbPresentationLinks
}: NonNullable<GetGovernanceTaskListQuery['systemIntake']>) => {
  const stepKey = 'grbMeeting';
  const { t } = useTranslation('itGov');
  const [removalModalOpen, setRemovalModalOpen] = useState(false);
  const [reviewTypesModalOpen, setReviewTypesModalOpen] = useState(false);
  const { showMessage, showErrorMessageInModal, errorMessageInModal } =
    useMessage();

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

  const [deleteSystemIntakeGRBPresentationLinks] =
    useDeleteSystemIntakeGRBPresentationLinksMutation({
      variables: {
        input: {
          systemIntakeID: id
        }
      },
      refetchQueries: ['GetGovernanceTaskList']
    });

  const removePresentationLinks = () => {
    deleteSystemIntakeGRBPresentationLinks()
      .then(() => {
        showMessage(t('grbReview:asyncPresentation.modalRemoveLinks.success'), {
          type: 'success'
        });
      })
      .catch(() => {
        showErrorMessageInModal(
          t('grbReview:asyncPresentation.modalRemoveLinks.error')
        );
      })
      .finally(() => {
        setRemovalModalOpen(false);
      });
  };

  return (
    <>
      {/* Remove Presentation Modal */}
      <Modal
        isOpen={removalModalOpen}
        closeModal={() => setRemovalModalOpen(false)}
        shouldCloseOnOverlayClick
        className="maxw-mobile-lg height-auto"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-0 margin-bottom-2 line-height-sans-2"
        >
          {t(`taskList.step.${stepKey}.removeModal.title`)}
        </PageHeading>
        {errorMessageInModal && (
          <Alert type="error" className="margin-top-2">
            {errorMessageInModal}
          </Alert>
        )}
        <p
          className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-2"
          style={{ whiteSpace: 'break-spaces' }}
        >
          {t(`taskList.step.${stepKey}.removeModal.text`)}
        </p>
        <ButtonGroup style={{ gap: '0.5rem 1.5rem' }}>
          <Button
            type="button"
            className="bg-error"
            onClick={() => removePresentationLinks()}
          >
            {t(`taskList.step.${stepKey}.removeModal.confirm`)}
          </Button>
          <Button
            type="button"
            unstyled
            onClick={() => setRemovalModalOpen(false)}
          >
            {t(`taskList.step.${stepKey}.removeModal.goBack`)}
          </Button>
        </ButtonGroup>
      </Modal>

      {/* GRB Review Type Modal */}
      <Modal
        isOpen={reviewTypesModalOpen}
        closeModal={() => setReviewTypesModalOpen(false)}
        shouldCloseOnOverlayClick
        className="height-auto"
      >
        <PageHeading headingLevel="h3" className="margin-top-0 margin-bottom-3">
          {t(`taskList.step.${stepKey}.reviewTypeModal.title`)}
        </PageHeading>

        {Object.values(SystemIntakeGRBReviewType).map(type => (
          <React.Fragment key={type}>
            <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-1 text-bold">
              {t(`taskList.step.${stepKey}.reviewTypeModal.${type}.heading`)}
            </p>
            {(
              t(
                `taskList.step.${stepKey}.reviewTypeModal.${type}.description`,
                {
                  returnObjects: true
                }
              ) as string[]
            ).map((description, index, arr) => (
              <p
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={`margin-top-0 ${
                  index === arr.length - 1
                    ? 'margin-bottom-3'
                    : 'margin-bottom-1'
                }`}
              >
                {description}
              </p>
            ))}
          </React.Fragment>
        ))}

        <Button type="button" onClick={() => setReviewTypesModalOpen(false)}>
          {t(`taskList.step.${stepKey}.reviewTypeModal.goBack`)}
        </Button>
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
                      date: formatDateUtc(dateValue, 'MM/dd/yyyy'),
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
                    {/* If presentation deck is not uploaded, then show upload button */}
                    {!grbPresentationLinks && (
                      <UswdsReactLink
                        variant="unstyled"
                        className="usa-button"
                        to={`/governance-task-list/${id}/presentation-deck-upload`}
                      >
                        {t(`taskList.step.${stepKey}.presentationUploadButton`)}
                      </UswdsReactLink>
                    )}
                    {/* Else, render file status as pending or the actual file name */}
                    {grbPresentationLinks && (
                      <div>
                        {grbPresentationLinks.presentationDeckFileStatus ===
                        SystemIntakeDocumentStatus.PENDING ? (
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
                                  fileName:
                                    grbPresentationLinks.presentationDeckFileName
                                }}
                              />
                            </span>

                            <Link
                              href={
                                grbPresentationLinks.presentationDeckFileURL!
                              }
                              target="_blank"
                              className="margin-right-1"
                            >
                              {t(`taskList.step.${stepKey}.view`)}
                            </Link>
                            <Button
                              className="text-error"
                              type="button"
                              unstyled
                              onClick={() => setRemovalModalOpen(true)}
                            >
                              {t(`taskList.step.${stepKey}.remove`)}
                            </Button>
                          </>
                        )}
                      </div>
                    )}
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
                (grbReviewType === SystemIntakeGRBReviewType.STANDARD &&
                  (grbMeetingStatus === ITGovGRBStatus.READY_TO_SCHEDULE ||
                    grbMeetingStatus === ITGovGRBStatus.SCHEDULED)) ||
                  grbPresentationLinks
                  ? 'usa-button border-right-0'
                  : ''
              )}
            >
              {t(`taskList.step.${stepKey}.button`)}
            </UswdsReactLink>
            <Button
              type="button"
              unstyled
              onClick={() => setReviewTypesModalOpen(true)}
            >
              {t(`taskList.step.${stepKey}.learnMore`)}
            </Button>
          </div>
        </TaskListDescription>
      </TaskListItem>
    </>
  );
};

export default GovTaskGrbMeeting;
