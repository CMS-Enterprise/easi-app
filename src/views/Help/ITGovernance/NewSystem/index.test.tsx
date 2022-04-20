import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import NewSystem from './index';

describe('New System', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <NewSystem />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
