import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Icon } from '@trussworks/react-uswds';

import IconButton from '.';

describe('Icon button', () => {
  it('renders the icon', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <IconButton icon={<Icon.ArrowBack />} type="button">
          Link label
        </IconButton>
      </MemoryRouter>
    );

    // Check that link renders
    const button = getByRole('button', { name: /link label/i });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});
