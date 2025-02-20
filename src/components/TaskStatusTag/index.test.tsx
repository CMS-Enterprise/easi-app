import React from 'react';
import { render } from '@testing-library/react';

import TaskStatusTag, { TaskStatus, taskStatusClassName } from '.';

describe('TaskStatusTag', () => {
  test.each(
    Object.entries(taskStatusClassName).map(([status, className]) => ({
      status,
      className
    }))
  )('renders task status tag %j', ({ status, className }) => {
    const { asFragment } = render(
      <TaskStatusTag status={status as TaskStatus} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
