import React from 'react';
import { shallow } from 'enzyme';
import { SystemIntake } from './index';

describe('The System Intake page', () => {
  it('renders without crashing', () => {
    shallow(<SystemIntake match={{ params: {} }} />);
  });
});
