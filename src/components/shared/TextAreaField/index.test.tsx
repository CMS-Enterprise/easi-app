/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow } from 'enzyme';
import TextAreaField from './index';

describe('The Text Area Field component', () => {
  const requiredProps = {
    id: 'DemoTest',
    name: 'Demo TextArea',
    onChange: () => {},
    onBlur: () => {},
    value: ''
  };

  it('renders without crashing', () => {
    shallow(<TextAreaField {...requiredProps} />);
  });

  it('renders a label when provided', () => {
    const fixture = 'Demo Label';
    const component = shallow(
      <TextAreaField {...requiredProps} label={fixture} />
    );

    expect(component.find('label').text()).toEqual(fixture);
  });
});
