import { SendReportAProblemEmailInput } from 'gql/generated/graphql';

import { SendFeedbackEmailInput } from 'types/graphql-global-types';

/** Field names with this suffix are not part of the backend form input data. */
export const ADDITIONAL_TEXT_INPUT_SUFFIX = 'AdditionalText';

/**
 * Option value constants for some form options.
 * This is shared between the "Send Feedback" and "Report A Problem" forms.
 * These values are sent to the backend through the formik ui,
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
  systems: 'Systems',
  veryDissatisfied: 'Very dissatisfied',
  verySatisfied: 'Very satisfied',
  yes: 'Yes',
  technicalAssistance: 'Technical Assistance',

  // Additional options for "Report A Problem"
  itPreventedMe: 'It prevented me from completing my task',
  itDelayedCompletion: 'It delayed completion of my task',
  itWasMinor: 'It was a minor annoyance'
} as const;

export type SendFeedbackOptionKey = keyof typeof sendFeedbackOptions;

export const easiServiceOptionKeys: Readonly<SendFeedbackOptionKey[]> = [
  'itGovernance',
  'technicalAssistance',
  'systems',
  'help',
  'other'
] as const;

/** Option enums for the "Send Feedback" form.  */
export const sendFeedbackOptionFields: Record<
  Extract<
    keyof SendFeedbackEmailInput,
    | 'isAnonymous'
    | 'canBeContacted'
    | 'easiServicesUsed'
    | 'systemEasyToUse'
    | 'didntNeedHelpAnswering'
    | 'questionsWereRelevant'
    | 'hadAccessToInformation'
    | 'howSatisfied'
  >,
  Readonly<SendFeedbackOptionKey[]>
> = {
  isAnonymous: ['yes', 'no'],
  canBeContacted: ['yes', 'no'],
  easiServicesUsed: easiServiceOptionKeys,
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

/** Original form fields of associated additional text fields */
export type SendFeedbackOptionFieldForTextInputKey = Extract<
  keyof SendFeedbackEmailInput,
  | 'easiServicesUsed'
  | 'systemEasyToUse'
  | 'didntNeedHelpAnswering'
  | 'questionsWereRelevant'
  | 'hadAccessToInformation'
>;

/**
 * Option group fields mapped to keys of values that are associated to
 * optional text input fields.
 * Selecting the option key indicates the additional text input field is in use.
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

/** Send Feedback ui form */
export interface SendFeedbackEmailForm extends SendFeedbackEmailInput {
  easiServicesUsedAdditionalText: string;
  systemEasyToUseAdditionalText: string;
  didntNeedHelpAnsweringAdditionalText: string;
  questionsWereRelevantAdditionalText: string;
  hadAccessToInformationAdditionalText: string;
}

// Report A Problem

/** Option enums for the "Report A Problem" form */
export const reportOptionFields: Record<
  Extract<
    keyof SendReportAProblemEmailInput,
    'isAnonymous' | 'canBeContacted' | 'easiService' | 'howSevereWasTheProblem'
  >,
  Readonly<SendFeedbackOptionKey[]>
> = {
  isAnonymous: ['yes', 'no'],
  canBeContacted: ['yes', 'no'],
  easiService: easiServiceOptionKeys,
  howSevereWasTheProblem: [
    'itPreventedMe',
    'itDelayedCompletion',
    'itWasMinor',
    'other'
  ]
} as const;

export type ReportOptionFieldForTextInputKey = Extract<
  keyof SendReportAProblemEmailInput,
  'easiService' | 'howSevereWasTheProblem'
>;

export const reportOptionFieldsForTextInput: Record<
  ReportOptionFieldForTextInputKey,
  SendFeedbackOptionKey
> = {
  easiService: 'other',
  howSevereWasTheProblem: 'other'
} as const;

/** Report A Problem ui form */
export interface SendReportAProblemEmailForm
  extends SendReportAProblemEmailInput {
  easiServiceAdditionalText: string;
  howSevereWasTheProblemAdditionalText: string;
}
