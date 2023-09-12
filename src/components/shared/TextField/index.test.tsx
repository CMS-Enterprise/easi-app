import React from 'react';
import { mount, shallow } from 'enzyme';

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

  it('triggers onChange', () => {
    const event = {
      target: {
        value: 'Hello'
      }
    };
    const mock = vi.fn();
    const component = mount(<TextField {...requiredProps} onChange={mock} />);

    component.simulate('change', event);
    expect(mock).toHaveBeenCalled();
  });
});
