import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { FormattedFundingSource } from 'types/systemIntake';

import FundingSources from '.';

type FormType = { fundingSources: FormattedFundingSource[] };

describe('Funding sources', () => {
  /** Returns form provider for unit tests */
  const Wrapper = ({
    children,
    fundingSources = []
  }: FormType & {
    children: React.ReactNode;
  }) => {
    const form = useEasiForm<FormType>({
      defaultValues: {
        fundingSources
      }
    });

    return <EasiFormProvider<FormType> {...form}>{children}</EasiFormProvider>;
  };

  it('renders with no funding sources', () => {
    render(
      <Wrapper fundingSources={[]}>
        <FundingSources />
      </Wrapper>
    );

    expect(
      screen.getByRole('button', { name: 'Add a funding source' })
    ).toBeInTheDocument();
  });

  it('opens and closes the modal', async () => {
    render(
      <Wrapper fundingSources={[]}>
        <FundingSources />
      </Wrapper>
    );

    userEvent.click(
      screen.getByRole('button', { name: 'Add a funding source' })
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('adds a funding source', async () => {
    render(
      <Wrapper fundingSources={[]}>
        <FundingSources />
      </Wrapper>
    );

    userEvent.click(
      screen.getByRole('button', { name: 'Add a funding source' })
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    userEvent.type(
      screen.getByRole('textbox', { name: 'Project number *' }),
      '123456'
    );
    userEvent.type(screen.getByRole('combobox'), 'Fed Admin {enter}');
    userEvent.click(screen.getByRole('button', { name: 'Add funding source' }));

    expect(
      await screen.findByText('Project number: 123456')
    ).toBeInTheDocument();
  });

  it('clears funding sources with checkbox', async () => {
    render(
      <Wrapper
        fundingSources={[
          { projectNumber: '123456', investments: ['Fed Admin'] }
        ]}
      >
        <FundingSources />
      </Wrapper>
    );

    const clearFundingSourcesCheckbox = screen.getByTestId(
      'clearFundingSourcesCheckbox'
    );

    expect(screen.getByText('Project number: 123456')).toBeInTheDocument();
    expect(clearFundingSourcesCheckbox).not.toBeChecked();

    // Open modal
    userEvent.click(clearFundingSourcesCheckbox);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    // Close modal without removing funding sources
    userEvent.click(screen.getByRole('button', { name: "Don't remove" }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Project number: 123456')).toBeInTheDocument();
    expect(clearFundingSourcesCheckbox).not.toBeChecked();

    // Open modal
    userEvent.click(clearFundingSourcesCheckbox);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    // Remove funding sources
    userEvent.click(
      screen.getByRole('button', { name: 'Remove funding sources' })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(clearFundingSourcesCheckbox).toBeChecked();
    expect(
      screen.queryByText('Project number: 123456')
    ).not.toBeInTheDocument();

    // Add funding sources button is disabled
    expect(
      screen.getByRole('button', { name: 'Add a funding source' })
    ).toBeDisabled();
  });
});
