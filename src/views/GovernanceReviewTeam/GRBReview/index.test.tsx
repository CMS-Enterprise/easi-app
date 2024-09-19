import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { businessCase } from 'data/mock/businessCase';
import { systemIntake } from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ITGovAdminContext from '../ITGovAdminContext';

import GRBReview from '.';

describe('GRB review tab', () => {
  it('renders GRB reviewer view', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ITGovAdminContext.Provider value={false}>
              <GRBReview
                {...systemIntake}
                businessCase={businessCase}
                grbReviewers={[]}
              />
            </ITGovAdminContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    // Hide start review button
    expect(
      screen.queryByRole('button', { name: 'Start GRB review' })
    ).toBeNull();
  });

  it('renders GRT admin view', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ITGovAdminContext.Provider value>
              <GRBReview
                {...systemIntake}
                businessCase={businessCase}
                grbReviewers={[]}
              />
            </ITGovAdminContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'GRB review' }));

    // Start review button
    expect(
      screen.getByRole('button', { name: 'Start GRB review' })
    ).toBeInTheDocument();
  });

  it('renders GRB review start date', () => {
    const date = '2024-09-10T14:42:47.422022Z';
    render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <ITGovAdminContext.Provider value>
              <GRBReview
                {...systemIntake}
                businessCase={businessCase}
                grbReviewers={[]}
                grbReviewStartedAt={date}
              />
            </ITGovAdminContext.Provider>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByText('Review started on 09/10/2024')
    ).toBeInTheDocument();
  });
});
