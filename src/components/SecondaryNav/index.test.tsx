import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { NavLink, SecondaryNav } from './index';

describe('The Secondary Nav component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <SecondaryNav>
          <NavLink to="/">Test</NavLink>
        </SecondaryNav>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
