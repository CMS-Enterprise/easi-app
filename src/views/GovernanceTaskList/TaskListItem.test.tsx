import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';

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

    expect(
      component
        .find(UswdsLink)
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

    expect(
      component
        .find(UswdsLink)
        .dive()
        .text()
    ).toEqual('Continue');
  });

  describe('submitted request link', () => {
    const component = shallow(
      <TaskListItem
        heading="Test Heading"
        description="Test Description"
        status="COMPLETED"
        link="/system-intake/FOO"
      />
    );

    it('displays the right text', () => {
      expect(component.find(Link).text()).toEqual(
        'View Submitted Request Form'
      );
    });

    it('displays the right link', () => {
      expect(component.find(Link).prop('to')).toEqual('/system-intake/FOO');
    });
  });
});
