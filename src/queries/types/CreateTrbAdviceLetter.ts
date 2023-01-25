/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTrbAdviceLetter
// ====================================================

export interface CreateTrbAdviceLetter_createTRBAdviceLetter {
  __typename: "TRBAdviceLetter";
  id: UUID;
  meetingSummary: string | null;
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  followupPoint: string | null;
  createdBy: string;
  createdAt: Time;
  modifiedBy: string | null;
  modifiedAt: Time | null;
}

export interface CreateTrbAdviceLetter {
  createTRBAdviceLetter: CreateTrbAdviceLetter_createTRBAdviceLetter;
}

export interface CreateTrbAdviceLetterVariables {
  trbRequestId: UUID;
}
