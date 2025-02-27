import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetGovernanceTaskListQuery,
  ITGovGRTStatus
} from 'gql/generated/graphql';
import { kebabCase } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { formatDateUtc } from 'utils/date';

const GovTaskGrtMeeting = ({
  id,
  itGovTaskStatuses: { grtMeetingStatus },
  state,
  governanceRequestFeedbacks,
  grtDate
}: NonNullable<GetGovernanceTaskListQuery['systemIntake']>) => {
  const stepKey = 'grtMeeting';
  const { t } = useTranslation('itGov');

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={grtMeetingStatus}
      state={state}
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
            <UswdsReactLink
              variant="unstyled"
              className="usa-button"
              to="/help/it-governance/prepare-for-grt"
              target="_blank"
            >
              {t(`taskList.step.${stepKey}.button`)}
            </UswdsReactLink>
          </div>
        )}

        {/* Link to prepare for the grt meeting */}
        {(grtMeetingStatus === ITGovGRTStatus.CANT_START ||
          grtMeetingStatus === ITGovGRTStatus.NOT_NEEDED ||
          grtMeetingStatus === ITGovGRTStatus.AWAITING_DECISION ||
          grtMeetingStatus === ITGovGRTStatus.COMPLETED) && (
          <div className="margin-top-2">
            <UswdsReactLink
              to="/help/it-governance/prepare-for-grt"
              target="_blank"
            >
              {t(`taskList.step.${stepKey}.link`)}
            </UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskGrtMeeting;
