/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow } from 'enzyme';
import TextField from './index';

describe('The Text Field component', () => {
  const requiredProps = {
    id: 'DemoTest',
    name: 'Demo Input',
    onChange: () => {},
    onBlur: () => {},
    value: ''
  };

  it('renders without crashing', () => {
    shallow(<TextField {...requiredProps} />);
  });

  it('renders a label when provided', () => {
    const fixture = 'Demo Label';
    const component = shallow(<TextField {...requiredProps} label={fixture} />);

    expect(component.find('label').text()).toEqual(fixture);
  });
});
