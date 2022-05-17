import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import HelpFooter from '.';

describe('Help Footer', () => {
  it('renders', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HelpFooter />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
