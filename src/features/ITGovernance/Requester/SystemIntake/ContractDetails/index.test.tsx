import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { emptySystemIntake } from 'tests/mock/systemIntake';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ContractDetails from '.';

describe('System intake form - Contract details', () => {
  it('renders fields', () => {
    render(
      <VerboseMockedProvider>
        <ContractDetails systemIntake={emptySystemIntake} />
      </VerboseMockedProvider>
    );

    expect(
      screen.getByRole('heading', { name: 'Contract details' })
    ).toBeInTheDocument();
  });

  it('renders error messages', async () => {
    const user = userEvent.setup();
    render(
      <VerboseMockedProvider>
        <ContractDetails systemIntake={emptySystemIntake} />
      </VerboseMockedProvider>
    );

    // Submit empty form
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(
      await screen.findByRole('heading', {
        name: 'Please check and fix the following'
      })
    ).toBeInTheDocument();

    const errorSummary = screen.getByTestId('contract-details-errors');

    expect(
      within(errorSummary).getByText(
        'Add at least one funding source to the request'
      )
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        'Please enter a valid number for the current annual spending'
      )
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        'Please enter a valid number for the planned annual spending'
      )
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        'Tell us whether you have a contract to support this effort'
      )
    ).toBeInTheDocument();
  });
});
