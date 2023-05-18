import React from 'react';
import { useTranslation } from 'react-i18next';

import { TagEnum } from 'data/taskList';
import {
  TRBAdviceLetterStatus,
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus
} from 'types/graphql-global-types';

import Tag from '../Tag';

/**
 * `TaskStatus` is a combination of enums from backend types
 * with the previous `TagEnum` that was defined for the GovernanceTaskList.
 */
export type TaskStatus =
  | keyof typeof TRBFormStatus
  | keyof typeof TRBAdviceLetterStatus
  | keyof typeof TRBFeedbackStatus
  | keyof typeof TRBConsultPrepStatus
  | keyof typeof TRBAttendConsultStatus
  | TagEnum;

export const taskStatusClassName: Record<TaskStatus, string> = {
  COMPLETED: 'bg-success-dark text-white',
  IN_PROGRESS: 'bg-warning',
  CANNOT_START_YET: 'border-2px text-base',
  NOT_NEEDED: 'border-2px text-base',
  EDITS_REQUESTED: 'bg-warning',
  IN_REVIEW: 'bg-info-light',
  READY_TO_SCHEDULE: 'bg-info-light',
  SCHEDULED: 'bg-info-light',
  // Error: 'bg-error-dark text-white'
  READY_TO_START: 'bg-info-light',
  // No action needed: 'bg-base-lighter text-base-darker',
  READY_FOR_REVIEW: 'bg-info-light-light'
};

type TaskStatusTagProps = {
  status: TaskStatus;
};

const TaskStatusTag = ({ status }: TaskStatusTagProps) => {
  const { t } = useTranslation('taskList');

  return (
    <Tag
      className={taskStatusClassName[status]}
      data-testid="task-list-task-tag"
    >
      {t(`taskStatus.${status}`)}
    </Tag>
  );
};

export default TaskStatusTag;
