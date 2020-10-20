type ActionType = 'SUBMIT';

export type Action = {
  intakeId: string;
  actionType: ActionType;
};

export type ActionState = {
  isPosting: boolean;
  error?: any;
};

export type ActionForm = {
  feedback: string;
};
