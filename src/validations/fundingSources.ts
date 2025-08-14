import * as Yup from 'yup';

/**
 * Validation schema for funding source data.
 *
 * Validates:
 * - Project Number: Required field that accepts single or comma-separated 6-digit strings
 * - Investments: At least one investment must be selected
 *
 * Project Number Rules:
 * - Each number must be exactly 6 digits
 * - Trailing commas and whitespace are ignored
 * - Must be unique within the request (uses React Hook Forms context to validate uniqueness)
 *
 * Examples:
 * - Valid: "123456", "123456,789012", "123456,"
 * - Invalid: "12345", "1234567", "123456,abc789"
 */
const FundingSourceValidationSchema = Yup.object({
  projectNumber: Yup.string()
    .trim()
    .required('Project number is a required field')
    .test('comma-separated-six-digits', (value: string | undefined, schema) => {
      if (!value) return false;

      // Split by comma, trim whitespace, and filter out empty strings
      // Accounts for trailing commas in comma-separated list
      const projectNumbers = value
        .split(',')
        .map(num => num.trim())
        .filter(num => num.length > 0);

      // Must be numerical
      const invalidCharacterType = projectNumbers.find(
        num => !/^\d+$/.test(num)
      );

      if (invalidCharacterType) {
        return schema.createError({
          message: 'Project number(s) can only contain digits'
        });
      }

      // Must be 6 digits long
      const invalidStringLength = projectNumbers.find(num => num.length !== 6);

      if (invalidStringLength) {
        return schema.createError({
          message: 'Project number(s) must be exactly 6 digits'
        });
      }

      return true;
    })
    .when('$initialProjectNumbers', (initialProjectNumbers: string[], schema) =>
      schema.test(
        'is-unique',
        'Project number has already been added to this request',
        (value: string) => !(initialProjectNumbers || []).includes(value)
      )
    ),
  investments: Yup.array().of(Yup.string()).min(1, 'Select an investment')
});

export default FundingSourceValidationSchema;
