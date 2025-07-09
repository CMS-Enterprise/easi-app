import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';
import DiscussionBoard from 'features/DiscussionBoard';
import {
  GetGovernanceTaskListQuery,
  ITGovGRBStatus,
  SystemIntakeGRBReviewType,
  SystemIntakeStep
} from 'gql/generated/graphql';
import { kebabCase } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import useMessage from 'hooks/useMessage';
import { formatDateUtc } from 'utils/date';

import RequesterDiscussionsCard from './_components/RequesterDiscussionsCard';
import RequesterPresentationDeck from './_components/RequesterPresentationDeck';

const GovTaskGrbMeeting = ({
  id,
  step,
  itGovTaskStatuses: { grbMeetingStatus },
  state,
  grbDate,
  grbReviewType,
  grbReviewStartedAt,
  grbReviewAsyncEndDate,
  grbReviewAsyncManualEndDate,
  grbReviewAsyncRecordingTime,
  grbPresentationLinks
}: NonNullable<GetGovernanceTaskListQuery['systemIntake']>) => {
  const { t } = useTranslation('itGov');
  const [reviewTypesModalOpen, setReviewTypesModalOpen] = useState(false);
  const { clearMessage } = useMessage();

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
      // Use manual end date will only exist if voting ended early
      AWAITING_DECISION: grbReviewAsyncManualEndDate || grbReviewAsyncEndDate,
      COMPLETED: grbReviewAsyncManualEndDate || grbReviewAsyncEndDate
    }
  };

  const dateValue = dateMapping[grbReviewType]?.[grbMeetingStatus] ?? null;

  /** Whether to render `Prepare for the GRB review` link as button */
  const renderPrepareGRBReviewButton = useMemo(() => {
    // Render link if awaiting decision or out of GRB meeting step
    if (
      step !== SystemIntakeStep.GRB_MEETING ||
      grbMeetingStatus === ITGovGRBStatus.AWAITING_DECISION
    ) {
      return false;
    }

    // For all other statuses, render link if presentation deck has NOT been uploaded
    return !!grbPresentationLinks?.presentationDeckFileName;
  }, [grbMeetingStatus, grbPresentationLinks, step]);

  /** Render review type and status alert during and after the GRB meeting step, if step was not skipped */
  const renderReviewDetails =
    grbMeetingStatus !== ITGovGRBStatus.CANT_START &&
    grbMeetingStatus !== ITGovGRBStatus.NOT_NEEDED;

  /** Render presentation deck info if in GRB meeting step and not awaiting decision */
  const renderPresentationDeck =
    step === SystemIntakeStep.GRB_MEETING &&
    grbMeetingStatus !== ITGovGRBStatus.AWAITING_DECISION;

  /** Render discussion board if in GRB meeting step */
  const renderDiscussionBoard = step === SystemIntakeStep.GRB_MEETING;

  return (
    <>
      {renderDiscussionBoard && <DiscussionBoard systemIntakeID={id} />}

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
          {t('taskList.step.grbMeeting.reviewTypeModal.title')}
        </h3>

        <dl className="margin-top-0 font-body-sm line-height-body-5">
          {Object.values(SystemIntakeGRBReviewType).map(type => (
            <React.Fragment key={type}>
              <dt>
                <h4 className="margin-bottom-0">
                  {t(
                    `taskList.step.grbMeeting.reviewTypeModal.${type}.heading`
                  )}
                </h4>
              </dt>
              {t<string, string[]>(
                `taskList.step.grbMeeting.reviewTypeModal.${type}.description`,
                {
                  returnObjects: true
                }
              ).map(description => (
                <dd key={description} className="margin-left-0 margin-y-1">
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
          {t('taskList.step.grbMeeting.reviewTypeModal.goBack')}
        </Button>
      </Modal>

      <TaskListItem
        heading={t('taskList.step.grbMeeting.title')}
        status={grbMeetingStatus}
        state={state}
        testId={kebabCase(t('taskList.step.grbMeeting.title'))}
      >
        <TaskListDescription>
          <p>{t('taskList.step.grbMeeting.description')}</p>

          {renderReviewDetails && (
            <>
              <p data-testid="review-type">
                <Trans
                  i18nKey="itGov:taskList.step.grbMeeting.reviewType.copy"
                  components={{
                    strong: <strong />
                  }}
                  values={{
                    type: t(
                      `taskList.step.grbMeeting.reviewType.${grbReviewType}`
                    )
                  }}
                />
              </p>
              <Alert slim type="info" data-testid="review-status-alert">
                {t(
                  `taskList.step.grbMeeting.alertType.${grbReviewType}.${grbMeetingStatus}`,
                  {
                    date: formatDateUtc(dateValue, 'MM/dd/yyyy'),
                    dateStart: formatDateUtc(grbReviewStartedAt, 'MM/dd/yyyy'),
                    dateEnd: formatDateUtc(grbReviewAsyncEndDate, 'MM/dd/yyyy')
                  }
                )}
              </Alert>
            </>
          )}

          {renderPresentationDeck && (
            <RequesterPresentationDeck
              systemIntakeID={id}
              grbMeetingStatus={grbMeetingStatus}
              grbReviewType={grbReviewType}
              grbPresentationLinks={grbPresentationLinks}
            />
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
