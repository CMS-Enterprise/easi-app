import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';

import DatePickerFormatted from '.';

describe('DatePickerFormatted', () => {
  it('converts the `defaultValue` prop value to the default utc iso format on mount', () => {
    const handleChange = vi.fn();
    render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        defaultValue="1999-09-09"
        onChange={handleChange}
      />
    );

    expect(handleChange).toHaveBeenCalledWith('1999-09-09T00:00:00.000Z');
  });

  it('converts the input value to the default utc iso format on change', () => {
    const handleChange = vi.fn();
    const { getByRole } = render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        onChange={handleChange}
      />
    );

    userEvent.type(getByRole('textbox'), '09/09/1999');
    expect(handleChange).toHaveBeenCalledWith('1999-09-09T00:00:00.000Z');
  });

  it('uses a custom format function if provided', () => {
    const handleChange = vi.fn();

    const customFormat = (dt: DateTime) => dt.toFormat('yyyy/MM/dd');

    const { getByRole } = render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        onChange={handleChange}
        format={customFormat}
      />
    );

    userEvent.type(getByRole('textbox'), '12/31/2020');
    expect(handleChange).toHaveBeenCalledWith('2020/12/31');
  });

  it('calls onChange with empty string for invalid dates', () => {
    const handleChange = vi.fn();
    const { getByRole, getByTestId } = render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        onChange={handleChange}
      />
    );

    userEvent.type(getByRole('textbox'), '99/99/9999');
    expect(getByTestId('date-picker-external-input')).toBeInvalid();
  });

  it('calls onChange with empty string for incomplete dates', () => {
    const handleChange = vi.fn();
    const { getByRole, getByTestId } = render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        onChange={handleChange}
      />
    );

    userEvent.type(getByRole('textbox'), '11/11/1');
    expect(getByTestId('date-picker-external-input')).toBeInvalid();
  });
});
