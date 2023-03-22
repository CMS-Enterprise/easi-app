/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTrbAdviceLetter
// ====================================================

export interface CreateTrbAdviceLetter_createTRBAdviceLetter_recommendations {
  __typename: "TRBAdviceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: string;
  links: string[];
}

export interface CreateTrbAdviceLetter_createTRBAdviceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface CreateTrbAdviceLetter_createTRBAdviceLetter {
  __typename: "TRBAdviceLetter";
  id: UUID;
  meetingSummary: string | null;
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  dateSent: Time | null;
  followupPoint: string | null;
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
