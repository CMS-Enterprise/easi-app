import { DateTime } from 'luxon';
import * as Yup from 'yup';

const skippableEmail = Yup.string().when('skipEmail', {
  is: true,
  then: schema => schema.optional(),
  otherwise: schema => schema.required('Please fill out email')
});

export const actionSchema = Yup.object().shape({
  feedback: skippableEmail
});

export const sharedLifecycleIdSchema = Yup.object().shape({
  expirationDateMonth: Yup.number()
    .integer()
    .max(12, 'Please enter valid month')
    .required('Please include a month'),
  expirationDateDay: Yup.number()
    .integer()
    .max(31, 'Please enter valid day')
    .required('Please include a day'),
  expirationDateYear: Yup.number()
    .integer()
    .min(DateTime.local().year, 'Date cannot be in the past')
    .required('Please include a year'),
  validDate: Yup.string()
    .when(['expirationDateMonth', 'expirationDateDay', 'expirationDateYear'], {
      is: (
        expirationDateMonth: string,
        expirationDateDay: string,
        expirationDateYear: string
      ) => {
        const month = Number(expirationDateMonth);
        const day = Number(expirationDateDay);
        const year = Number(expirationDateYear);

        return (
          !(Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year)) &&
          DateTime.fromObject({
            month,
            day,
            year
          }).isValid
        );
      },
      otherwise: Yup.string().test(
        'validDate',
        'Enter a valid expiration date',
        () => false
      )
    })
    .when(['expirationDateMonth', 'expirationDateDay', 'expirationDateYear'], {
      is: (
        expirationDateMonth: string,
        expirationDateDay: string,
        expirationDateYear: string
      ) => {
        const month = Number(expirationDateMonth);
        const day = Number(expirationDateDay);
        const year = Number(expirationDateYear);

        return (
          !(Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year)) &&
          DateTime.fromObject({
            month,
            day,
            year
          }) > DateTime.local()
        );
      },
      otherwise: Yup.string().test(
        'validDate',
        'Enter a valid expiration date',
        () => false
      )
    }),
  scope: Yup.string().trim().required('Please include a scope'),
  nextSteps: Yup.string().trim().required('Please fill out next steps')
});

export const lifecycleIdSchema = sharedLifecycleIdSchema.shape({
  feedback: skippableEmail,
  newLifecycleId: Yup.boolean().required(
    'Choose if you need a new Lifecycle ID or if you will use an existing Lifecycle ID'
  ),
  lifecycleId: Yup.string().when('newLifecycleId', {
    is: false,
    then: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z]?[0-9]{6}$/,
        'Must be 6 digits with optional preceding letter'
      )
      .required('Please enter the existing Lifecycle ID')
  })
});

export const rejectIntakeSchema = Yup.object().shape({
  nextSteps: Yup.string().trim().required('Please include next steps'),
  reason: Yup.string().trim().required('Please include a reason'),
  feedback: skippableEmail
});

export const provideGRTFeedbackSchema = Yup.object().shape({
  grtFeedback: Yup.string()
    .trim()
    .required('Please include feedback for the business owner'),
  emailBody: skippableEmail
});
