/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBGuidanceLetterRecommendationOrderInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTRBGuidanceLetterInsightOrder
// ====================================================

export interface UpdateTRBGuidanceLetterInsightOrder_updateTRBGuidanceLetterRecommendationOrder {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface UpdateTRBGuidanceLetterInsightOrder {
  updateTRBGuidanceLetterRecommendationOrder: UpdateTRBGuidanceLetterInsightOrder_updateTRBGuidanceLetterRecommendationOrder[];
}

export interface UpdateTRBGuidanceLetterInsightOrderVariables {
  input: UpdateTRBGuidanceLetterRecommendationOrderInput;
}
