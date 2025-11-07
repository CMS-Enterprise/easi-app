import React from 'react';
import { render, screen } from '@testing-library/react';

import ExternalDataTag from '.';

describe('ExternalDataTag', () => {
  it('renders with external data', () => {
    render(<ExternalDataTag hasExternalData />);

    expect(screen.getByText('External data exists')).toBeInTheDocument();
  });

  it('renders without external data', () => {
    render(<ExternalDataTag hasExternalData={false} />);

    expect(screen.getByText('No external data')).toBeInTheDocument();
  });
});
