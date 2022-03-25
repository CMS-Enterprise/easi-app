import { BusinessCaseDraftValidationSchema } from './businessCaseSchema';

describe('Draft Business Case schema validation', () => {
  ['1234567890', '123-456-7890'].forEach(value => {
    it(`accepts valid phone number: ${value}`, async () => {
      const result = await BusinessCaseDraftValidationSchema.generalRequestInfo
        .validateAt('requester.phoneNumber', {
          requester: {
            phoneNumber: '1234567890'
          }
        })
        .catch((err: any) => {
          return err;
        });
      expect(result.errors).toBeUndefined();
    });
  });

  ['123456789', '123-456-789', 'asdf'].forEach(value => {
    it(`throws error for the following values: ${value}`, async () => {
      const result = await BusinessCaseDraftValidationSchema.generalRequestInfo
        .validateAt('requester.phoneNumber', {
          requester: {
            phoneNumber: value
          }
        })
        .catch((err: any) => {
          return err;
        });
      expect(result.errors).toEqual([
        'Enter the requester’s phone number like 1234567890 or 123-456-7890'
      ]);
    });
  });
});
