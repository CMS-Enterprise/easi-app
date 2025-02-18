import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { emptySystemIntake } from 'tests/mock/systemIntake';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RequestDetails from '.';

describe('System intake form - Request details', () => {
  it('renders fields', () => {
    render(
      <VerboseMockedProvider>
        <RequestDetails systemIntake={emptySystemIntake} />
      </VerboseMockedProvider>
    );

    expect(
      screen.getByRole('heading', { name: 'Request details' })
    ).toBeInTheDocument();
  });

  it('renders error messages', async () => {
    render(
      <VerboseMockedProvider>
        <RequestDetails systemIntake={emptySystemIntake} />
      </VerboseMockedProvider>
    );

    // Submit empty form
    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(
      await screen.findByRole('heading', {
        name: 'Please check and fix the following'
      })
    ).toBeInTheDocument();

    const errorSummary = screen.getByTestId('request-details-errors');

    expect(
      within(errorSummary).getByText('Enter the Contract/Request Title')
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText('Tell us about your request')
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        'Tell us how you think of solving your business need'
      )
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText('Tell us where you are in the process')
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        'Tell us if you need Enterprise Architecture (EA) support'
      )
    ).toBeInTheDocument();

    expect(
      within(errorSummary).getByText(
        'Tell us if your request includes an interface component or changes'
      )
    ).toBeInTheDocument();
  });
});
