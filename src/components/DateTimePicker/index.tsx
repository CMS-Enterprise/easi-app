import React, { useMemo, useRef, useState } from 'react';
import ReactDatePicker, { DatePickerProps } from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Icon, Tooltip } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { formatDateUtc, isDateInPast } from 'utils/date';

import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';

type DateTimePickerProps = DatePickerProps & {
  id: string;
  name: string;
  alertIcon?: boolean; // Whether to show the warning icon
  alertText?: boolean; // Whether to show the warning text. Sometimes we want to render the warning text under a different parent/UI element - outside the scope of this component
  className?: string;
};

/*
  This component is a wrapper around the ReactDatePicker component.
  It is used to display a date picker with an optional warning icon and alert. Default is true
  The warning icon and alert are only displayed if the date is in the past.
*/
const DateTimePicker = ({
  id,
  name,
  alertIcon = true,
  alertText = true,
  className,
  ...props
}: DateTimePickerProps) => {
  const { t: generalT } = useTranslation('general');

  const [isOpen, setIsOpen] = useState(false);

  const datePickerRef = useRef<ReactDatePicker>(null);

  // Check if the date is in the past
  const dateIsInPast = useMemo<boolean>(() => {
    if (props.value) {
      return isDateInPast(props.value);
    }
    return false;
  }, [props.value]);

  return (
    <div>
      <div className={classNames('display-flex margin-top-1', className)}>
        <ReactDatePicker
          {...props}
          ref={datePickerRef}
          id={id}
          name={name}
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          onSelect={() => setIsOpen(false)}
          selected={props.value ? new Date(props.value) : null}
          value={
            typeof props.value === 'string'
              ? formatDateUtc(props.value, 'MM/dd/yyyy')
              : props.value
          }
          aria-label={generalT('datePicker.label')}
          popperPlacement="bottom-start"
        />

        {dateIsInPast && alertIcon && (
          <div className="mint-datetime-picker-warning">
            <Tooltip
              label={generalT('dateWarning')}
              className="padding-0 margin-0 margin-top-1 bg-transparent outline-0"
            >
              <Icon.Warning
                size={3}
                className="text-warning-dark"
                aria-label={generalT('datePicker.warning')}
              />
            </Tooltip>
          </div>
        )}

        <Button
          type="button"
          unstyled
          className="text-black padding-0 margin-left-1 margin-top-0"
          aria-label={generalT('datePicker.open')}
          disabled={props.disabled}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon.CalendarToday size={3} />
        </Button>
      </div>

      {dateIsInPast && alertText && (
        <Alert
          type="warning"
          className="margin-top-2"
          headingLevel="h4"
          role="alert"
          slim
          aria-label={generalT('datePicker.warning')}
        >
          {generalT('dateWarning')}
        </Alert>
      )}
    </div>
  );
};

export default DateTimePicker;
