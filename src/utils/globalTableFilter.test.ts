import { DateTime } from 'luxon';

import globalTableFilter from './globalTableFilter';

const rows = [
  {
    values: {
      name: 'John',
      date: DateTime.local(2022, 1),
      number: 5
    }
  },
  {
    values: {
      name: 'Mary',
      date: DateTime.local(2022, 2),
      number: 0
    }
  },
  {
    values: {
      name: 'Beth',
      date: DateTime.local(2022, 3),
      number: 12
    }
  }
] as any;

describe('globalTableFilter', () => {
  it('return matching rows', () => {
    expect(globalTableFilter(rows, [''], 'John')).toEqual([rows[0]]);
    expect(globalTableFilter(rows, [''], 'February')).toEqual([rows[1]]);
    expect(globalTableFilter(rows, [''], '12')).toEqual([rows[2]]);
    expect(globalTableFilter(rows, [''], '2022')).toEqual(rows);
  });
});
