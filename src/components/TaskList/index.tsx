import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import TaskStatusTag, {
  TaskStatus,
  taskStatusClassName
} from 'components/TaskStatusTag';
import { TaskListItemDateInfo } from 'types/taskList';
import { formatDateLocal, formatDateUtc } from 'utils/date';

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
  state?: 'OPEN' | 'CLOSED';
  statusPercentComplete?: number | false | null | undefined;
  statusDateInfo?: TaskListItemDateInfo;
  children?: React.ReactNode;
  testId?: string;
  id?: string;
};

const TaskListItem = ({
  heading,
  status,
  state = 'OPEN',
  statusPercentComplete,
  statusDateInfo,
  children,
  testId,
  id
}: TaskListItemProps) => {
  const { t } = useTranslation('taskList');

  const taskListItemClasses = classnames(
    'task-list__item',
    'padding-bottom-4',
    // Dim the task list item as N/A with certain statuses
    {
      'task-list__item--na': [
        'NOT_NEEDED',
        'CANNOT_START_YET',
        'CANT_START'
      ].includes((status as string) || '')
    }
  );

  return (
    <li className={taskListItemClasses} data-testid={testId} id={id}>
      <div className="task-list__task-content">
        <div className="task-list__task-heading-row">
          <h3 className="task-list__task-heading line-height-heading-2 margin-top-0 margin-bottom-1">
            {heading}
          </h3>
          <div className="task-list__task-heading-row__status">
            {!!status && status in taskStatusClassName && (
              <TaskStatusTag status={status} state={state} />
            )}

            {/* Task status info */}
            {(Number.isInteger(statusPercentComplete) || statusDateInfo) && (
              <p className="margin-top-05 margin-bottom-0 text-base">
                {/* Percent complete */}
                {Number.isInteger(statusPercentComplete) &&
                  t('taskStatusInfo.percentComplete', {
                    percent: statusPercentComplete
                  })}

                {/* Status dates */}
                {statusDateInfo && (
                  <>
                    {t(`taskStatusInfo.${statusDateInfo.label}`)}
                    <br />{' '}
                    {(statusDateInfo.isUtc ? formatDateUtc : formatDateLocal)(
                      statusDateInfo.value,
                      'MM/dd/yyyy'
                    )}
                  </>
                )}
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
