import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';
import DiscussionBoard from 'features/DiscussionBoard';
import {
  GetGovernanceTaskListQuery,
  ITGovGRBStatus,
  SystemIntakeGRBReviewType
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

          {grbMeetingStatus !== ITGovGRBStatus.CANT_START &&
            grbMeetingStatus !== ITGovGRBStatus.NOT_NEEDED && (
              <>
                <p>
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
                <Alert slim type="info">
                  {t(
                    `taskList.step.grbMeeting.alertType.${grbReviewType}.${grbMeetingStatus}`,
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
                  <RequesterPresentationDeck
                    systemIntakeID={id}
                    grbPresentationLinks={grbPresentationLinks}
                  />
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
