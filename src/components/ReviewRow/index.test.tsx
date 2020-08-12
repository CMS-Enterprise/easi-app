import React from 'react';
import { shallow } from 'enzyme';

import ReviewRow from './index';

describe('The Review Row component', () => {
  it('renders without crashing', () => {
    shallow(<ReviewRow />);
  });

  it('accepts a class name', () => {
    const component = shallow(<ReviewRow className="test-class-name" />);
    expect(component.find('.test-class-name').exists()).toBe(true);
  });

  it('renders children', () => {
    const component = shallow(
      <ReviewRow>
        <div id="testid" />
      </ReviewRow>
    );

    expect(component.find('#testid').exists()).toBe(true);
  });
});
