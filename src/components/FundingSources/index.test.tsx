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

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <Wrapper
        fundingSources={[
          { projectNumber: '123456', investments: ['Fed Admin'] },
          { projectNumber: '789012', investments: ['HITECH Medicare'] }
        ]}
      >
        <FundingSources />
      </Wrapper>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with no funding sources', () => {
    render(
      <Wrapper fundingSources={[]}>
        <FundingSources />
      </Wrapper>
    );

    expect(
      screen.getByRole('button', { name: 'Add a funding source' })
    ).toBeInTheDocument();

    // Table should not be rendered if there are no funding sources
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('opens and closes the form modal', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper fundingSources={[]}>
        <FundingSources />
      </Wrapper>
    );

    await user.click(
      screen.getByRole('button', { name: 'Add a funding source' })
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('adds a funding source', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper fundingSources={[]}>
        <FundingSources />
      </Wrapper>
    );

    await user.click(
      screen.getByRole('button', { name: 'Add a funding source' })
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Project number *' }),
      '123456'
    );
    await user.type(screen.getByRole('combobox'), 'Fed Admin {enter}');
    await user.click(
      screen.getByRole('button', { name: 'Add funding source' })
    );

    expect(
      await screen.findByRole('cell', { name: '123456' })
    ).toBeInTheDocument();
  });

  it('clears funding sources with checkbox', async () => {
    const user = userEvent.setup();
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

    expect(screen.getByRole('cell', { name: '123456' })).toBeInTheDocument();
    expect(clearFundingSourcesCheckbox).not.toBeChecked();

    // Open modal
    await user.click(clearFundingSourcesCheckbox);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    // Close modal without removing funding sources
    await user.click(screen.getByRole('button', { name: "Don't remove" }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '123456' })).toBeInTheDocument();
    expect(clearFundingSourcesCheckbox).not.toBeChecked();

    // Open modal
    await user.click(clearFundingSourcesCheckbox);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    // Remove funding sources
    await user.click(
      screen.getByRole('button', { name: 'Remove funding sources' })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(clearFundingSourcesCheckbox).toBeChecked();
    expect(
      screen.queryByRole('cell', { name: '123456' })
    ).not.toBeInTheDocument();

    // Add funding sources button is disabled
    expect(
      screen.getByRole('button', { name: 'Add a funding source' })
    ).toBeDisabled();
  });

  it('removes a funding source', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper
        fundingSources={[
          { projectNumber: '123456', investments: ['Fed Admin'] }
        ]}
      >
        <FundingSources />
      </Wrapper>
    );

    expect(screen.getByRole('cell', { name: '123456' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Remove funding source' })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('cell', { name: '123456' })
    ).not.toBeInTheDocument();
  });
});
