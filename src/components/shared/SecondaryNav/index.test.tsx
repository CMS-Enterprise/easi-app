import React from 'react';
import { shallow } from 'enzyme';

import { NavLink, SecondaryNav } from './index';

describe('The Secondary Nav component', () => {
  it('renders without crashing', () => {
    shallow(
      <SecondaryNav>
        <NavLink to="/">Test</NavLink>
      </SecondaryNav>
    );
  });
});
