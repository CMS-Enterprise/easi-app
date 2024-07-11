import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { systemIntake } from 'data/mock/systemIntake';

import IsGrbViewContext from '../IsGrbViewContext';

import GRBReview from '.';

describe('GRB review tab', () => {
  it('renders GRB reviewer view', async () => {
    render(
      <MemoryRouter>
        <IsGrbViewContext.Provider value>
          <GRBReview id={systemIntake.id} />
        </IsGrbViewContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    expect(screen.getByRole('heading', { name: 'Available documentation' }));
  });

  it('renders GRT admin view', async () => {
    render(
      <MemoryRouter>
        <IsGrbViewContext.Provider value={false}>
          <GRBReview id={systemIntake.id} />
        </IsGrbViewContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    expect(screen.getByRole('link', { name: 'Add a GRB reviewer' }));
  });
});
