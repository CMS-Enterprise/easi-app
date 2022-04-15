import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import HelpHome from './index';

describe('HelpHome', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HelpHome />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
