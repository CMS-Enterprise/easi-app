import React from 'react';
import { render } from '@testing-library/react';
import { TRBFormStatus } from 'gql/generated/graphql';

import TaskListItem, { TaskListDescription } from '.';

describe('The TaskListItem', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <TaskListItem
        heading="Fill out the Intake Request form"
        status={TRBFormStatus.READY_TO_START}
      >
        <TaskListDescription>
          <p>Hello</p>
        </TaskListDescription>
      </TaskListItem>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
