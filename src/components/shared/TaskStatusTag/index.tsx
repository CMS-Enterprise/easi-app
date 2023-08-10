import React from 'react';
import { useTranslation } from 'react-i18next';

import { TagEnum } from 'data/taskList';
import {
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus,
  TRBAdviceLetterStatus,
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus
} from 'types/graphql-global-types';

import Tag from '../Tag';

/**
 * `TaskStatus` is a combination of enums from different spaces such as TRB, IT Gov...
 */
export type TaskStatus =
  // TRB
  | keyof typeof TRBFormStatus
  | keyof typeof TRBAdviceLetterStatus
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
  | keyof typeof ITGovGRBStatus
  // IT Gov v1
  | TagEnum;

export const taskStatusClassName: Record<TaskStatus, string> = {
  /* TODO: EASI-3110 verify this new status */
  AWAITING_DECISION: 'bg-info-light',
  CANNOT_START_YET: 'border-2px text-base',
  CANT_START: 'border-2px text-base',
  COMPLETED: 'bg-success-dark text-white',
  DONE: 'bg-success-dark text-white',
  EDITS_REQUESTED: 'bg-warning',
  IN_PROGRESS: 'bg-warning',
  IN_REVIEW: 'bg-info-light',
  NOT_NEEDED: 'border-2px text-base',
  READY: 'bg-info-light',
  READY_FOR_REVIEW: 'bg-info-light',
  READY_TO_SCHEDULE: 'bg-info-light',
  READY_TO_START: 'bg-info-light',
  SCHEDULED: 'bg-info-light',
  SUBMITTED: 'bg-success-dark text-white'
};

type TaskStatusTagProps = {
  status: TaskStatus;
};

const TaskStatusTag = ({ status }: TaskStatusTagProps) => {
  const { t } = useTranslation('taskList');

  return (
    <Tag
      className={`easi-task-status-tag ${taskStatusClassName[status]}`}
      data-testid="task-list-task-tag"
    >
      {t(`taskStatus.${status}`)}
    </Tag>
  );
};

export default TaskStatusTag;
