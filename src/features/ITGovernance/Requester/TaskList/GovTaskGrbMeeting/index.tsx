import React from 'react';
import { useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { ITGovGRBStatus } from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';
import { formatDateUtc } from 'utils/date';

const GovTaskGrbMeeting = ({
  itGovTaskStatuses: { grbMeetingStatus },
  state,
  grbDate
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'grbMeeting';
  const { t } = useTranslation('itGov');

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={grbMeetingStatus}
      state={state}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Scheduled or attended meeting date info */}
        {(grbMeetingStatus === ITGovGRBStatus.SCHEDULED ||
          grbMeetingStatus === ITGovGRBStatus.COMPLETED) &&
          grbDate && (
            <Alert slim type="info">
              {t(
                `taskList.step.${stepKey}.${
                  grbMeetingStatus === ITGovGRBStatus.SCHEDULED
                    ? 'scheduledInfo'
                    : 'attendedInfo'
                }`,
                { date: formatDateUtc(grbDate, 'MMMM d, yyyy') }
              )}
            </Alert>
          )}

        {/* Button to prepare for the grb meeting */}
        {(grbMeetingStatus === ITGovGRBStatus.READY_TO_SCHEDULE ||
          grbMeetingStatus === ITGovGRBStatus.SCHEDULED) && (
          <div className="margin-top-2">
            <UswdsReactLink
              variant="unstyled"
              className="usa-button"
              to="/help/it-governance/prepare-for-grb"
              target="_blank"
            >
              {t(`taskList.step.${stepKey}.button`)}
            </UswdsReactLink>
          </div>
        )}

        {/* Link to prepare for the grb meeting */}
        {(grbMeetingStatus === ITGovGRBStatus.CANT_START ||
          grbMeetingStatus === ITGovGRBStatus.NOT_NEEDED ||
          grbMeetingStatus === ITGovGRBStatus.AWAITING_DECISION ||
          grbMeetingStatus === ITGovGRBStatus.COMPLETED) && (
          <div className="margin-top-2">
            <UswdsReactLink
              to="/help/it-governance/prepare-for-grb"
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

export default GovTaskGrbMeeting;
