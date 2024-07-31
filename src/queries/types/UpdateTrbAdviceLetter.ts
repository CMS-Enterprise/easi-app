/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBAdviceLetterInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbAdviceLetter
// ====================================================

export interface UpdateTrbAdviceLetter_updateTRBAdviceLetter_recommendations {
  __typename: "TRBAdviceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface UpdateTrbAdviceLetter_updateTRBAdviceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface UpdateTrbAdviceLetter_updateTRBAdviceLetter {
  __typename: "TRBAdviceLetter";
  id: UUID;
  meetingSummary: HTML | null;
  nextSteps: HTML | null;
  isFollowupRecommended: boolean | null;
  dateSent: Time | null;
  followupPoint: string | null;
  /**
   * List of recommendations in the order specified by users
   */
  recommendations: UpdateTrbAdviceLetter_updateTRBAdviceLetter_recommendations[];
  author: UpdateTrbAdviceLetter_updateTRBAdviceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface UpdateTrbAdviceLetter {
  updateTRBAdviceLetter: UpdateTrbAdviceLetter_updateTRBAdviceLetter;
}

export interface UpdateTrbAdviceLetterVariables {
  input: UpdateTRBAdviceLetterInput;
}
