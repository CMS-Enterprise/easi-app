/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TRBAdviceLetter
// ====================================================

export interface TRBAdviceLetter_recommendations {
  __typename: "TRBAdviceLetterRecommendation";
  title: string;
  recommendation: string;
  links: string[];
}

export interface TRBAdviceLetter {
  __typename: "TRBAdviceLetter";
  id: UUID;
  meetingSummary: string | null;
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  dateSent: Time | null;
  followupPoint: string | null;
  recommendations: TRBAdviceLetter_recommendations[];
  createdBy: string;
  createdAt: Time;
  modifiedBy: string | null;
  modifiedAt: Time | null;
}
