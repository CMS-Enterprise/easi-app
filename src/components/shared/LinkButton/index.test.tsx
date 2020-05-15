import React from 'react';
import { shallow } from 'enzyme';
import LinkButton from './index';

describe('The button component', () => {
  it('renders without crashing', () => {
    shallow(<LinkButton to="">Test</LinkButton>);
  });

  it('renders children', () => {
    const component = shallow(
      <LinkButton to="">
        <div data-test="testid" />
      </LinkButton>
    );
    expect(component.find("[data-test='testid']").exists()).toEqual(true);
  });

  it('renders class names', () => {
    const component = shallow(
      <LinkButton to="" outline>
        Test
      </LinkButton>
    );
    expect(component.find('.usa-button--outline').exists()).toEqual(true);
  });
});
