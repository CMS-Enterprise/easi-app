import { DateTime } from 'luxon';
import * as Yup from 'yup';

export const actionSchema = Yup.object().shape({
  feedback: Yup.string().required('Please fill out email')
});

export const lifecycleIdSchema = Yup.object().shape({
  expirationDateDay: Yup.string()
    .trim()
    .length(2)
    .required('Please include a day'),
  expirationDateMonth: Yup.string()
    .trim()
    .length(2)
    .required('Please include a month'),
  expirationDateYear: Yup.string()
    .trim()
    .length(4)
    .required('Please include a year'),
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

export const extendLifecycleIdSchema = Yup.object().shape({
  newExpirationMonth: Yup.string().trim().required('Please include a month'),
  newExpirationDay: Yup.string().trim().required('Please include a day'),
  newExpirationYear: Yup.string().trim().required('Please include a year'),
  validDate: Yup.string().when(
    [
      'newExpirationMonth',
      'newExpirationDay',
      'newExpirationYear',
      'currentExpiresAt'
    ],
    {
      is: (
        newExpirationMonth: string,
        newExpirationDay: string,
        newExpirationYear: string,
        currentExpiresAt: string
      ) => {
        const newExpiration = DateTime.fromObject({
          month: Number(newExpirationMonth) || 0,
          day: Number(newExpirationDay) || 0,
          year: Number(newExpirationYear) || 0
        });

        const oldExpiration = DateTime.fromISO(currentExpiresAt) || 0;
        if (
          newExpiration.isValid &&
          newExpiration.toMillis() > oldExpiration.toMillis()
        ) {
          return true;
        }
        return false;
      },
      otherwise: Yup.string().test(
        'validDate',
        'Enter a valid expiration date that is later than the current expiration date',
        () => false
      )
    }
  )
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
