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

  it('renders error messages', async () => {
    render(
      <Wrapper
        fundingSources={[
          {
            projectNumber: '123456',
            investments: ['Fed Admin']
          }
        ]}
      >
        <FundingSources />
      </Wrapper>
    );

    userEvent.click(
      screen.getByRole('button', { name: 'Add another funding source' })
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    userEvent.click(
      screen.getByRole('button', {
        name: 'Add funding source'
      })
    );

    // Button is disabled with empty fields
    expect(
      screen.getByRole('button', { name: 'Add funding source' })
    ).toBeDisabled();

    // Add investment
    userEvent.type(screen.getByRole('combobox'), 'Fed Admin {enter}');
    expect(await screen.findByText('1 selected')).toBeInTheDocument();

    // Check funding number is numeric

    const projectNumberField = screen.getByRole('textbox', {
      name: 'Project number *'
    });

    userEvent.type(projectNumberField, 'aaaaaa');
    expect(projectNumberField).toHaveValue('aaaaaa');

    userEvent.click(screen.getByRole('button', { name: 'Add funding source' }));

    expect(
      await screen.findByText('Project number can only contain digits')
    ).toBeInTheDocument();

    // Check unique funding number

    userEvent.clear(projectNumberField);
    userEvent.type(projectNumberField, '123456');
    expect(projectNumberField).toHaveValue('123456');

    userEvent.click(screen.getByRole('button', { name: 'Add funding source' }));

    expect(
      await screen.findByText(
        'Project number has already been added to this request'
      )
    ).toBeInTheDocument();
  });
});
