import React, { useCallback, useEffect, useState } from 'react';
import { DatePicker } from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { DatePickerProps } from '@trussworks/react-uswds/lib/components/forms/DatePicker/DatePicker';
import { DateTime } from 'luxon';

function defaultFormat(dt: DateTime): string | null {
  return dt.toUTC().toISO();
}

type DatePickerFormattedProps = Omit<DatePickerProps, 'value'> & {
  format?: (dt: DateTime) => string | null;
  value?: string;
};

/**
 * A `DatePicker` wrapper with date formatting. Defaults to the utc iso format.
 * Bind an `onChange` handler to get the formatted value.
 * Use the `format` function to return a formatted value from a `DateTime` object.
 */
const DatePickerFormatted = ({
  onChange,
  format = defaultFormat,
  ...props
}: DatePickerFormattedProps) => {
  /**
   * Store value in state to use as key for <DatePicker>.
   * Fixes bug where <DatePicker> does not rerender to show updated value when set dynamically.
   * https://github.com/trussworks/react-uswds/issues/3000#issuecomment-2884731383
   */
  const [value, setValue] = useState(props.value || props.defaultValue || '');

  /**
   * Format valid dates and execute onChange handler.
   * Returns undefined if no onChange handler is provided.
   */
  const handleChange = useCallback(
    (val: string | undefined): void | undefined => {
      if (onChange) {
        // Check if date is complete (MM/dd/yyyy = 10 characters)
        if (typeof val === 'string' && val.length === 10) {
          const dt = DateTime.fromFormat(val, 'MM/dd/yyyy');

          // Check if date is valid before formatting
          if (dt.isValid) {
            return onChange(format(dt) || undefined);
          }
        }

        // Execute onChange with undefined value if the date is invalid
        return onChange(undefined);
      }

      // Return undefined if no onChange handler is provided
      return undefined;
    },
    [onChange, format]
  );

  useEffect(() => {
    // Check if props.value contains a valid string before updating state
    // This ensures that the key prop is only updated when the value changes
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <DatePicker
      {...props}
      onChange={handleChange}
      // Set `defaultValue` and `key` props to the value in state
      defaultValue={value}
      key={value}
    />
  );
};

export default DatePickerFormatted;
