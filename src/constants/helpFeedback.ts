import {
  SendFeedbackOptionFieldForTextInputKey,
  SendFeedbackOptionFieldKey
} from 'types/helpFeedback';

/** Field names with this suffix are not part of the backend form input data. */
export const ADDITIONAL_TEXT_INPUT_SUFFIX = 'AdditionalText';

/**
 * Option value constants for some form options.
 * These values here are sent to the backend through the formik ui,
 * and are also referenced in `i18n/en-US/help.ts`.
 */
export const sendFeedbackOptions = {
  agree: 'Agree',
  didntFillForm: 'I didn’t fill out a form in EASi',
  disagree: 'Disagree',
  dissatisfied: 'Dissatisfied',
  help: 'Help',
  imNotSure: 'I’m not sure',
  itGovernance: 'IT Governance',
  neutral: 'Neutral',
  no: 'No',
  other: 'Other',
  satisfied: 'Satisfied',
  section508: 'Section 508',
  systems: 'Systems',
  veryDissatisfied: 'Very dissatisfied',
  verySatisfied: 'Very satisfied',
  yes: 'Yes'
} as const;

export type SendFeedbackOptionKey = keyof typeof sendFeedbackOptions;

export const easiServiceOptionKeys: Readonly<SendFeedbackOptionKey[]> = [
  'itGovernance',
  'section508',
  'systems',
  'help',
  'other'
] as const;

export const sendFeedbackOptionFields: Record<
  SendFeedbackOptionFieldKey,
  Readonly<SendFeedbackOptionKey[]>
> = {
  isAnonymous: ['yes', 'no'],
  canBeContacted: ['yes', 'no'],
  easiServicesUsed: ['itGovernance', 'section508', 'systems', 'help', 'other'],
  systemEasyToUse: ['agree', 'disagree', 'imNotSure'],
  didntNeedHelpAnswering: ['agree', 'disagree', 'didntFillForm', 'imNotSure'],
  questionsWereRelevant: ['agree', 'disagree', 'didntFillForm', 'imNotSure'],
  hadAccessToInformation: ['agree', 'disagree', 'didntFillForm', 'imNotSure'],
  howSatisfied: [
    'verySatisfied',
    'satisfied',
    'neutral',
    'dissatisfied',
    'veryDissatisfied'
  ]
} as const;

/**
 * Option group fields with associated optional text input fields.
 * These are the option value keys associated to their original fields.
 * Selecting the option indicates the additional text input field is in use.
 */
export const sendFeedbackOptionFieldsForTextInput: Record<
  SendFeedbackOptionFieldForTextInputKey,
  SendFeedbackOptionKey
> = {
  easiServicesUsed: 'other',
  systemEasyToUse: 'imNotSure',
  didntNeedHelpAnswering: 'imNotSure',
  questionsWereRelevant: 'imNotSure',
  hadAccessToInformation: 'imNotSure'
} as const;
