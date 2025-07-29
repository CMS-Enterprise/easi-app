import { FormattedFundingSource } from 'types/systemIntake';

import FundingSourceValidationSchema from './fundingSources';

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

  it('errors on empty fields', async () => {
    await expect(
      FundingSourceValidationSchema.validate({
        ...fundingSource,
        projectNumber: ''
      })
    ).rejects.toThrow('Project number is a required field');

    await expect(
      FundingSourceValidationSchema.validate({
        ...fundingSource,
        investments: []
      })
    ).rejects.toThrow('Select an investment');
  });

  describe('project number', () => {
    it('accepts a comma-separated list of project numbers', async () => {
      await expect(
        FundingSourceValidationSchema.validate({
          ...fundingSource,
          projectNumber: '123456,789012'
        })
      ).resolves.toBeTruthy();
    });

    it('throws error on non-numeric characters', async () => {
      // Single project number
      await expect(
        FundingSourceValidationSchema.validate({
          ...fundingSource,
          projectNumber: '12345a'
        })
      ).rejects.toThrow('Project number(s) can only contain digits');

      // Comma-separated list
      await expect(
        FundingSourceValidationSchema.validate({
          ...fundingSource,
          projectNumber: '123456,789012a'
        })
      ).rejects.toThrow('Project number(s) can only contain digits');
    });

    it('validates string length', async () => {
      // Single project number
      await expect(
        FundingSourceValidationSchema.validate({
          ...fundingSource,
          projectNumber: '12345'
        })
      ).rejects.toThrow('Project number(s) must be exactly 6 digits');

      // Comma-separated list
      await expect(
        FundingSourceValidationSchema.validate({
          ...fundingSource,
          projectNumber: '123456,7890'
        })
      ).rejects.toThrow('Project number(s) must be exactly 6 digits');
    });

    it('ignores whitespace', async () => {
      await expect(
        FundingSourceValidationSchema.validate({
          ...fundingSource,
          projectNumber: ' 789012   '
        })
      ).resolves.toBeTruthy();

      await expect(
        FundingSourceValidationSchema.validate({
          ...fundingSource,
          projectNumber: '123456, 789012'
        })
      ).resolves.toBeTruthy();
    });

    it('ignores trailing commas', async () => {
      await expect(
        FundingSourceValidationSchema.validate({
          ...fundingSource,
          projectNumber: '123456,'
        })
      ).resolves.toBeTruthy();
    });

    it('only accepts unique project numbers', async () => {
      // Errors on duplicate project number
      await expect(
        FundingSourceValidationSchema.validate(fundingSource, {
          context: { initialProjectNumbers: [fundingSource.projectNumber] }
        })
      ).rejects.toThrow(
        'Project number has already been added to this request'
      );

      // Accepts existing project number as part of comma-separated list
      await expect(
        FundingSourceValidationSchema.validate(
          {
            ...fundingSource,
            projectNumber: '123456,789012'
          },
          {
            context: { initialProjectNumbers: ['123456'] }
          }
        )
      ).resolves.toBeTruthy();
    });
  });
});
