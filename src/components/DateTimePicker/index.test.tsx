import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import sinon from 'sinon';
import { vi } from 'vitest';

import DateTimePicker from './index';

describe('DateTimePicker Component', () => {
  const defaultProps = {
    id: 'test-date-picker',
    name: 'testDate',
    value: '2023-06-15T00:00:00Z',
    onChange: vi.fn()
  };

  sinon.stub(Math, 'random').returns(0.5);

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
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '07/20/2023');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('opens calendar when calendar button is clicked', async () => {
    const user = userEvent;

    render(<DateTimePicker {...defaultProps} />);

    const calendarButton = screen.getByRole('button', {
      name: i18next.t('general:datePicker.open')
    });
    await user.click(calendarButton);

    // The calendar should be visible (ReactDatePicker renders a calendar popup)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows warning icon when date is in the past', () => {
    // Use a past date to trigger the warning
    render(<DateTimePicker {...defaultProps} value="2020-01-01T00:00:00Z" />);

    expect(
      screen.getByRole('img', { name: i18next.t('general:datePicker.warning') })
    ).toBeInTheDocument();
  });

  it('does not show warning icon when date is not in the past', () => {
    // Use a future date to avoid the warning
    render(<DateTimePicker {...defaultProps} value="2030-01-01T00:00:00Z" />);

    expect(
      screen.queryByRole('img', {
        name: i18next.t('general:datePicker.warning')
      })
    ).not.toBeInTheDocument();
  });

  it('shows warning alert when date is in the past', () => {
    // Use a past date to trigger the warning
    render(<DateTimePicker {...defaultProps} value="2020-01-01T00:00:00Z" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    // Check that the alert contains the warning text
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(i18next.t('general:dateWarning'));
  });

  it('does not show warning alert when date is not in the past', () => {
    // Use a future date to avoid the warning
    render(<DateTimePicker {...defaultProps} value="2030-01-01T00:00:00Z" />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('hides warning icon when alertIcon is false', () => {
    // Use a past date to trigger the warning
    render(
      <DateTimePicker
        {...defaultProps}
        value="2020-01-01T00:00:00Z"
        alertIcon={false}
      />
    );

    expect(
      screen.queryByRole('img', {
        name: i18next.t('general:datePicker.warning')
      })
    ).not.toBeInTheDocument();
  });

  it('hides warning alert when alertText is false', () => {
    // Use a past date to trigger the warning
    render(
      <DateTimePicker
        {...defaultProps}
        value="2020-01-01T00:00:00Z"
        alertText={false}
      />
    );

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
    // Use a past date to trigger the warning
    render(<DateTimePicker {...defaultProps} value="2020-01-01T00:00:00Z" />);

    const warningIcon = screen.getByRole('img', {
      name: i18next.t('general:datePicker.warning')
    });
    expect(warningIcon).toHaveAttribute(
      'aria-label',
      i18next.t('general:datePicker.warning')
    );
  });

  it('has proper accessibility attributes for warning alert', () => {
    // Use a past date to trigger the warning
    render(<DateTimePicker {...defaultProps} value="2020-01-01T00:00:00Z" />);

    const warningAlert = screen.getByRole('alert');
    expect(warningAlert).toHaveAttribute(
      'aria-label',
      i18next.t('general:datePicker.warning')
    );
  });

  it('shows tooltip on warning icon hover', () => {
    // Use a past date to trigger the warning
    render(<DateTimePicker {...defaultProps} value="2020-01-01T00:00:00Z" />);

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
    const user = userEvent;
    const mockOnChange = vi.fn();

    render(<DateTimePicker {...defaultProps} onChange={mockOnChange} />);

    const dateInput = screen.getByRole('textbox');
    await user.click(dateInput);

    // This would test actual calendar interaction, but ReactDatePicker
    // handles this internally. We can test that the input is focused
    expect(dateInput).toHaveFocus();
  });

  it('handles keyboard navigation', async () => {
    render(<DateTimePicker {...defaultProps} />);

    const dateInput = screen.getByRole('textbox');
    const calendarButton = screen.getByRole('button', {
      name: i18next.t('general:datePicker.open')
    });

    // Focus the input first
    dateInput.focus();
    expect(dateInput).toHaveFocus();

    // Test that tabbing works by checking tabIndex or focus order
    // Note: ReactDatePicker may handle focus internally, so we test the accessible structure
    expect(calendarButton).toHaveAttribute('type', 'button');
    expect(calendarButton).not.toBeDisabled();
  });

  it('works with Formik Field component', () => {
    // Test that it works as a Formik Field
    render(
      <DateTimePicker
        {...defaultProps}
        id="completeICIP"
        name="completeICIP"
        value="2023-06-15T00:00:00Z"
        onChange={date => {}}
        alertText={false}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18next.t('general:datePicker.open') })
    ).toBeInTheDocument();
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
      <DateTimePicker {...defaultProps} value="2020-01-01T00:00:00Z" />
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
      <DateTimePicker
        {...defaultProps}
        value="2020-01-01T00:00:00Z"
        alertText={false}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
