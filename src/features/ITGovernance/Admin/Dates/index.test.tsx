import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { getSystemIntakeQuery, systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Dates from '.';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('Dates Form - Async Checkbox Behavior', () => {
  const renderComponent = (overrides = {}) => {
    return render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeQuery()]}>
          <MessageProvider>
            <Dates systemIntake={{ ...systemIntake, ...overrides }} />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );
  };

  const getGRTDateField = () => {
    // first date picker is for grtDate
    return screen.getAllByTestId(
      'date-picker-external-input'
    )[0] as HTMLInputElement;
  };

  const getGRBDateField = () => {
    // second date picker is for grbDate
    return screen.getAllByTestId(
      'date-picker-external-input'
    )[1] as HTMLInputElement;
  };

  it('GRB date field is enabled by default', () => {
    renderComponent();

    const grbDateField = getGRBDateField();
    expect(grbDateField).toBeEnabled();
  });

  it('checking Async disables GRB date field and clears its value', () => {
    renderComponent();

    const asyncCheckbox = screen.getByRole('checkbox', {
      name: 'action:progressToNewStep.asyncGRB'
    });

    const grbDateField = getGRBDateField();

    // Just simulate setting a value (we don't assert it)
    fireEvent.change(grbDateField, { target: { value: '2025-12-25' } });

    // Click Async checkbox → should disable & clear
    fireEvent.click(asyncCheckbox);
    expect(grbDateField).toBeDisabled();
    expect(grbDateField.value).toBe('');
  });

  it('unchecking Async re-enables GRB date field', () => {
    renderComponent();

    const asyncCheckbox = screen.getByRole('checkbox', {
      name: 'action:progressToNewStep.asyncGRB'
    });

    const grbDateField = getGRBDateField();

    // Disable
    fireEvent.click(asyncCheckbox);
    expect(grbDateField).toBeDisabled();

    // Re-enable
    fireEvent.click(asyncCheckbox);
    expect(grbDateField).toBeEnabled();
  });

  it('disables Async checkbox when grbReviewStartedAt is set', () => {
    renderComponent({
      grbReviewStartedAt: '2025-01-01T00:00:00Z'
    });

    const asyncCheckbox = screen.getByRole('checkbox', {
      name: 'action:progressToNewStep.asyncGRB'
    });

    expect(asyncCheckbox).toBeDisabled();
  });

  it('does not affect GRT date field when toggling Async', () => {
    renderComponent();

    const asyncCheckbox = screen.getByRole('checkbox', {
      name: 'action:progressToNewStep.asyncGRB'
    });

    const grtDateField = getGRTDateField();

    // Initially enabled
    expect(grtDateField).toBeEnabled();

    // Toggle Async ON
    fireEvent.click(asyncCheckbox);
    expect(grtDateField).toBeEnabled(); // still enabled

    // Toggle Async OFF
    fireEvent.click(asyncCheckbox);
    expect(grtDateField).toBeEnabled(); // still enabled
  });
});
