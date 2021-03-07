import { DateTime } from 'luxon';

import formatDate from './formatDate';

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
