import React from 'react';
import classnames from 'classnames';

import TaskStatusTag, {
  TaskStatus,
  taskStatusClassName
} from 'components/shared/TaskStatusTag';

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
  status: TaskStatus | '';
  children?: React.ReactNode;
  testId?: string;
};

const TaskListItem = ({
  heading,
  status,
  children,
  testId
}: TaskListItemProps) => {
  const taskListItemClasses = classnames(
    'task-list__item',
    'padding-bottom-4',
    {
      'task-list__item--na': ['NOT_NEEDED', 'CANNOT_START'].includes(status)
    }
  );
  return (
    <li className={taskListItemClasses} data-testid={testId}>
      <div className="task-list__task-content">
        <div className="task-list__task-heading-row">
          <h3 className="task-list__task-heading line-height-heading-2 margin-top-0 margin-bottom-1">
            {heading}
          </h3>
          {status !== '' && status in taskStatusClassName && (
            <TaskStatusTag status={status} />
          )}
        </div>
        {children}
      </div>
    </li>
  );
};

export default TaskListItem;
