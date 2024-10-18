/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBGuidanceLetterRecommendationOrderInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRecommendationOrder
// ====================================================

export interface UpdateTrbRecommendationOrder_updateTRBGuidanceLetterRecommendationOrder {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface UpdateTrbRecommendationOrder {
  updateTRBGuidanceLetterRecommendationOrder: UpdateTrbRecommendationOrder_updateTRBGuidanceLetterRecommendationOrder[];
}

export interface UpdateTrbRecommendationOrderVariables {
  input: UpdateTRBGuidanceLetterRecommendationOrderInput;
}
