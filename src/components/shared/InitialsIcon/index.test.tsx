import React from 'react';
import { shallow } from 'enzyme';

import InitialsIcon from './index';

describe('The Initials Icon component', () => {
  it('renders without crashing', () => {
    shallow(<InitialsIcon name="Jane Doe" />);
  });

  it('Renders the correct initials', () => {
    const component = shallow(<InitialsIcon name="Jane Marie Doe, Jr" />);
    expect(component.text()).toEqual('JD');
  });
});
