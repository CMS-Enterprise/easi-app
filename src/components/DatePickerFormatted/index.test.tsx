import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';

import DatePickerFormatted from '.';

describe('DatePickerFormatted', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

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

  it('converts the input value to the default utc iso format on change', async () => {
    const handleChange = vi.fn();
    const { getByRole } = render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        onChange={handleChange}
      />
    );

    await user.type(getByRole('textbox'), '09/09/1999');
    expect(handleChange).toHaveBeenCalledWith('1999-09-09T00:00:00.000Z');
  });

  it('uses a custom format function if provided', async () => {
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

    await user.type(getByRole('textbox'), '12/31/2020');
    expect(handleChange).toHaveBeenCalledWith('2020/12/31');
  });

  it('calls onChange with empty string for invalid dates', async () => {
    const handleChange = vi.fn();
    const { getByRole } = render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        onChange={handleChange}
      />
    );

    await user.type(getByRole('textbox'), '99/99/9999');
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('calls onChange with empty string for incomplete dates', async () => {
    const handleChange = vi.fn();
    const { getByRole } = render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        onChange={handleChange}
      />
    );

    await user.type(getByRole('textbox'), '11/11/1');
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('updates the textbox value when the value prop changes', () => {
    const handleChange = vi.fn();
    const { getByRole, rerender } = render(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        value="2000-01-01"
        onChange={handleChange}
      />
    );

    // Initial value
    expect(handleChange).toHaveBeenCalledWith('2000-01-01T00:00:00.000Z');
    expect(getByRole('textbox')).toHaveValue('01/01/2000');

    // Simulate parent updating the value prop
    rerender(
      <DatePickerFormatted
        id="datepicker"
        name="datepicker"
        value="2020-12-31"
        onChange={handleChange}
      />
    );

    // Value should update in the textbox
    expect(handleChange).toHaveBeenCalledWith('2020-12-31T00:00:00.000Z');
    expect(getByRole('textbox')).toHaveValue('12/31/2020');
  });
});
