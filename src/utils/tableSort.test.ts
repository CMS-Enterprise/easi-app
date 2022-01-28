import { DateTime } from 'luxon';

import { sortColumnProps, sortColumnValues } from './tableSort';

describe('tableSort', () => {
  it('sorts with a string and null value', () => {
    const input1: sortColumnProps = 'joe';
    const input2: sortColumnProps = null;
    expect(sortColumnValues(input1, input2)).toEqual(-1);
    expect(sortColumnValues(input2, input1)).toEqual(1);
  });

  it('sorts with two null values', () => {
    const input1: sortColumnProps = null;
    const input2: sortColumnProps = null;
    expect(sortColumnValues(input1, input2)).toEqual(1);
    expect(sortColumnValues(input2, input1)).toEqual(1);
  });

  it('sorts with a string and number', () => {
    const input1: sortColumnProps = 10;
    const input2: sortColumnProps = 'joe';
    expect(sortColumnValues(input1, input2)).toEqual(1);
    expect(sortColumnValues(input2, input1)).toEqual(-1);
  });

  it('sorts with a string and datetime', () => {
    const input1: sortColumnProps = DateTime.local();
    const input2: sortColumnProps = 'joe';
    expect(sortColumnValues(input1, input2)).toEqual(1);
    expect(sortColumnValues(input2, input1)).toEqual(-1);
  });

  it('sorts with a number and datetime', () => {
    const input1: sortColumnProps = DateTime.local();
    const input2: sortColumnProps = 10;
    expect(sortColumnValues(input1, input2)).toEqual(1);
    expect(sortColumnValues(input2, input1)).toEqual(-1);
  });

  it('sorts with two datetimes', () => {
    const input1: sortColumnProps = DateTime.local();
    const input2: sortColumnProps = DateTime.local(2017);
    expect(sortColumnValues(input1, input2)).toEqual(1);
    expect(sortColumnValues(input2, input1)).toEqual(-1);
  });

  it('sorts with two Strings', () => {
    const input1: sortColumnProps = 'barb';
    const input2: sortColumnProps = 'Joe';
    expect(sortColumnValues(input1, input2)).toEqual(-1);
    expect(sortColumnValues(input2, input1)).toEqual(1);
  });
});
