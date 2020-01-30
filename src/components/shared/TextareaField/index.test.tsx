/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow } from 'enzyme';
import TextareaField from './index';

describe('The Text Area Field component', () => {
  const requiredProps = {
    id: 'DemoTest',
    name: 'Demo Textarea',
    onChange: () => {},
    onBlur: () => {},
    value: ''
  };

  it('renders without crashing', () => {
    shallow(<TextareaField {...requiredProps} />);
  });

  it('renders a label when provided', () => {
    const fixture = 'Demo Label';
    const component = shallow(
      <TextareaField {...requiredProps} label={fixture} />
    );

    expect(component.find('label').text()).toEqual(fixture);
  });
});
