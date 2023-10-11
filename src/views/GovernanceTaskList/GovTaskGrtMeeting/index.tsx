import React from 'react';
import { useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { ITGovGRTStatus } from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';
import { formatDateUtc } from 'utils/date';

const GovTaskGrtMeeting = ({
  id,
  itGovTaskStatuses: { grtMeetingStatus },
  governanceRequestFeedbacks,
  grtDate
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'grtMeeting';
  const { t } = useTranslation('itGov');

  const hasFeedback = governanceRequestFeedbacks.length > 0;

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={grtMeetingStatus}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Scheduled or attended meeting date info */}
        {(grtMeetingStatus === ITGovGRTStatus.SCHEDULED ||
          grtMeetingStatus === ITGovGRTStatus.AWAITING_DECISION ||
          grtMeetingStatus === ITGovGRTStatus.COMPLETED) &&
          grtDate && (
            <Alert slim type="info">
              {t(
                `taskList.step.${stepKey}.${
                  grtMeetingStatus === ITGovGRTStatus.SCHEDULED
                    ? 'scheduledInfo'
                    : 'attendedInfo'
                }`,
                { date: formatDateUtc(grtDate, 'MMMM d, yyyy') }
              )}
            </Alert>
          )}

        {/* Button to prepare for the grt meeting */}
        {(grtMeetingStatus === ITGovGRTStatus.READY_TO_SCHEDULE ||
          grtMeetingStatus === ITGovGRTStatus.SCHEDULED) && (
          <div className="margin-top-2">
            <UswdsReactLink variant="unstyled" className="usa-button" to="./">
              {t(`taskList.step.${stepKey}.button`)}
            </UswdsReactLink>
          </div>
        )}

        {/* Link to view feedback */}
        {hasFeedback && (
          <div className="margin-top-2">
            {/* TODO: EASI-3088 - update feedback link */}
            <UswdsReactLink to={`/governance-task-list/${id}/feedback`}>
              {t(`button.viewFeedback`)}
            </UswdsReactLink>
          </div>
        )}

        {/* Link to prepare for the grt meeting */}
        {(grtMeetingStatus === ITGovGRTStatus.CANT_START ||
          grtMeetingStatus === ITGovGRTStatus.NOT_NEEDED ||
          grtMeetingStatus === ITGovGRTStatus.AWAITING_DECISION ||
          grtMeetingStatus === ITGovGRTStatus.COMPLETED) && (
          <div className="margin-top-2">
            <UswdsReactLink to="./">
              {t(`taskList.step.${stepKey}.link`)}
            </UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskGrtMeeting;
