import { FormattedFundingSource } from 'components/FundingSources';

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
      __typename: 'SystemIntakeFundingSource',
      id: '414c80dc-8f8a-4bed-9aa0-29342d860190',
      projectNumber: '111111',
      investments: ['Fed Admin', 'ACA 3021']
    },
    {
      __typename: 'SystemIntakeFundingSource',
      id: '00a5db89-d05b-49e1-b6ac-f6f21c5d0992',
      projectNumber: '222222',
      investments: ['HITECH Medicaid']
    }
  ];

  const newFundingSource: FormattedFundingSource = {
    __typename: 'SystemIntakeFundingSource',
    id: '75e52b6f-f120-48b2-b87d-137cfc0388b9',
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
        fundingSources: [{ ...newFundingSource, fundingNumber: '' }]
      })
    ).rejects.toThrow('Funding number must be exactly 6 digits');

    // Must be exactly 6 digits
    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [{ ...newFundingSource, fundingNumber: '1' }]
      })
    ).rejects.toThrow('Funding number must be exactly 6 digits');

    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [{ ...newFundingSource, fundingNumber: '1234567' }]
      })
    ).rejects.toThrow('Funding number must be exactly 6 digits');

    // Only accepts numbers
    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [{ ...newFundingSource, fundingNumber: 'abcdef' }]
      })
    ).rejects.toThrow('Funding number can only contain digits');

    // Must be unique
    await expect(
      FundingSourcesValidationSchema.validate({
        fundingSources: [
          ...fundingSources,
          {
            ...newFundingSource,
            fundingNumber: fundingSources[0].projectNumber
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
