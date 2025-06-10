import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Icon } from '@trussworks/react-uswds';

import IconButton from '.';

describe('Icon button', () => {
  it('renders the icon', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <IconButton icon={<Icon.ArrowBack aria-label="back" />} type="button">
          Link label
        </IconButton>
      </MemoryRouter>
    );

    // Check that link renders
    expect(getByRole('img')).toBeInTheDocument();
  });
});
