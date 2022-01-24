import { DateTime } from 'luxon';

// When adding a new ActionType, please add its description in i18n/governanceReviewTeam/notes
export type ActionType =
  | 'SUBMIT_INTAKE'
  | 'NOT_IT_REQUEST'
  | 'NEED_BIZ_CASE'
  | 'READY_FOR_GRT'
  | 'READY_FOR_GRB'
  | 'PROVIDE_FEEDBACK_NEED_BIZ_CASE'
  | 'BIZ_CASE_NEEDS_CHANGES'
  | 'SUBMIT_BIZ_CASE'
  | 'SUBMIT_FINAL_BIZ_CASE'
  | 'PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT'
  | 'PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL'
  | 'NO_GOVERNANCE_NEEDED'
  | 'SEND_EMAIL'
  | 'GUIDE_RECEIVED_CLOSE'
  | 'NOT_RESPONDING_CLOSE'
  | 'ISSUE_LCID'
  | 'REJECT';

/**
 * Type for the POST Action request payload
 */
export type CreateActionPayload = {
  intakeId: string;
  actionType: ActionType;
  feedback?: string;
};

/**
 * Type for the GET Action request payload
 */
export type Action = {
  id: string;
  createdAt: DateTime;
  actorName: string;
  actorEuaUserId: string;
  intakeId: string;
  actionType: ActionType;
  feedback?: string;
};

/**
 * Type for Action Reducer State
 */
export type ActionState = {
  isPosting: boolean;
  error?: any;
  actions: Action[];
};

export type ActionForm = {
  feedback: string;
};

export type SubmitLifecycleIdForm = {
  newLifecycleId?: boolean;
  lifecycleId?: string;
  expirationDateMonth?: string;
  expirationDateDay?: string;
  expirationDateYear?: string;
  scope?: string;
  nextSteps?: string;
  costBaseline?: string;
  feedback?: string;
};

// TODO: look into combining the submit and extend LCID?
export type ExtendLifecycleIdForm = {
  expirationDateMonth?: string;
  expirationDateDay?: string;
  expirationDateYear?: string;
  scope?: string;
  nextSteps?: string;
  costBaseline?: string;
  // TODO: add feedback here?
};

export type RejectIntakeForm = {
  feedback: string;
  nextSteps: string;
  reason: string;
};

export type ProvideGRTFeedbackForm = {
  grtFeedback: string;
  emailBody: string;
};
