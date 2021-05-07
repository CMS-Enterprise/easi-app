import React from 'react';
import { shallow } from 'enzyme';

import { Step, StepBody, StepHeading, StepList } from './index';

describe('Step list component', () => {
  describe('StepList', () => {
    it('renders without errors', () => {
      shallow(
        <StepList>
          <li />
        </StepList>
      );
    });

    it('renders custom class name', () => {
      const component = shallow(
        <StepList className="custom-class">
          <li />
        </StepList>
      );
      expect(component.find('.custom-class').exists()).toEqual(true);
    });

    it('renders custom HTML attribute', () => {
      const component = shallow(
        <StepList start={5}>
          <li />
        </StepList>
      );

      expect(component.find('ol').props().start).toEqual(5);
    });
  });

  describe('StepHeading', () => {
    it('renders without errors', () => {
      shallow(<StepHeading>Test H3</StepHeading>);
    });

    it('renders custom heading level', () => {
      const component = shallow(
        <StepHeading headingLevel="h6">Test H3</StepHeading>
      );
      expect(component.find('h6').exists()).toEqual(true);
    });

    it('renders custom class name', () => {
      const component = shallow(
        <StepHeading className="custom-class">Test H3</StepHeading>
      );
      expect(component.find('h3.custom-class').exists()).toEqual(true);
    });

    it('renders custom HTML attribute', () => {
      const component = shallow(
        <StepHeading aria-label="this is a test h3">Test H3</StepHeading>
      );
      expect(component.find('h3').props()['aria-label']).toEqual(
        'this is a test h3'
      );
    });
  });

  describe('StepBody', () => {
    it('renders without errors', () => {
      shallow(
        <StepBody>
          <p>Test</p>
        </StepBody>
      );
    });

    it('renders children', () => {
      const component = shallow(
        <StepBody className="custom-class">
          <dl />
        </StepBody>
      );

      expect(component.find('dl').exists()).toEqual(true);
    });

    it('renders custom class names', () => {
      const component = shallow(
        <StepBody className="custom-class">
          <p>Test</p>
        </StepBody>
      );

      expect(component.find('.custom-class').exists()).toEqual(true);
    });

    it('renders custom HTML attribute', () => {
      const component = shallow(
        <StepBody aria-label="test aria label">
          <p>Test</p>
        </StepBody>
      );

      expect(component.find('div').props()['aria-label']).toEqual(
        'test aria label'
      );
    });
  });

  describe('Step', () => {
    it('renders without errors', () => {
      shallow(
        <Step>
          <StepHeading>Test</StepHeading>
          <StepBody>This is a test</StepBody>
        </Step>
      );
    });

    it('renders children', () => {
      const component = shallow(
        <Step>
          <StepHeading data-testid="test-heading">Test</StepHeading>
          <StepBody data-testid="test-body">This is a test</StepBody>
        </Step>
      );

      expect(component.find('[data-testid="test-heading"]').exists()).toEqual(
        true
      );

      expect(component.find('[data-testid="test-body"]').exists()).toEqual(
        true
      );
    });

    it('renders custom class', () => {
      const component = shallow(
        <Step className="custom-class">
          <div />
        </Step>
      );

      expect(component.find('.custom-class').exists()).toEqual(true);
    });

    it('renders custom HTML attribute', () => {
      const component = shallow(
        <Step data-testid="step" aria-label="test aria label">
          <div />
        </Step>
      );

      expect(
        component.find('[data-testid="step"]').props()['aria-label']
      ).toEqual('test aria label');
    });
  });
});
