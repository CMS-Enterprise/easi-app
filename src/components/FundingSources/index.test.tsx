import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { FundingSource } from 'types/systemIntake';

import FundingSources from '.';

type FormType = { fundingSources: FundingSource[] };

describe('Funding sources', () => {
  /** Returns form provider for unit tests */
  const Wrapper = ({
    children,
    fundingSources = []
  }: {
    children: React.ReactNode;
    fundingSources?: FundingSource[];
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
      <Wrapper>
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
            __typename: 'SystemIntakeFundingSource',
            id: 'a07b4819-ae01-4995-8aaa-a342a7c20e96',
            fundingNumber: '123456',
            source: 'Fed Admin'
          }
        ]}
      >
        <FundingSources />
      </Wrapper>
    );

    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', { name: 'Add another funding source' })
    );

    // Renders error messages for empty fields

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(
      await screen.findByText('Funding number must be exactly 6 digits')
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Select a funding source')
    ).toBeInTheDocument();

    const fundingNumberField = screen.getByRole('textbox', {
      name: 'Funding number'
    });

    // Check funding number is numeric

    await user.type(fundingNumberField, 'aaaaaa');
    expect(fundingNumberField).toHaveValue('aaaaaa');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Funding number can only contain digits')
    ).toBeInTheDocument();

    // Check unique funding number

    await user.clear(fundingNumberField);
    await user.type(fundingNumberField, '123456');
    expect(fundingNumberField).toHaveValue('123456');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Funding number must be unique')
    ).toBeInTheDocument();
  });
});
