import React from 'react';
import Button from 'components/shared/Button';

type TaskListItemProps = {
  heading: string;
  description: string;
  status: string;
  link: string;
};

const TaskListItem = ({
  heading,
  description,
  status,
  link
}: TaskListItemProps) => (
  <li className="governance-task-list__item padding-bottom-4">
    <div className="governance-task-list__task-content">
      <h3 className="governance-task-list__task-heading margin-top-0">
        {heading}
      </h3>
      <p className="governance-task-list__task-description line-height-body-4 margin-bottom-4">
        {description}
      </p>

      {true && <Button to={link}>Start</Button>}
    </div>
    <div>
      {status === 'CANNOT_START' && (
        <span className="governance-task-list__task-tag--na">
          Cannot start yet
        </span>
      )}
      {status === 'COMPLETED' && <span>Completed</span>}
    </div>
  </li>
);

export default TaskListItem;
