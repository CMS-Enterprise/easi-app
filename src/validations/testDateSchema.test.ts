import { TestDateValidationSchema } from './testDateSchema';

describe('test date validation', () => {
  ['101.1', '234', '1000000', '-1', '-0.1'].forEach(value => {
    it(`requires a score to be a number within 0 and 100: ${value}`, async () => {
      const result = await TestDateValidationSchema.validateAt('score', {
        score: { isPresent: true, value }
      }).catch(err => {
        return err;
      });

      expect(result.errors).toEqual([
        'The test score must be no less than 0 and no more than 100'
      ]);
    });

    ['0', '1', '55', '56.78', '100'].forEach(valid => {
      it(`accepts a valid test score: ${valid}`, async () => {
        const result = await TestDateValidationSchema.validateAt('score', {
          score: { isPresent: true, value: valid }
        }).catch(err => {
          return err;
        });

        expect(result.errors).toBeUndefined();
      });
    });
  });
});
