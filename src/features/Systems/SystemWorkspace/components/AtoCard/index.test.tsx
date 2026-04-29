import React from 'react';
import { render, screen } from '@testing-library/react';

import AtoCard from '.';

describe('AtoCard', () => {
  it('renders unavailable messaging when ato data cannot be shown', () => {
    render(<AtoCard atoUnavailable />);

    expect(
      screen.getByText('ATO details are unavailable for your account.')
    ).toBeInTheDocument();
    expect(screen.queryByText('No ATO')).not.toBeInTheDocument();
  });
});
