import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import { TRBFormStatus } from 'types/graphql-global-types';

import Tag from '../Tag';

// Add some enums from the previous original Governance Task List
// which don't yet exist in types
export type TaskStatus = TRBFormStatus | 'CANNOT_START' | 'NOT_NEEDED';

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
      className={classnames(taskStatusClassName[status])}
      data-testid="task-list-task-tag"
    >
      {t(`taskStatus.${status}`)}
    </Tag>
  );
};

export default TaskStatusTag;
