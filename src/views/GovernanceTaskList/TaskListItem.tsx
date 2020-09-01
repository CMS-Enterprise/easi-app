import React from 'react';
import classnames from 'classnames';

type TaskListItemProps = {
  heading: string;
  description: string;
  status: string;
  children?: React.ReactNode | React.ReactNodeArray;
};

const TaskListItem = ({
  heading,
  description,
  status,
  children
}: TaskListItemProps) => {
  const taskListItemClasses = classnames(
    'governance-task-list__item',
    'padding-bottom-4',
    {
      'governance-task-list__item--na': status === 'CANNOT_START'
    }
  );
  return (
    <li className={taskListItemClasses}>
      <div className="governance-task-list__task-content">
        <div className="governance-task-list__task-heading-row">
          <h3 className="governance-task-list__task-heading margin-top-0">
            {heading}
          </h3>
          {status === 'CANNOT_START' && (
            <span className="governance-task-list__task-tag governance-task-list__task-tag--na">
              Cannot start yet
            </span>
          )}
          {status === 'COMPLETED' && (
            <span className="governance-task-list__task-tag governance-task-list__task-tag--completed">
              Completed
            </span>
          )}
          {status === 'NOT_NEEDED' && (
            <span className="governance-task-list__task-tag governance-task-list__task-tag--na">
              Not needed
            </span>
          )}
        </div>
        <p className="governance-task-list__task-description line-height-body-4 margin-bottom-4">
          {description}
        </p>
        {children}
      </div>
    </li>
  );
};

export default TaskListItem;
