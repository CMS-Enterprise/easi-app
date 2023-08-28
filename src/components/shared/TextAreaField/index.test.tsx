import React from 'react';
import { mount, shallow } from 'enzyme';

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

  it('triggers onChange', () => {
    const event = {
      target: {
        value: 'Hello'
      }
    };
    const mock = vi.fn();
    const component = mount(
      <TextAreaField {...requiredProps} onChange={mock} />
    );

    component.simulate('change', event);
    expect(mock).toHaveBeenCalled();
  });
});
