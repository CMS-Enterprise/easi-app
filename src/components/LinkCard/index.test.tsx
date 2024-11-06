import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import LinkCard from './index';

describe('LinkCard', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <LinkCard type="trb" />
      </MemoryRouter>
    );
  });
  it('renders heading with link', () => {
    render(
      <MemoryRouter>
        <LinkCard type="trb" />
      </MemoryRouter>
    );
    screen.getByRole('heading', { level: 3, name: 'Technical assistance' });
    expect(screen.getByRole('link')).toHaveAttribute('href', '/trb');
  });
});
