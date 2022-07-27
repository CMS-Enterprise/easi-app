import { SendFeedbackEmailInput } from './graphql-global-types';

export type SendFeedbackOptionsFieldKey = Extract<
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

// todo rename, named with text but doesn't actually have it
export type SendFeedbackOptionsWithTextFieldKey = Extract<
  keyof SendFeedbackEmailInput,
  | 'easiServicesUsed'
  | 'systemEasyToUse'
  | 'didntNeedHelpAnswering'
  | 'questionsWereRelevant'
  | 'hadAccessToInformation'
>;

export interface SendFeedbackOptionsWithTextFields
  extends Pick<SendFeedbackEmailInput, SendFeedbackOptionsWithTextFieldKey> {
  easiServicesUsedAdditionalText: string;
  systemEasyToUseAdditionalText: string;
  didntNeedHelpAnsweringAdditionalText: string;
  questionsWereRelevantAdditionalText: string;
  hadAccessToInformationAdditionalText: string;
}

export type SendFeedbackEmailForm = SendFeedbackEmailInput &
  SendFeedbackOptionsWithTextFields;
