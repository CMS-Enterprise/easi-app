import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import PrepareForGRT from '.';

describe('Prepare for GRT', () => {
  it('renders without crashing', () => {
    const { asFragment } = render(<PrepareForGRT />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders help mode without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <PrepareForGRT helpMode />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
