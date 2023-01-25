/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TRBAdviceLetter
// ====================================================

export interface TRBAdviceLetter {
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
