import { FormattedFundingSource } from 'types/systemIntake';

import SystemIntakeValidationSchema, {
  FundingSourcesValidationSchema
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

describe('Funding sources form validation', () => {
  const fundingSources: FormattedFundingSource[] = [
    {
      projectNumber: '111111',
      investments: ['Fed Admin', 'ACA 3021']
    },
    {
      projectNumber: '222222',
      investments: ['HITECH Medicaid']
    }
  ];

  const newFundingSource: FormattedFundingSource = {
    projectNumber: '333333',
    investments: ['HITECH Medicare', 'Fed Admin', 'ACA 3021']
  };

  it('passes basic validation', async () => {
    await expect(
      FundingSourcesValidationSchema.isValid({
        fundingSources: [newFundingSource]
      })
    ).resolves.toBeTruthy();
  });

  it('validates funding number', async () => {
    // Empty funding number
    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [{ ...newFundingSource, projectNumber: '' }]
      })
    ).rejects.toThrow('Funding number must be exactly 6 digits');

    // Must be exactly 6 digits
    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [{ ...newFundingSource, projectNumber: '1' }]
      })
    ).rejects.toThrow('Funding number must be exactly 6 digits');

    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [{ ...newFundingSource, projectNumber: '1234567' }]
      })
    ).rejects.toThrow('Funding number must be exactly 6 digits');

    // Only accepts numbers
    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [{ ...newFundingSource, projectNumber: 'abcdef' }]
      })
    ).rejects.toThrow('Funding number can only contain digits');

    // Must be unique
    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [
          ...fundingSources,
          {
            ...newFundingSource,
            projectNumber: fundingSources[0].projectNumber
          }
        ]
      })
    ).rejects.toThrow('Funding number must be unique');
  });

  it('validates funding sources', async () => {
    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [{ ...newFundingSource, sources: [] }]
      })
    ).rejects.toThrow('Select a funding source');
  });
});
