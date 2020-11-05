export type ActionType =
  | 'SUBMIT_INTAKE'
  | 'NOT_IT_REQUEST'
  | 'NEED_BIZ_CASE'
  | 'READY_FOR_GRT'
  | 'READY_FOR_GRB'
  | 'PROVIDE_FEEDBACK_NEED_BIZ_CASE'
  | 'BIZ_CASE_NEEDS_CHANGES'
  | 'SUBMIT_BIZ_CASE'
  | 'PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT'
  | 'PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL'
  | 'ISSUE_LCID';

export type Action = {
  intakeId: string;
  actionType: ActionType;
  feedback?: string;
};

export type ActionState = {
  isPosting: boolean;
  error?: any;
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
  feedback?: string;
};
