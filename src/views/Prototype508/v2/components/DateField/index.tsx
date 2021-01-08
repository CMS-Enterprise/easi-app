import React, { useEffect, useState } from 'react';
import { DateInput, DateInputGroup, Fieldset } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import '@cmsgov/design-system/dist/css/index.css';

const DateField = ({ setDate }: { setDate: (date: DateTime) => void }) => {
  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();

  useEffect(() => {
    const newDate = DateTime.local(year, month, day);
    setDate(newDate);
  }, [setDate, month, day, year]);

  return (
    <Fieldset legend="Test date">
      <span className="usa-hint">For example: 4 28 2020</span>
      <DateInputGroup>
        <DateInput
          id="testDateInput"
          name="testName"
          label="Month"
          unit="month"
          maxLength={2}
          minLength={2}
          value={month}
          onChange={e =>
            e.target.value.length > 0
              ? setMonth(parseInt(e.target.value, 10))
              : setMonth(undefined)
          }
        />
        <DateInput
          id="testDateInput"
          name="testName"
          label="Day"
          unit="day"
          maxLength={2}
          minLength={2}
          value={day}
          onChange={e =>
            e.target.value.length > 0
              ? setDay(parseInt(e.target.value, 10))
              : setDay(undefined)
          }
        />
        <DateInput
          id="testDateInput"
          name="testName"
          label="Year"
          unit="year"
          maxLength={4}
          minLength={4}
          value={year}
          onChange={e =>
            e.target.value.length > 0
              ? setYear(parseInt(e.target.value, 10))
              : setYear(undefined)
          }
        />
      </DateInputGroup>
    </Fieldset>
  );
};

export default DateField;
