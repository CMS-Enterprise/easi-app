import React from 'react';
import { shallow } from 'enzyme';

import HelpText from './index';

describe('The Help Text componnet', () => {
  it('renders without crashing', () => {
    shallow(<HelpText>Hello!</HelpText>);
  });

  it('renders a text child', () => {
    const component = shallow(<HelpText>Test</HelpText>);
    expect(component.text()).toEqual('Test');
  });

  it('renders a markup', () => {
    const component = shallow(
      <HelpText>
        <div className="test-1-2-1-2" />
      </HelpText>
    );
    expect(component.find('.test-1-2-1-2').exists()).toBe(true);
  });
});
