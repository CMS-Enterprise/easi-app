import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import AllHelp from './index';

describe('All help articles', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AllHelp />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
