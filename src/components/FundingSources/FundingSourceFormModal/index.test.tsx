import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FundingSourceFormModal from '.';

describe('FundingSourceFormModal', () => {
  it('renders error messages', async () => {
    render(
      <FundingSourceFormModal
        isOpen
        closeModal={() => {}}
        addFundingSource={() => {}}
        initialFundingSources={[
          { projectNumber: '123456', investments: ['Fed Admin'] }
        ]}
      />
    );

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
      await screen.findByText('Project number(s) can only contain digits')
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
