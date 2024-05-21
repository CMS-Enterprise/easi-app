import React, { useCallback, useMemo } from 'react';
import { DatePicker } from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { DatePickerProps } from '@trussworks/react-uswds/lib/components/forms/DatePicker/DatePicker';
import { DateTime } from 'luxon';

function defaultFormat(dt: DateTime): string | null {
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
}: DatePickerProps & { format?: (dt: DateTime) => string | null }) => {
  const dtFormat = format || defaultFormat;

  /** Memoized current field value */
  const value = useMemo(() => {
    if (typeof props.value === 'string' && props.value.length > 0) {
      return props.value;
    }

    return props.defaultValue || '';
  }, [props.defaultValue, props.value]);

  /**
   * Fix for bug where <DatePicker> does not rerender to show updated value when set dynamically
   *
   * Forces re-render of component when props.value or props.defaultValue is updated
   */
  const FieldCallback = useCallback(
    (fieldProps: DatePickerProps) => {
      return <DatePicker {...fieldProps} defaultValue={value} />;
    },
    [value]
  );

  return (
    <FieldCallback
      {...props}
      onChange={val => {
        if (typeof onChange === 'function') {
          if (val === '') {
            onChange('');
          } else if (typeof val === 'string') {
            onChange(
              dtFormat(DateTime.fromFormat(val, 'MM/dd/yyyy')) || undefined
            );
          }
        }
      }}
    />
  );
};

export default DatePickerFormatted;
