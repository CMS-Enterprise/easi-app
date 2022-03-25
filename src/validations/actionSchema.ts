import { DateTime } from 'luxon';
import * as Yup from 'yup';

export const actionSchema = Yup.object().shape({
  feedback: Yup.string().required('Please fill out email')
});

const sharedValidDateSchema = Yup.object().shape({
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
    .min(new Date().getFullYear(), 'Date cannot be in the past')
    .required('Please include a year'),
  validDate: Yup.string().when(
    ['expirationDateMonth', 'expirationDateDay', 'expirationDateYear'],
    {
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
    }
  )
});

export const lifecycleIdSchema = sharedValidDateSchema.shape({
  scope: Yup.string().trim().required('Please include a scope'),
  nextSteps: Yup.string().trim().required('Please fill out next steps'),
  feedback: Yup.string().trim().required('Please fill out email'),
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

export const extendLifecycleIdSchema = sharedValidDateSchema.shape({
  newScope: Yup.string().trim().required('Please include a scope'),
  newNextSteps: Yup.string().trim().required('Please fill out next steps')
});

export const rejectIntakeSchema = Yup.object().shape({
  nextSteps: Yup.string().trim().required('Please include next steps'),
  reason: Yup.string().trim().required('Please include a reason'),
  feedback: Yup.string().trim().required('Please fill out email')
});

export const provideGRTFeedbackSchema = Yup.object().shape({
  grtFeedback: Yup.string()
    .trim()
    .required('Please include feedback for the business owner'),
  emailBody: Yup.string().trim().required('Please fill out email')
});
