import React from 'react';
import { render, screen } from '@testing-library/react';

import RequestDeleted from './RequestDeleted';

describe('RequestDeleted view', () => {
  it('renders without errors', () => {
    render(<RequestDeleted />);

    expect(
      screen.getByRole('heading', {
        name: 'The request you are looking for was deleted.'
      })
    ).toBeInTheDocument();
  });
});
