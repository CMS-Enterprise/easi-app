import React from 'react';
import { render } from '@testing-library/react';

import DatePickerFormatted from '.';

describe('DatePickerFormatted', () => {
  it('converts the input value to the default utc iso format', () => {
    render(
      <DatePickerFormatted
        id="sega"
        name="sega"
        defaultValue="1999-09-09"
        onChange={val => {
          expect(val).toBe('1999-09-09T00:00:00.000Z');
        }}
      />
    );
  });
});
