/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TRBAdviceLetter
// ====================================================

export interface TRBAdviceLetter_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface TRBAdviceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface TRBAdviceLetter {
  __typename: "TRBGuidanceLetter";
  id: UUID;
  meetingSummary: HTML | null;
  nextSteps: HTML | null;
  isFollowupRecommended: boolean | null;
  dateSent: Time | null;
  followupPoint: string | null;
  /**
   * List of recommendations in the order specified by users
   */
  recommendations: TRBAdviceLetter_recommendations[];
  author: TRBAdviceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}
