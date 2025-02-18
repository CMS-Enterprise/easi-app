import React from 'react';
import { ComponentMeta } from '@storybook/react';

import TaskStatusTag, { TaskStatus, taskStatusClassName } from '.';

export default {
  title: 'Task Status Tag',
  component: TaskStatusTag
} as ComponentMeta<typeof TaskStatusTag>;

export const Default = () => (
  <div>
    {Object.keys(taskStatusClassName).map(status => {
      return (
        <div className="margin-y-2">
          <TaskStatusTag status={status as TaskStatus} />
        </div>
      );
    })}
  </div>
);
