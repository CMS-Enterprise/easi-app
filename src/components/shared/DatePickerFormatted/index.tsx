import React from 'react';
import { DatePicker } from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { DatePickerProps } from '@trussworks/react-uswds/lib/components/forms/DatePicker/DatePicker';
import { DateTime } from 'luxon';

function defaultFormat(dt: DateTime): string {
  return dt.toUTC().toISO();
}

/**
 * A `DatePicker` wrapper with date formatting. Defaults to the utc iso format.
 * Bind an `onChange` handler to get the formatted value.
 * Use the `format` function to return a formatted value from a `DateTime` object.
 */
const DatePickerFormatted = ({
  onChange,
  format,
  ...props
}: DatePickerProps & { format?: (dt: DateTime) => string }) => {
  const dtFormat = format || defaultFormat;

  return (
    <DatePicker
      {...props}
      onChange={val => {
        if (typeof onChange === 'function' && typeof val === 'string') {
          onChange(dtFormat(DateTime.fromFormat(val, 'MM/dd/yyyy')));
        }
      }}
    />
  );
};

export default DatePickerFormatted;
