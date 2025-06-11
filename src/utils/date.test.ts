import { DateTime, Settings } from 'luxon';

import {
  formatContractDate,
  formatDateLocal,
  formatDateUtc,
  formatDaysHoursMinutes,
  getFiscalYear,
  getRelativeDate,
  parseAsUTC
} from './date';

describe('parseAsUTC', () => {
  const date = '2022-10-22T00:00:00Z';

  it('converts a date from an ISO string to a luxon datetime', () => {
    const parsedDate: any = parseAsUTC(date);
    expect(parsedDate instanceof DateTime).toBeTruthy();
  });

  it('converts dates from the utc timezone instead of local', () => {
    expect(parseAsUTC(date).day).toEqual(22);
  });
});

describe('formatDateLocal/UTC', () => {
  describe('string', () => {
    it('converts an ISO string to the proper date in the appropriate timezone', () => {
      Settings.defaultZone = 'UTC-8';
      const isoStringDate = '2022-10-22T10:00:00Z';
      expect(formatDateLocal(isoStringDate, 'MMMM d, yyyy')).toEqual(
        'October 22, 2022'
      );
    });

    it('returns empty string when a string is not ISO string', () => {
      const date = 'not an ISO string';
      expect(formatDateLocal(date, 'MMMM d, yyyy')).toEqual('');
    });

    it('returns empty string when input is null', () => {
      const date = null;
      expect(formatDateUtc(date, 'MMMM d, yyyy')).toEqual('');
    });

    it('converts an ISO string UTC timezone', () => {
      const isoStringDate = '2022-10-22T00:00:00Z';
      expect(formatDateUtc(isoStringDate, 'MMMM d, yyyy')).toEqual(
        'October 22, 2022'
      );
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

describe('getRelativeDate', () => {
  it('returns formatted date after 30 days', () => {
    const date = DateTime.fromObject({ year: 2021, month: 3, day: 1 });

    const formattedDate = date.toFormat('MM/dd/yyyy');

    const relativeDate = getRelativeDate(date.toISO());

    expect(relativeDate).toEqual(formattedDate);
  });

  it('formats past relative date', () => {
    const days = 3;

    const date = DateTime.now().minus({ days });

    const relativeDate = getRelativeDate(date.toISO());

    expect(relativeDate).toEqual(`${days} days ago`);
  });

  it('formats relative date for today', () => {
    const date = DateTime.now();

    const relativeDate = getRelativeDate(date.toISO());

    expect(relativeDate).toEqual('today');
  });
});

describe('formatDaysHoursMinutes', () => {
  it('calculates the difference for a past date', () => {
    // Mock a past ISO string
    const pastDate = DateTime.utc()
      .minus({ days: 2, hours: 5, minutes: 30 })
      .toISO();

    const result = formatDaysHoursMinutes(pastDate);

    expect(result).toEqual({
      days: 2,
      hours: 5,
      minutes: 30
    });
  });

  it('calculates the difference for a future date', () => {
    // Set current date to fix flaky unit test
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-01T12:00:00Z'));

    // Mock a future ISO string
    const futureDate = DateTime.utc()
      .plus({ days: 0, hours: 3, minutes: 15 })
      .toISO();

    const result = formatDaysHoursMinutes(futureDate);

    expect(result).toEqual({
      days: 0,
      hours: 3,
      minutes: 15
    });

    vi.useRealTimers();
  });

  it('returns 0 for all values when the input date is now', () => {
    // Mock the current time
    const now = DateTime.utc().toISO();

    const result = formatDaysHoursMinutes(now);

    expect(result).toEqual({
      days: 0,
      hours: 0,
      minutes: 0
    });
  });

  it('handles invalid ISO strings gracefully', () => {
    // Pass an invalid ISO string
    const invalidDate = 'invalid-date';

    const result = formatDaysHoursMinutes(invalidDate);

    expect(result).toEqual({
      days: NaN,
      hours: NaN,
      minutes: NaN
    });
  });
});
