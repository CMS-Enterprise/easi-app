/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTrbAdviceLetter
// ====================================================

export interface CreateTrbAdviceLetter_createTRBAdviceLetter_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface CreateTrbAdviceLetter_createTRBAdviceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface CreateTrbAdviceLetter_createTRBAdviceLetter {
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
  recommendations: CreateTrbAdviceLetter_createTRBAdviceLetter_recommendations[];
  author: CreateTrbAdviceLetter_createTRBAdviceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface CreateTrbAdviceLetter {
  createTRBAdviceLetter: CreateTrbAdviceLetter_createTRBAdviceLetter;
}

export interface CreateTrbAdviceLetterVariables {
  trbRequestId: UUID;
}
