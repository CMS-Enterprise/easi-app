import { FormattedFundingSource } from 'types/systemIntake';

import SystemIntakeValidationSchema, {
  FundingSourceValidationSchema
} from './systemIntakeSchema';

describe('System intake validation', () => {
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

describe('Funding source form validation', () => {
  const fundingSource: FormattedFundingSource = {
    projectNumber: '333333',
    investments: ['HITECH Medicare', 'Fed Admin', 'ACA 3021']
  };

  it('passes basic validation', async () => {
    await expect(
      FundingSourceValidationSchema.isValid(fundingSource)
    ).resolves.toBeTruthy();
  });

  it('validates funding number', async () => {
    // Empty funding number
    await expect(
      FundingSourceValidationSchema.validate({
        ...fundingSource,
        projectNumber: ''
      })
    ).rejects.toThrow('Project number is required');

    // Must be exactly 6 digits
    await expect(
      FundingSourceValidationSchema.validate({
        ...fundingSource,
        projectNumber: '1'
      })
    ).rejects.toThrow('Project number must be exactly 6 digits');

    await expect(
      FundingSourceValidationSchema.validate({
        ...fundingSource,
        projectNumber: '1234567'
      })
    ).rejects.toThrow('Project number must be exactly 6 digits');

    // Only accepts numbers
    await expect(
      FundingSourceValidationSchema.validate({
        ...fundingSource,
        projectNumber: 'abcdef'
      })
    ).rejects.toThrow('Project number can only contain digits');

    // Must be unique
    await expect(
      FundingSourceValidationSchema.validate(fundingSource, {
        context: { initialProjectNumbers: [fundingSource.projectNumber] }
      })
    ).rejects.toThrow('Project number has already been added to this request');
  });

  it('validates investments', async () => {
    await expect(
      FundingSourceValidationSchema.validate({
        ...fundingSource,
        investments: []
      })
    ).rejects.toThrow('Select an investment');
  });
});
