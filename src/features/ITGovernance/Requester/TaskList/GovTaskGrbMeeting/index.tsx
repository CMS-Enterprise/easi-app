import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';
import DiscussionBoard from 'features/DiscussionBoard';
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

import RequesterDiscussionsCard from './_components/RequesterDiscussionsCard';

const GovTaskGrbMeeting = ({
  id,
  itGovTaskStatuses: { grbMeetingStatus },
  state,
  grbDate,
  grbReviewType,
  grbReviewStartedAt,
  grbReviewAsyncEndDate,
  grbReviewAsyncRecordingTime,
  grbPresentationLinks
}: NonNullable<GetGovernanceTaskListQuery['systemIntake']>) => {
  const stepKey = 'grbMeeting';
  const { t } = useTranslation('itGov');
  const [removalModalOpen, setRemovalModalOpen] = useState(false);
  const [reviewTypesModalOpen, setReviewTypesModalOpen] = useState(false);
  const {
    showMessage,
    showErrorMessageInModal,
    errorMessageInModal,
    clearMessage
  } = useMessage();

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
      SCHEDULED: grbReviewAsyncRecordingTime,
      AWAITING_GRB_REVIEW: grbReviewAsyncRecordingTime,
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
        setRemovalModalOpen(false);
      })
      .catch(() => {
        showErrorMessageInModal(
          t('grbReview:asyncPresentation.modalRemoveLinks.error')
        );
      });
  };

  /**
   * Whether to render `Prepare for the GRB review` link as button
   * based on review type and meeting status
   */
  const renderPrepareGRBReviewButton = useMemo(() => {
    switch (grbMeetingStatus) {
      case ITGovGRBStatus.READY_TO_SCHEDULE:
        return !(
          grbReviewType === SystemIntakeGRBReviewType.ASYNC &&
          !grbPresentationLinks
        );

      case ITGovGRBStatus.SCHEDULED:
        return !(
          grbReviewType === SystemIntakeGRBReviewType.ASYNC &&
          !grbPresentationLinks
        );

      case ITGovGRBStatus.AWAITING_GRB_REVIEW:
        return !grbPresentationLinks;
      default:
        return false;
    }
  }, [grbMeetingStatus, grbReviewType, grbPresentationLinks]);

  const renderDiscussionBoard =
    grbMeetingStatus === ITGovGRBStatus.AWAITING_DECISION ||
    grbMeetingStatus === ITGovGRBStatus.REVIEW_IN_PROGRESS;

  return (
    <>
      {renderDiscussionBoard && <DiscussionBoard systemIntakeID={id} />}

      {/* Remove Presentation Modal */}
      <Modal
        isOpen={removalModalOpen}
        closeModal={() => {
          setRemovalModalOpen(false);
          clearMessage();
        }}
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
        closeModal={() => {
          setReviewTypesModalOpen(false);
          clearMessage();
        }}
        shouldCloseOnOverlayClick
        className="height-auto"
      >
        <h3 className="margin-y-0">
          {t(`taskList.step.${stepKey}.reviewTypeModal.title`)}
        </h3>

        <dl className="margin-top-0 font-body-sm line-height-body-5">
          {Object.values(SystemIntakeGRBReviewType).map(type => (
            <React.Fragment key={type}>
              <dt>
                <h4 className="margin-bottom-0">
                  {t(
                    `taskList.step.${stepKey}.reviewTypeModal.${type}.heading`
                  )}
                </h4>
              </dt>
              {t<string[]>(
                `taskList.step.${stepKey}.reviewTypeModal.${type}.description`,
                {
                  returnObjects: true
                }
              ).map((description, index) => (
                <dd
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="margin-left-0 margin-y-1"
                >
                  {description}
                </dd>
              ))}
            </React.Fragment>
          ))}
        </dl>

        <Button
          type="button"
          onClick={() => setReviewTypesModalOpen(false)}
          className="margin-top-2"
        >
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

          {
            /** Discussions card */
            // Only render if review is active
            renderDiscussionBoard && (
              <RequesterDiscussionsCard
                systemIntakeId={id}
                grbMeetingStatus={grbMeetingStatus}
              />
            )
          }

          {/** GRB review meeting help buttons */}
          <ButtonGroup
            className={classNames('margin-top-2', {
              'usa-button-group__divided': !renderPrepareGRBReviewButton
            })}
          >
            <UswdsReactLink
              to="/help/it-governance/prepare-for-grb"
              target="_blank"
              className={classNames({
                'usa-button': renderPrepareGRBReviewButton
              })}
            >
              {t('taskList.step.grbMeeting.button')}
            </UswdsReactLink>

            <Button
              type="button"
              unstyled
              onClick={() => setReviewTypesModalOpen(true)}
            >
              {t('taskList.step.grbMeeting.learnMore')}
            </Button>
          </ButtonGroup>
        </TaskListDescription>
      </TaskListItem>
    </>
  );
};

export default GovTaskGrbMeeting;
