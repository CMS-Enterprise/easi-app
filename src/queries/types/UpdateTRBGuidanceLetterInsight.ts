/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBGuidanceLetterRecommendationInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTRBGuidanceLetterInsight
// ====================================================

export interface UpdateTRBGuidanceLetterInsight_updateTRBGuidanceLetterRecommendation {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface UpdateTRBGuidanceLetterInsight {
  updateTRBGuidanceLetterRecommendation: UpdateTRBGuidanceLetterInsight_updateTRBGuidanceLetterRecommendation;
}

export interface UpdateTRBGuidanceLetterInsightVariables {
  input: UpdateTRBGuidanceLetterRecommendationInput;
}
