import React from 'react';
import { shallow } from 'enzyme';
import SystemProfiles from './index';

describe('The System Profiles list page', () => {
  it('renders without crashing', () => {
    shallow(<SystemProfiles />);
  });
});
