import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import PrepareForGRB from '.';

describe('Prepare for GRT', () => {
  it('renders without crashing', () => {
    const { asFragment } = render(<PrepareForGRB />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders help mode without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <PrepareForGRB helpArticle />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
