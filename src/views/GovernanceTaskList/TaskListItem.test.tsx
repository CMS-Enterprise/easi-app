import React from 'react';
import { shallow } from 'enzyme';

import TaskListItem from './TaskListItem';

describe('The TaskListItem', () => {
  it('renders without crashing', () => {
    shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="CANNOT_START"
      />
    );
  });

  it('displays cannot start tag', () => {
    const component = shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="CANNOT_START"
      />
    );

    expect(
      component.find('.governance-task-list__task-tag--na').exists()
    ).toEqual(true);
  });

  it('displays completed tag', () => {
    const component = shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="COMPLETED"
      />
    );

    expect(
      component.find('.governance-task-list__task-tag--completed').exists()
    ).toEqual(true);
  });

  it('displays children', () => {
    const component = shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="START"
      >
        <div id="test-div">Test</div>
      </TaskListItem>
    );

    expect(component.find('#test-div').text()).toEqual('Test');
  });
});
