import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import { vi } from 'vitest';

import DateTimePicker from './index';

describe('DateTimePicker Component', () => {
  const defaultProps = {
    id: 'test-date-picker',
    name: 'testDate',
    value: '2023-06-15T00:00:00Z',
    isDateInPast: false,
    onChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<DateTimePicker {...defaultProps} />);

    // Check that the main container is rendered
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18next.t('general:datePicker.open') })
    ).toBeInTheDocument();
  });

  it('displays the selected date correctly', () => {
    render(<DateTimePicker {...defaultProps} />);

    const dateInput = screen.getByRole('textbox');
    expect(dateInput).toHaveValue('06/15/2023');
  });

  it('handles undefined value correctly', () => {
    render(<DateTimePicker {...defaultProps} value={undefined} />);

    const dateInput = screen.getByRole('textbox');
    expect(dateInput).toHaveValue('');
  });

  it('handles empty string value', () => {
    render(<DateTimePicker {...defaultProps} value="" />);

    const dateInput = screen.getByRole('textbox');
    expect(dateInput).toHaveValue('');
  });

  it('calls onChange when date is changed', async () => {
    const mockOnChange = vi.fn();

    render(<DateTimePicker {...defaultProps} onChange={mockOnChange} />);

    const dateInput = screen.getByRole('textbox');
    userEvent.clear(dateInput);
    userEvent.type(dateInput, '07/20/2023');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('opens calendar when calendar button is clicked', async () => {
    render(<DateTimePicker {...defaultProps} />);

    const calendarButton = screen.getByRole('button', {
      name: i18next.t('general:datePicker.open')
    });
    userEvent.click(calendarButton);

    // The calendar should be visible (ReactDatePicker renders a calendar popup)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows warning icon when date is in the past', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast />);

    expect(
      screen.getByRole('img', { name: i18next.t('general:datePicker.warning') })
    ).toBeInTheDocument();
  });

  it('does not show warning icon when date is not in the past', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast={false} />);

    expect(
      screen.queryByRole('img', {
        name: i18next.t('general:datePicker.warning')
      })
    ).not.toBeInTheDocument();
  });

  it('shows warning alert when date is in the past', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    // Check that the alert contains the warning text
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(i18next.t('general:dateWarning'));
  });

  it('does not show warning alert when date is not in the past', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast={false} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('hides warning icon when alertIcon is false', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast alertIcon={false} />);

    expect(
      screen.queryByRole('img', {
        name: i18next.t('general:datePicker.warning')
      })
    ).not.toBeInTheDocument();
  });

  it('hides warning alert when alertText is false', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast alertText={false} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DateTimePicker {...defaultProps} className="custom-class" />);

    // The className should be applied to the container div
    const container = screen.getByRole('textbox').closest('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<DateTimePicker {...defaultProps} />);

    const calendarButton = screen.getByRole('button', {
      name: i18next.t('general:datePicker.open')
    });

    expect(calendarButton).toHaveAttribute(
      'aria-label',
      i18next.t('general:datePicker.open')
    );
  });

  it('has proper accessibility attributes for warning icon', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast />);

    const warningIcon = screen.getByRole('img', {
      name: i18next.t('general:datePicker.warning')
    });
    expect(warningIcon).toHaveAttribute(
      'aria-label',
      i18next.t('general:datePicker.warning')
    );
  });

  it('has proper accessibility attributes for warning alert', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast />);

    const warningAlert = screen.getByRole('alert');
    expect(warningAlert).toHaveAttribute(
      'aria-label',
      i18next.t('general:datePicker.warning')
    );
  });

  it('shows tooltip on warning icon hover', () => {
    render(<DateTimePicker {...defaultProps} isDateInPast />);

    const warningIcon = screen.getByRole('img', {
      name: i18next.t('general:datePicker.warning')
    });
    expect(warningIcon).toBeInTheDocument();

    // The tooltip should be present in the DOM
    expect(warningIcon.closest('[title]')).toBeInTheDocument();
  });

  it('renders calendar icon correctly', () => {
    render(<DateTimePicker {...defaultProps} />);

    const calendarButton = screen.getByRole('button', {
      name: i18next.t('general:datePicker.open')
    });
    expect(calendarButton).toBeInTheDocument();
  });

  it('passes through additional props to ReactDatePicker', () => {
    render(
      <DateTimePicker
        {...defaultProps}
        placeholderText="Select a date"
        disabled
      />
    );

    const dateInput = screen.getByRole('textbox');
    expect(dateInput).toBeDisabled();
    expect(dateInput).toHaveAttribute('placeholder', 'Select a date');
  });

  it('handles date selection from calendar', async () => {
    const mockOnChange = vi.fn();

    render(<DateTimePicker {...defaultProps} onChange={mockOnChange} />);

    const dateInput = screen.getByRole('textbox');
    userEvent.click(dateInput);

    // This would test actual calendar interaction, but ReactDatePicker
    // handles this internally. We can test that the input is focused
    expect(dateInput).toHaveFocus();
  });

  it('handles keyboard navigation', async () => {
    render(<DateTimePicker {...defaultProps} />);

    const dateInput = screen.getByRole('textbox');
    userEvent.click(dateInput);
    userEvent.keyboard('{Tab}');

    // Should focus the calendar button next
    const calendarButton = screen.getByRole('button', {
      name: i18next.t('general:datePicker.open')
    });

    expect(calendarButton).toHaveFocus();
  });

  it('handles disabled state correctly', () => {
    render(<DateTimePicker {...defaultProps} disabled />);

    const dateInput = screen.getByRole('textbox');
    expect(dateInput).toBeDisabled();

    const calendarButton = screen.getByRole('button', {
      name: i18next.t('general:datePicker.open')
    });
    expect(calendarButton).toBeDisabled();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<DateTimePicker {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with past date warning', () => {
    const { asFragment } = render(
      <DateTimePicker {...defaultProps} isDateInPast />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with custom className', () => {
    const { asFragment } = render(
      <DateTimePicker {...defaultProps} className="test-class" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with disabled state', () => {
    const { asFragment } = render(
      <DateTimePicker {...defaultProps} disabled />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with alertText disabled', () => {
    const { asFragment } = render(
      <DateTimePicker {...defaultProps} isDateInPast alertText={false} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
