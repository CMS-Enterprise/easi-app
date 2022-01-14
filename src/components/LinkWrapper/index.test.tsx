import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import UswdsReactLink from 'components/LinkWrapper';

describe('UswdsReactLink', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <UswdsReactLink data-testid="test-link" to="/">
          Link
        </UswdsReactLink>
      </MemoryRouter>
    );

    expect(getByTestId('test-link')).toBeInTheDocument();
  });
});
