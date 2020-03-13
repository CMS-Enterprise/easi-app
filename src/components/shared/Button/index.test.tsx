import React from 'react';
import { shallow } from 'enzyme';
import Button from './index';

describe('The button component', () => {
  it('renders without crashing', () => {
    shallow(
      <Button type="button" onClick={() => {}}>
        Test
      </Button>
    );
  });

  it('renders children', () => {
    const component = shallow(
      <Button type="button" onClick={() => {}}>
        <div data-test="testid" />
      </Button>
    );
    expect(component.find("[data-test='testid']").exists()).toEqual(true);
  });

  it('renders class names', () => {
    const component = shallow(
      <Button type="button" onClick={() => {}} outline>
        Test
      </Button>
    );
    expect(component.find('.usa-button--outline').exists()).toEqual(true);
  });
});
