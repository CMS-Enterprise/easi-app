import SystemIntakeValidationSchema from './systemIntakeSchema';

describe('System intake contract dates', () => {
  it.each([
    { month: '01', day: '20', year: '1999' },
    { month: '12', day: '9', year: '2000' }
  ])('accepts valid start and end dates: %j', async date => {
    await Promise.all(
      ['HAVE_CONTRACT', 'IN_PROGRESS'].map(async hasContract => {
        await expect(
          SystemIntakeValidationSchema.contractDetails.validateAt(
            'contract.startDate',
            { contract: { hasContract, startDate: date } }
          )
        ).resolves.toBeDefined();
        await expect(
          SystemIntakeValidationSchema.contractDetails.validateAt(
            'contract.endDate',
            { contract: { hasContract, endDate: date } }
          )
        ).resolves.toBeDefined();
      })
    );
  });

  it.each([
    { month: '1', day: '20', year: '99' },
    { month: '', day: '', year: '' },
    { month: '12', year: '2000' },
    { day: '20', year: '99' },
    { month: '1', day: '20' },
    { month: '12', day: '99', year: '2000' },
    { month: '99', day: '20', year: '2000' },
    { month: 'f', day: 'o', year: 'o' }
  ])('catches invalid start and end dates: %j', async date => {
    await Promise.all(
      ['HAVE_CONTRACT', 'IN_PROGRESS'].map(async hasContract => {
        await expect(
          SystemIntakeValidationSchema.contractDetails.validateAt(
            'contract.startDate',
            { contract: { hasContract, startDate: date } }
          )
        ).rejects.toThrow();
        await expect(
          SystemIntakeValidationSchema.contractDetails.validateAt(
            'contract.endDate',
            { contract: { hasContract, endDate: date } }
          )
        ).rejects.toThrow();
      })
    );
  });
});
