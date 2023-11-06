import i18next from 'i18next';
import { DateTime } from 'luxon';
import * as Yup from 'yup';

import {
  SystemIntakeStepToProgressTo,
  SystemIntakeTRBFollowUp
} from 'types/graphql-global-types';

const skippableEmail = Yup.string().when('shouldSendEmail', {
  is: false,
  then: schema => schema.optional(),
  otherwise: schema => schema.required('Please fill out email')
});

const notificationRecipients = Yup.object().shape({
  shouldNotifyITGovernance: Yup.boolean(),
  shouldNotifyITInvestment: Yup.boolean(),
  regularRecipientEmails: Yup.array().when(
    ['shouldNotifyITGovernance', 'shouldNotifyITInvestment', 'shouldSendEmail'],
    {
      is: (
        shouldNotifyITGovernance: boolean,
        shouldNotifyITInvestment: boolean,
        shouldSendEmail: boolean
      ) => {
        return (
          !shouldNotifyITGovernance &&
          !shouldNotifyITInvestment &&
          shouldSendEmail
        );
      },
      then: schema => schema.min(1, 'Please select a recipient'),
      otherwise: schema => schema.optional()
    }
  )
});

export const actionSchema = Yup.object().shape({
  notificationRecipients,
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
  notificationRecipients,
  feedback: skippableEmail,
  newLifecycleId: Yup.boolean().required(
    'Choose if you need a new Life Cycle ID or if you will use an existing Life Cycle ID'
  ),
  lifecycleId: Yup.string().when('newLifecycleId', {
    is: false,
    then: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z]?[0-9]{6}$/,
        'Must be 6 digits with optional preceding letter'
      )
      .required('Please enter the existing Life Cycle ID')
  })
});

export const rejectIntakeSchema = Yup.object().shape({
  nextSteps: Yup.string().trim().required('Please include next steps'),
  reason: Yup.string().trim().required('Please include a reason'),
  feedback: skippableEmail,
  notificationRecipients
});

export const provideGRTFeedbackSchema = Yup.object().shape({
  notificationRecipients,
  grtFeedback: Yup.string()
    .trim()
    .required('Please include feedback for the business owner'),
  emailBody: skippableEmail
});

/** Checks that expiration date is valid and in the future */
const validExpirationDate = () =>
  Yup.string()
    .nullable()
    .test('expiresAt', 'Date cannot be in the past', value => {
      if (!value) return true;
      return DateTime.fromISO(value) >= DateTime.local().startOf('day');
    });

export const confirmLcidSchema = Yup.object().shape({
  expiresAt: validExpirationDate().required('Please enter a valid date'),
  scope: Yup.string().required('Please fill in the blank'),
  nextSteps: Yup.string().required('Please fill in the blank'),
  trbFollowUp: Yup.mixed<SystemIntakeTRBFollowUp>()
    .oneOf(Object.values(SystemIntakeTRBFollowUp))
    .required('Please make a selection')
});

export const issueLcidSchema = confirmLcidSchema.shape({
  useExistingLcid: Yup.boolean().required('Please make a selection'),
  lcid: Yup.string().when('useExistingLcid', {
    is: true,
    then: Yup.string().required('Please select the existing Life Cycle ID')
  })
});

export const lcidActionSchema = (type: 'issue' | 'confirm') => {
  if (type === 'issue') {
    return issueLcidSchema;
  }
  return confirmLcidSchema;
};

export const updateLcidSchema = Yup.object().shape({
  expiresAt: validExpirationDate()
});

export const retireLcidSchema = Yup.object().shape({
  retiresAt: Yup.date()
    .required('Please enter a valid date')
    .nullable()
    .typeError('Please enter a valid date'),
  reason: Yup.string()
});

export const expireLcidSchema = Yup.object().shape({
  reason: Yup.string().required('Please fill in the blank'),
  nextSteps: Yup.string()
});

export const notApprovedSchema = Yup.object().shape({
  reason: Yup.string().required('Please fill in the blank'),
  nextSteps: Yup.string().required('Please fill in the blank'),
  trbFollowUp: Yup.mixed<SystemIntakeTRBFollowUp>()
    .oneOf(Object.values(SystemIntakeTRBFollowUp))
    .required('Please make a selection')
});

export const progressToNewStepSchema = (
  currentStep: SystemIntakeStepToProgressTo | undefined
) => {
  const currentStepLabel = i18next.t(`action:progressToNewStep.${currentStep}`);

  return Yup.object().shape({
    newStep: Yup.mixed<SystemIntakeStepToProgressTo>()
      .oneOf(
        // Filter current step out of valid options
        Object.values(SystemIntakeStepToProgressTo).filter(
          option => option !== currentStep
        ),
        ({ value }) => {
          // Error if selected value is current step
          if (value !== currentStep) return 'Please select a valid next step.';
          return `This request is already at the ${currentStepLabel} step. Please select a different step.`;
        }
      )
      .required('Please make a selection'),
    // Meeting date required if new step is GRB or GRT meeting
    meetingDate: Yup.date().when('newStep', {
      is: (val: SystemIntakeStepToProgressTo) =>
        [
          SystemIntakeStepToProgressTo.GRT_MEETING,
          SystemIntakeStepToProgressTo.GRB_MEETING
        ].includes(val),
      then: Yup.date()
        .required('Please enter a valid date')
        .nullable()
        .typeError('Please enter a valid date')
    }),
    feedback: Yup.string(),
    grbRecommendations: Yup.string()
  });
};
