import React from 'react';

import TaskStatusTag, { TaskStatus } from 'components/TaskStatusTag';
import { formatDateLocal } from 'utils/date';

type AdminTaskStatusTagProps = {
  /**
   * Status key for tag component
   *
   * Corresponds to label in taskList translation file
   */
  status: TaskStatus;
  /** User name to display next to status tag */
  name: string;
  /** Date to display next to user name */
  date: string;
  className?: string;
};

/**
 * TRB admin task status tag
 *
 * Displays name and time next to email if status is READY_FOR_REVIEW or COMPLETED
 */
const AdminTaskStatusTag = ({
  status,
  name,
  date,
  className
}: AdminTaskStatusTagProps) => {
  return (
    <p className={className} data-testid="trb-admin-status-tag">
      <TaskStatusTag status={status} />
      {
        // Only show name and date if ready for review or completed
        (status === 'READY_FOR_REVIEW' || status === 'COMPLETED') && (
          <span data-testid="status-author-text">
            {` by ${name} on ${formatDateLocal(date, 'MMMM d, yyyy')}`}
          </span>
        )
      }
    </p>
  );
};

export default AdminTaskStatusTag;
