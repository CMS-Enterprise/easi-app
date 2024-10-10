/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBGuidanceLetterRecommendationOrderInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRecommendationOrder
// ====================================================

export interface UpdateTrbRecommendationOrder_updateTRBAdviceLetterRecommendationOrder {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface UpdateTrbRecommendationOrder {
  updateTRBAdviceLetterRecommendationOrder: UpdateTrbRecommendationOrder_updateTRBAdviceLetterRecommendationOrder[];
}

export interface UpdateTrbRecommendationOrderVariables {
  input: UpdateTRBGuidanceLetterRecommendationOrderInput;
}
