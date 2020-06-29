import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
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
    expect(
      component
        .find(Button)
        .dive()
        .text()
    ).toEqual('Start');
  });

  it('displays continue button', () => {
    const component = shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="CONTINUE"
        link="/"
      />
    );

    // TODO: very brittle; insert data-testid when Button refactor is complete
    expect(component.find(Button).exists()).toEqual(true);
    expect(
      component
        .find(Button)
        .dive()
        .text()
    ).toEqual('Continue');
  });

  it('displays a submitted request link', () => {
    const component = shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="COMPLETED"
        link="/system-intake/FOO"
      />
    );

    // TODO: very brittle; insert data-testid when Button refactor is complete
    expect(component.find(Link).exists()).toEqual(true);
    expect(component.find(Link).text()).toEqual('View Submitted Request Form');
    expect(component.find(Link).prop('to')).toEqual('/system-intake/FOO');
  });
});
