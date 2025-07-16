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

  const getGRBDateFields = () => {
    const monthFields = screen.getAllByLabelText('general:date.month');
    const dayFields = screen.getAllByLabelText('general:date.day');
    const yearFields = screen.getAllByLabelText('general:date.year');

    return {
      grbMonthField: monthFields[1] as HTMLInputElement,
      grbDayField: dayFields[1] as HTMLInputElement,
      grbYearField: yearFields[1] as HTMLInputElement
    };
  };

  it('GRB date fields are enabled by default', () => {
    renderComponent();

    const { grbMonthField, grbDayField, grbYearField } = getGRBDateFields();

    expect(grbMonthField).toBeEnabled();
    expect(grbDayField).toBeEnabled();
    expect(grbYearField).toBeEnabled();
  });

  it('checking Async disables GRB date fields and clears their values', () => {
    renderComponent();

    const asyncCheckbox = screen.getByRole('checkbox', {
      name: 'action:progressToNewStep.asyncGRB'
    });

    const { grbMonthField, grbDayField, grbYearField } = getGRBDateFields();

    fireEvent.change(grbMonthField, { target: { value: '12' } });
    fireEvent.change(grbDayField, { target: { value: '25' } });
    fireEvent.change(grbYearField, { target: { value: '2025' } });

    expect(grbMonthField.value).toBe('12');
    expect(grbDayField.value).toBe('25');
    expect(grbYearField.value).toBe('2025');

    fireEvent.click(asyncCheckbox);

    expect(grbMonthField).toBeDisabled();
    expect(grbDayField).toBeDisabled();
    expect(grbYearField).toBeDisabled();

    expect(grbMonthField.value).toBe('');
    expect(grbDayField.value).toBe('');
    expect(grbYearField.value).toBe('');
  });

  it('unchecking Async re-enables GRB date fields', () => {
    renderComponent();

    const asyncCheckbox = screen.getByRole('checkbox', {
      name: 'action:progressToNewStep.asyncGRB'
    });

    const { grbMonthField, grbDayField, grbYearField } = getGRBDateFields();

    fireEvent.click(asyncCheckbox);
    expect(grbMonthField).toBeDisabled();

    fireEvent.click(asyncCheckbox);
    expect(grbMonthField).toBeEnabled();
    expect(grbDayField).toBeEnabled();
    expect(grbYearField).toBeEnabled();
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
});
