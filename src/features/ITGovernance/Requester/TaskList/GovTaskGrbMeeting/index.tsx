import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { kebabCase } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import {
  ITGovGRBStatus,
  SystemIntakeGRBReviewType
} from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';
import { formatDateUtc } from 'utils/date';

const GovTaskGrbMeeting = ({
  itGovTaskStatuses: { grbMeetingStatus },
  state,
  grbDate,
  grbReviewType,
  grbReviewStartedAt,
  grbReviewAsyncRecordingTime,
  grbReviewAsyncEndDate,
  grbReviewStandardGRBMeetingTime,
  grbReviewAsyncGRBMeetingTime
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'grbMeeting';
  const { t } = useTranslation('itGov');

  const dateMapping: Record<
    SystemIntakeGRBReviewType,
    Partial<Record<ITGovGRBStatus, string | null>>
  > = {
    STANDARD: {
      SCHEDULED: grbReviewStandardGRBMeetingTime,
      AWAITING_DECISION: grbReviewStartedAt,
      COMPLETED: grbReviewStartedAt
    },
    ASYNC: {
      SCHEDULED: grbReviewAsyncRecordingTime,
      AWAITING_GRB_REVIEW: grbReviewAsyncGRBMeetingTime,
      AWAITING_DECISION: grbReviewAsyncEndDate,
      COMPLETED: grbReviewAsyncEndDate
    }
  };

  const dateValue = dateMapping[grbReviewType]?.[grbMeetingStatus] ?? null;

  return (
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
                    dateStart: formatDateUtc(grbReviewStartedAt, 'MM/dd/yyyy'),
                    dateEnd: formatDateUtc(grbReviewAsyncEndDate, 'MM/dd/yyyy')
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
  );
};

export default GovTaskGrbMeeting;
