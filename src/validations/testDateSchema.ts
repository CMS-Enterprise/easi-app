import { DateTime } from 'luxon';
import * as Yup from 'yup';

const scoreRegex = /\d*\.?\d/;
// eslint-disable-next-line import/prefer-default-export
export const TestDateValidationSchema: any = Yup.object().shape({
  testType: Yup.string().nullable().required('Select the type of test'),
  dateMonth: Yup.string().trim().required('Please include a month'),
  dateDay: Yup.string().trim().required('Please include a day'),
  dateYear: Yup.string().trim().length(4).required('Please include a year'),
  validDate: Yup.string().when(['dateDay', 'dateMonth', 'dateYear'], {
    is: (dateDay: string, dateMonth: string, dateYear: string) => {
      // Only check for a valid date if month, day, and year are filled
      if (dateDay && dateMonth && dateYear) {
        // If the date is valid, it passes the validation
        return DateTime.fromObject({
          month: Number(dateMonth) || 0,
          day: Number(dateDay) || 0,
          year: Number(dateYear) || 0
        }).isValid;
      }
      // If month, day, and year aren't ALL filled, don't run the validation
      return true;
    },
    otherwise: Yup.string().test(
      'validateDate',
      'The test date must be a real date',
      () => false
    )
  }),
  score: Yup.object().shape({
    isPresent: Yup.boolean()
      .nullable()
      .required('Select Yes or No to indicate if the test has a score'),
    value: Yup.string().when('isPresent', {
      is: true,
      then: Yup.string()
        .trim()
        .required('Enter a test score')
        .matches(scoreRegex, 'The test score must be a number, like 85.5')
        .test(
          'score',
          'The test score must be no less than 0 and no more than 100',
          number => {
            const float = parseFloat(number);
            return float >= 0 && float <= 100;
          }
        )
    })
  })
});
