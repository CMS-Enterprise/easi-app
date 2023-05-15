import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { IconArrowBack } from '@trussworks/react-uswds';

import IconButton from '.';

describe('Icon button', () => {
  it('renders the icon', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <IconButton icon={<IconArrowBack />} type="button">
          Link label
        </IconButton>
      </MemoryRouter>
    );

    // Check that link renders
    expect(getByRole('img')).toBeInTheDocument();
  });
});
