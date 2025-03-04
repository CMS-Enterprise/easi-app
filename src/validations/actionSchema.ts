import {
  SystemIntakeStepToProgressTo,
  SystemIntakeTRBFollowUp
} from 'gql/generated/graphql';
import i18next from 'i18next';
import * as Yup from 'yup';

export const confirmLcidSchema = Yup.object().shape({
  expiresAt: Yup.date()
    .typeError('Please enter a valid date')
    .required('Please enter a valid date'),
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

export const lcidActionSchema = (lcidExists: boolean) => {
  return lcidExists ? confirmLcidSchema : issueLcidSchema;
};

export const updateLcidSchema = Yup.object().shape({
  expiresAt: Yup.date().typeError('Please enter a valid date')
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
    meetingDate: Yup.date().typeError('Please enter a valid date'),
    feedback: Yup.string(),
    grbRecommendations: Yup.string()
  });
};
