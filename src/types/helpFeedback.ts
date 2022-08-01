import { SendFeedbackEmailInput } from './graphql-global-types';

/** All option selection fields  */
export type SendFeedbackOptionFieldKey = Extract<
  keyof SendFeedbackEmailInput,
  | 'isAnonymous'
  | 'canBeContacted'
  | 'easiServicesUsed'
  | 'systemEasyToUse'
  | 'didntNeedHelpAnswering'
  | 'questionsWereRelevant'
  | 'hadAccessToInformation'
  | 'howSatisfied'
>;

/** Selection field keys for associated text fields only */
export type SendFeedbackOptionFieldForTextInputKey = Extract<
  keyof SendFeedbackEmailInput,
  | 'easiServicesUsed'
  | 'systemEasyToUse'
  | 'didntNeedHelpAnswering'
  | 'questionsWereRelevant'
  | 'hadAccessToInformation'
>;

/** Form fields with associated additional text fields */
export interface SendFeedbackOptionFieldsWithTextInput
  extends Pick<SendFeedbackEmailInput, SendFeedbackOptionFieldForTextInputKey> {
  easiServicesUsedAdditionalText: string;
  systemEasyToUseAdditionalText: string;
  didntNeedHelpAnsweringAdditionalText: string;
  questionsWereRelevantAdditionalText: string;
  hadAccessToInformationAdditionalText: string;
}

/** The final form with all ui fields */
export type SendFeedbackEmailForm = SendFeedbackEmailInput &
  SendFeedbackOptionFieldsWithTextInput;
