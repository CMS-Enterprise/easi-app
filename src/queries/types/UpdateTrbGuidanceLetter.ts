/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBGuidanceLetterInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbGuidanceLetter
// ====================================================

export interface UpdateTrbGuidanceLetter_updateTRBGuidanceLetter_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface UpdateTrbGuidanceLetter_updateTRBGuidanceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface UpdateTrbGuidanceLetter_updateTRBGuidanceLetter {
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
  recommendations: UpdateTrbGuidanceLetter_updateTRBGuidanceLetter_recommendations[];
  author: UpdateTrbGuidanceLetter_updateTRBGuidanceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface UpdateTrbGuidanceLetter {
  updateTRBGuidanceLetter: UpdateTrbGuidanceLetter_updateTRBGuidanceLetter;
}

export interface UpdateTrbGuidanceLetterVariables {
  input: UpdateTRBGuidanceLetterInput;
}
