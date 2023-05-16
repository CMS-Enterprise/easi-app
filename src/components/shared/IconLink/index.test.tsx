import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { IconArrowBack } from '@trussworks/react-uswds';

import IconLink from '.';

describe('Icon link', () => {
  it('renders the icon', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <IconLink icon={<IconArrowBack />} to="/">
          Link label
        </IconLink>
      </MemoryRouter>
    );

    // Check that link renders
    expect(getByRole('img')).toBeInTheDocument();
  });
});
