import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Icon } from '@trussworks/react-uswds';

import IconLink from '.';

describe('Icon link', () => {
  it('renders the icon', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <IconLink icon={<Icon.ArrowBack />} to="/">
          Link label
        </IconLink>
      </MemoryRouter>
    );

    // Check that link renders
    expect(getByRole('img')).toBeInTheDocument();
  });
});
