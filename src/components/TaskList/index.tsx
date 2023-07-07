import React from 'react';
import classnames from 'classnames';

import TaskStatusTag, {
  TaskStatus,
  taskStatusClassName
} from 'components/shared/TaskStatusTag';
import { ITGovIntakeFormStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';

import './index.scss';

export const TaskListContainer = ({
  className,
  ...props
}: JSX.IntrinsicElements['ol']) => (
  <ol
    data-testid="task-list"
    className={classnames('task-list__task-list', className)}
    {...props}
  />
);

type TaskListDescriptionProps = {
  children?: React.ReactNode;
};

export const TaskListDescription = ({ children }: TaskListDescriptionProps) => {
  return (
    <div className="task-list__task-description line-height-body-4">
      {children}
    </div>
  );
};

type TaskListItemProps = {
  heading: string;
  status: TaskStatus | undefined;
  children?: React.ReactNode;
  testId?: string;
  submittedAt?: string | null;
};

const TaskListItem = ({
  heading,
  status,
  children,
  testId,
  submittedAt
}: TaskListItemProps) => {
  const taskListItemClasses = classnames(
    'task-list__item',
    'padding-bottom-4',
    // Dim the task list item as N/A with certain statuses
    {
      'task-list__item--na': [
        'NOT_NEEDED',
        'CANNOT_START_YET',
        'CANT_START'
      ].includes(status || '')
    }
  );
  return (
    <li className={taskListItemClasses} data-testid={testId}>
      <div className="task-list__task-content">
        <div className="task-list__task-heading-row">
          <h3 className="task-list__task-heading line-height-heading-2 margin-top-0 margin-bottom-1">
            {heading}
          </h3>
          <div>
            {!!status && status in taskStatusClassName && (
              <TaskStatusTag status={status} />
            )}
            {status === ITGovIntakeFormStatus.COMPLETED && submittedAt && (
              <p className="margin-top-05 margin-bottom-0">
                Submitted
                <br />
                {formatDateLocal(submittedAt, 'MM/dd/yyyy')}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
    </li>
  );
};

export default TaskListItem;
