import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@trussworks/react-uswds';
// eslint-disable-next-line import/no-unresolved
import { DatePickerProps } from '@trussworks/react-uswds/lib/components/forms/DatePicker/DatePicker';
import { actionDateInPast } from 'features/ITGovernance/Admin/Actions/ManageLcid/RetireLcid';
import { DateTime } from 'luxon';

import Alert from 'components/Alert';

function defaultFormat(
  dt: DateTime,
  suppressMilliseconds?: boolean
): string | null {
  return dt.toUTC().toISO({ suppressMilliseconds });
}

type DatePickerFormattedProps = Omit<DatePickerProps, 'value'> & {
  format?: (dt: DateTime) => string | null;
  value?: string;
  dateInPastWarning?: boolean;
  suppressMilliseconds?: boolean;
};

/**
 * A `DatePicker` wrapper with date formatting. Defaults to the utc iso format.
 * Bind an `onChange` handler to get the formatted value.
 * Use the `format` function to return a formatted value from a `DateTime` object.
 */
const DatePickerFormatted = ({
  onChange,
  format = defaultFormat,
  dateInPastWarning,
  value: controlledValue,
  ...props
}: DatePickerFormattedProps) => {
  const { t } = useTranslation('action');

  /**
   * Store value in state to use as key for <DatePicker>.
   * Fixes bug where <DatePicker> does not rerender to show updated value when set dynamically.
   * https://github.com/trussworks/react-uswds/issues/3000#issuecomment-2884731383
   */
  const [internalValue, setInternalValue] = useState(
    controlledValue || props.defaultValue || ''
  );

  // Sync internalValue whenever controlledValue changes
  useEffect(() => {
    // Allow empty string to propagate so it visually clears
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue || '');
    }
  }, [controlledValue]);

  /**
   * Format valid dates and execute onChange handler.
   * Returns undefined if no onChange handler is provided.
   */
  const handleChange = useCallback(
    (val: string | undefined): void => {
      if (!onChange) return;

      // A full US date (MM/DD/YYYY) has 10 chars
      if (typeof val === 'string' && val.length === 10) {
        const dt = DateTime.fromFormat(val, 'MM/dd/yyyy');
        if (dt.isValid) {
          onChange(format(dt) || '');
          return;
        }
      }

      // Incomplete or invalid date → clear
      onChange('');
    },
    [onChange, format]
  );

  return (
    <>
      <DatePicker
        {...props}
        // Pass the synced internal value as defaultValue (Trussworks workaround)
        defaultValue={internalValue}
        onChange={handleChange}
        // Only force-remount when clearing
        key={internalValue === '' ? 'empty' : `value-${internalValue}`}
      />

      {dateInPastWarning &&
        internalValue &&
        actionDateInPast(internalValue) && (
          <Alert type="warning" slim>
            {t('pastDateAlert')}
          </Alert>
        )}
    </>
  );
};

export default DatePickerFormatted;
