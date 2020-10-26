export type ActionType = 'SUBMIT' | 'NOT_IT_REQUEST' | 'NEED_BIZ_CASE';

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
