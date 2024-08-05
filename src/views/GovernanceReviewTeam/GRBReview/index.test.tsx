import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { systemIntake } from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import IsGrbViewContext from '../IsGrbViewContext';

import GRBReview from '.';

describe('GRB review tab', () => {
  it('renders GRB reviewer view', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <IsGrbViewContext.Provider value>
              <GRBReview {...systemIntake} grbReviewers={[]} />
            </IsGrbViewContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    expect(screen.getByRole('heading', { name: 'Available documentation' }));
  });

  it('renders GRT admin view', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <IsGrbViewContext.Provider value={false}>
              <GRBReview {...systemIntake} grbReviewers={[]} />
            </IsGrbViewContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    expect(screen.getByRole('button', { name: 'Add a GRB reviewer' }));
  });
});
