import React from 'react';
import { shallow } from 'enzyme';
import { SystemProfile } from './index';

describe('The System Profile view', () => {
  it('renders without crashing', () => {
    shallow(<SystemProfile match={{ params: {} }} />);
  });
});
