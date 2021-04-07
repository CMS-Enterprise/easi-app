import { DateTime } from 'luxon';

import {
  formatContractDate,
  formatDate,
  getFiscalYear,
  parseDateInUTC
} from './date';

describe('parseDateInUTC', () => {
  it('converts a date from an ISO string to a luxon datetime', () => {
    const date = '2022-10-22T00:00:00Z';
    const parsedDate: any = parseDateInUTC(date);
    expect(parsedDate instanceof DateTime).toBeTruthy();
  });

  it('converts dates from the utc timezone instead of local', () => {
    const date = '2022-10-22T00:00:00Z';
    expect(parseDateInUTC(date).day).toEqual(22);
  });

  it('converts ISO string with offset to utc', () => {
    const date = '2022-10-22T00:00:00+07:00';
    expect(parseDateInUTC(date).day).toEqual(21);
  });
});

describe('formatDate', () => {
  describe('string', () => {
    it('converts an ISO string to the proper date', () => {
      const date = DateTime.fromObject({ year: 2020, month: 6, day: 30 });
      const isoStringDate = date.toISO();

      expect(formatDate(isoStringDate)).toEqual('June 30 2020');
    });

    it('returns invalid datetime when a string is not ISO string', () => {
      const date = 'not an ISO string';
      expect(formatDate(date)).toEqual('Invalid DateTime');
    });
  });

  describe('formatContractDate', () => {
    it('formats a complete date', () => {
      const input = {
        day: '1',
        month: '2',
        year: '2022'
      };

      expect(formatContractDate(input)).toEqual('2/1/2022');
    });

    it('formats a date without a day', () => {
      const input = {
        day: '',
        month: '2',
        year: '2022'
      };

      expect(formatContractDate(input)).toEqual('2/2022');
    });
  });

  describe('DateTime', () => {
    it('converts a luxon DateTime to the proper date', () => {
      const date = DateTime.fromObject({ year: 2020, month: 6, day: 30 });

      expect(formatDate(date)).toEqual('June 30 2020');
    });

    it('returns invalid datetime when a luxon datetime is invalid', () => {
      const date = DateTime.fromISO('blah blah blah');

      expect(formatDate(date)).toEqual('Invalid DateTime');
    });
  });
});

describe('getFiscalYear', () => {
  it('returns fiscal year for a random date in the middle of the year', () => {
    const date = DateTime.fromObject({ year: 2021, month: 3, day: 1 });

    expect(getFiscalYear(date)).toEqual(2021);
  });

  it('returns fiscal year for a date at the beginning of the fiscal year', () => {
    const date = DateTime.fromObject({ year: 2024, month: 10, day: 1 });

    expect(getFiscalYear(date)).toEqual(2025);
  });

  it('returns fiscal year for a date at the end of the fiscal year', () => {
    const date = DateTime.fromObject({ year: 2029, month: 9, day: 30 });

    expect(getFiscalYear(date)).toEqual(2029);
  });
});
