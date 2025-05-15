import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus,
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBGuidanceLetterStatus
} from 'gql/generated/graphql';

import Tag from '../Tag';

/**
 * `TaskStatus` is a combination of enums from different spaces such as TRB, IT Gov...
 */
export type TaskStatus =
  // TRB
  | keyof typeof TRBFormStatus
  | keyof typeof TRBGuidanceLetterStatus
  | keyof typeof TRBFeedbackStatus
  | keyof typeof TRBConsultPrepStatus
  | keyof typeof TRBAttendConsultStatus
  // IT Gov v2
  | keyof typeof ITGovIntakeFormStatus
  | keyof typeof ITGovFeedbackStatus
  | keyof typeof ITGovDecisionStatus
  | keyof typeof ITGovDraftBusinessCaseStatus
  | keyof typeof ITGovGRTStatus
  | keyof typeof ITGovFinalBusinessCaseStatus
  | keyof typeof ITGovGRBStatus;

/** Statuses that reflect a step is in progress */
const activeStatuses = {
  AWAITING_DECISION: 'bg-info-light',
  EDITS_REQUESTED: 'bg-warning',
  IN_PROGRESS: 'bg-warning',
  IN_REVIEW: 'bg-info-light',
  READY: 'bg-info-light',
  READY_FOR_REVIEW: 'bg-info-light',
  READY_TO_SCHEDULE: 'bg-info-light',
  READY_TO_START: 'bg-info-light',
  SCHEDULED: 'bg-info-light',
  SUBMITTED: 'bg-info-light'
};

/** Statuses that reflect that a step has no available actions */
const inactiveStatuses = {
  NOT_NEEDED: 'border-2px text-base',
  CANNOT_START_YET: 'border-2px text-base',
  CANT_START: 'border-2px text-base',
  COMPLETED: 'bg-success-dark text-white',
  DONE: 'bg-success-dark text-white'
};

/** Default task status classNames */
export const taskStatusClassName: Record<TaskStatus, string> = {
  ...activeStatuses,
  ...inactiveStatuses
};

type TaskStatusTagProps = {
  status: TaskStatus;
  state?: 'OPEN' | 'CLOSED';
};

const TaskStatusTag = ({ status, state = 'OPEN' }: TaskStatusTagProps) => {
  const { t } = useTranslation('taskList');

  /** className if `state` === CLOSED */
  const closedStateClassName = Object.keys(inactiveStatuses).includes(status)
    ? taskStatusClassName[status]
    : 'bg-base-light';

  /** Returns className based on `state` */
  const className =
    state === 'OPEN' ? taskStatusClassName[status] : closedStateClassName;

  return (
    <Tag
      style={{ whiteSpace: 'nowrap' }}
      className={`easi-task-status-tag ${className}`}
      data-testid="task-list-task-tag"
    >
      {t(`taskStatus.${status}`)}
    </Tag>
  );
};

export default TaskStatusTag;
