import { DateTime } from 'luxon';

import SystemIntakeValidationSchema from './systemIntakeSchema';

// Helper: build ISO string in UTC with trailing 'Z'
const toIsoUtc = (d: { month: string; day: string; year: string }) =>
  DateTime.utc(
    Number(d.year),
    Number(d.month),
    Number(d.day),
    0,
    0,
    0,
    0
  ).toISO({
    suppressMilliseconds: false
  });

describe('System intake contract dates', () => {
  it.each([
    { month: '01', day: '20', year: '1999' },
    { month: '12', day: '9', year: '2000' }
  ])('accepts valid start and end dates: %j', async date => {
    const iso = toIsoUtc(date);
    // Sanity check: our helper must produce a valid ISO ending with Z
    expect(iso).toMatch(/Z$/);

    await Promise.all(
      ['HAVE_CONTRACT', 'IN_PROGRESS'].map(async hasContract => {
        await expect(
          SystemIntakeValidationSchema.contractDetails.validateAt(
            'contract.startDate',
            { contract: { hasContract, startDate: iso } }
          )
        ).resolves.toBeDefined();

        await expect(
          SystemIntakeValidationSchema.contractDetails.validateAt(
            'contract.endDate',
            { contract: { hasContract, endDate: iso } }
          )
        ).resolves.toBeDefined();
      })
    );
  });

  it.each([
    // no trailing Z (should fail isIsoUtc)
    '2000-12-09T00:00:00.000',
    // invalid month
    '2000-99-20T00:00:00.000Z',
    // invalid day
    '2000-12-99T00:00:00.000Z',
    // non-ISO junk
    'fooZ',
    // empty
    '',
    // whitespace
    '   ',
    // missing time part but with Z (still invalid for Luxon parse)
    '2000-12-09Z'
  ])('catches invalid start and end dates: %s', async iso => {
    await Promise.all(
      ['HAVE_CONTRACT', 'IN_PROGRESS'].map(async hasContract => {
        await expect(
          SystemIntakeValidationSchema.contractDetails.validateAt(
            'contract.startDate',
            { contract: { hasContract, startDate: iso } }
          )
        ).rejects.toThrow();

        await expect(
          SystemIntakeValidationSchema.contractDetails.validateAt(
            'contract.endDate',
            { contract: { hasContract, endDate: iso } }
          )
        ).rejects.toThrow();
      })
    );
  });
});
