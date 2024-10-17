/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBGuidanceLetterRecommendationInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBRecommendation
// ====================================================

export interface CreateTRBRecommendation_createTRBGuidanceLetterRecommendation {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface CreateTRBRecommendation {
  createTRBGuidanceLetterRecommendation: CreateTRBRecommendation_createTRBGuidanceLetterRecommendation;
}

export interface CreateTRBRecommendationVariables {
  input: CreateTRBGuidanceLetterRecommendationInput;
}
