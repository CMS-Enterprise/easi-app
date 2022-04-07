import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import ITGovernance from './index';

describe('ITGovernance', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ITGovernance />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
