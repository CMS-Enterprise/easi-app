/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTrbGuidanceLetter
// ====================================================

export interface CreateTrbGuidanceLetter_createTRBGuidanceLetter_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface CreateTrbGuidanceLetter_createTRBGuidanceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface CreateTrbGuidanceLetter_createTRBGuidanceLetter {
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
  recommendations: CreateTrbGuidanceLetter_createTRBGuidanceLetter_recommendations[];
  author: CreateTrbGuidanceLetter_createTRBGuidanceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface CreateTrbGuidanceLetter {
  createTRBGuidanceLetter: CreateTrbGuidanceLetter_createTRBGuidanceLetter;
}

export interface CreateTrbGuidanceLetterVariables {
  trbRequestId: UUID;
}
