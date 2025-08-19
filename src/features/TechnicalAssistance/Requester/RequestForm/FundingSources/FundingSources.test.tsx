import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import intakeFundingSources from 'constants/enums/intakeFundingSources';

import FundingSources from './FundingSources';

describe('Funding sources', () => {
  it('renders with no funding sources', () => {
    render(
      <FundingSources
        initialValues={[]}
        fundingSourceOptions={intakeFundingSources}
        setFieldValue={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Add a funding source' })
    ).toBeInTheDocument();
  });

  it('renders error messages', async () => {
    const user = userEvent.setup();
    render(
      <FundingSources
        initialValues={[
          {
            __typename: 'TRBFundingSource',
            id: '27849e78-e531-4778-9ead-e450eba50de0',
            fundingNumber: '123456',
            source: 'Research'
          }
        ]}
        fundingSourceOptions={intakeFundingSources}
        setFieldValue={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Add another funding source' })
    );

    // Renders error messages for empty fields

    await user.click(screen.getByRole('button', { name: 'Save' }));

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
      screen.getByText('Funding number can only contain digits')
    ).toBeInTheDocument();

    // Check unique funding number

    await user.clear(fundingNumberField);
    await user.type(fundingNumberField, '123456');
    expect(fundingNumberField).toHaveValue('123456');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      screen.getByText('Funding number must be unique')
    ).toBeInTheDocument();
  });
});
