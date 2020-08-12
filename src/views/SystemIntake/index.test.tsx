import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';

import { SystemIntake } from './index';

describe('The System Intake page', () => {
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter>
        <SystemIntake match={{}} />
      </MemoryRouter>
    );
  });
});
