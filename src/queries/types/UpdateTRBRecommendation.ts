/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBGuidanceLetterRecommendationInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTRBRecommendation
// ====================================================

export interface UpdateTRBRecommendation_updateTRBGuidanceLetterRecommendation {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface UpdateTRBRecommendation {
  updateTRBGuidanceLetterRecommendation: UpdateTRBRecommendation_updateTRBGuidanceLetterRecommendation;
}

export interface UpdateTRBRecommendationVariables {
  input: UpdateTRBGuidanceLetterRecommendationInput;
}
