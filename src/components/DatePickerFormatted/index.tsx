import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { DatePickerProps } from '@trussworks/react-uswds/lib/components/forms/DatePicker/DatePicker';
import { actionDateInPast } from 'features/ITGovernance/Admin/Actions/ManageLcid/RetireLcid';
import { DateTime } from 'luxon';

import Alert from 'components/Alert';

interface DatePickerFormattedProps extends Omit<DatePickerProps, 'onChange'> {
  onChange?: (value: string | undefined) => void;
  format?: (dt: DateTime, suppressMilliseconds?: boolean) => string | null;
  dateInPastWarning?: boolean;
  suppressMilliseconds?: boolean;
  onValidationError?: (error: string) => void;
}

const defaultFormat: DatePickerFormattedProps['format'] = (
  dt,
  suppressMilliseconds
) => dt.toUTC().toISO({ suppressMilliseconds });

/**
 * A `DatePicker` wrapper with date formatting. Defaults to the utc iso format.
 * Bind an `onChange` handler to get the formatted value.
 * Use the `format` function to return a formatted value from a `DateTime` object.
 */

const DatePickerFormatted = ({
  onChange,
  format = defaultFormat,
  dateInPastWarning,
  suppressMilliseconds,
  ...props
}: DatePickerFormattedProps) => {
  const { t } = useTranslation('action');

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

  const handleChange = (val: string | undefined): void | undefined => {
    if (onChange) {
      // Handle empty string
      // if (val === '') return onChange('');

      // Only format if the date is complete (MM/dd/yyyy = 10 characters)
      if (typeof val === 'string' && val.length === 10) {
        const dt = DateTime.fromFormat(val, 'MM/dd/yyyy');

        if (dt.isValid) {
          return onChange(format(dt, suppressMilliseconds) || undefined);
        }
      }

      // Execute onChange with undefined value if the date is invalid
      return onChange(undefined);
    }

    // Return undefined if no onChange handler is provided
    return undefined;
  };

  return (
    <>
      <FieldCallback {...props} onChange={handleChange} />
      {
        // If past date is selected, show alert
        dateInPastWarning && actionDateInPast(value || null) && (
          <Alert type="warning" data-testid="past-date-alert" slim>
            {t('pastDateAlert')}
          </Alert>
        )
      }
    </>
  );
};

export default DatePickerFormatted;
