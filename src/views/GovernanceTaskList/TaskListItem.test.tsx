import React from 'react';
import { shallow } from 'enzyme';
import Button from 'components/shared/Button';

import TaskListItem from './TaskListItem';

describe('The TaskListItem', () => {
  it('renders without crashing', () => {
    shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="CANNOT_START"
        link="/"
      />
    );
  });

  it('displays cannot start tag', () => {
    const component = shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="CANNOT_START"
        link="/"
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
        link="/"
      />
    );

    expect(
      component.find('.governance-task-list__task-tag--completed').exists()
    ).toEqual(true);
  });

  it('displays start button', () => {
    const component = shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="START"
        link="/"
      />
    );

    // TODO: very brittle; insert data-testid when Button refactor is complete
    expect(component.find(Button).exists()).toEqual(true);
  });
});
