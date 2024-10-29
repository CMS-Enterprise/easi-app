/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBGuidanceLetterRecommendationInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBGuidanceLetterInsight
// ====================================================

export interface CreateTRBGuidanceLetterInsight_createTRBGuidanceLetterRecommendation {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface CreateTRBGuidanceLetterInsight {
  createTRBGuidanceLetterRecommendation: CreateTRBGuidanceLetterInsight_createTRBGuidanceLetterRecommendation;
}

export interface CreateTRBGuidanceLetterInsightVariables {
  input: CreateTRBGuidanceLetterRecommendationInput;
}
