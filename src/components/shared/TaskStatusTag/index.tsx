import React from 'react';
import { useTranslation } from 'react-i18next';

import { TagEnum } from 'data/taskList';
import { TRBFormStatus } from 'types/graphql-global-types';

import Tag from '../Tag';

/**
 * `TaskStatus` is a combination of enums from backend types
 * with the previous `TagEnum` that was defined for the GovernanceTaskList.
 */
export type TaskStatus = TRBFormStatus | TagEnum;

export const taskStatusClassName: Record<TaskStatus, string> = {
  COMPLETED: 'bg-success-dark text-white',
  IN_PROGRESS: 'bg-warning',
  CANNOT_START: 'border-2px text-base',
  NOT_NEEDED: 'border-2px text-base',
  // Error: 'bg-error-dark text-white'
  READY_TO_START: 'bg-info'
  // No action needed: 'bg-base-lighter text-base-darker'
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
