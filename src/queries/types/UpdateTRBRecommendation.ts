/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBAdviceLetterRecommendationInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTRBRecommendation
// ====================================================

export interface UpdateTRBRecommendation_updateTRBAdviceLetterRecommendation {
  __typename: "TRBAdviceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: string;
  links: string[];
}

export interface UpdateTRBRecommendation {
  updateTRBAdviceLetterRecommendation: UpdateTRBRecommendation_updateTRBAdviceLetterRecommendation;
}

export interface UpdateTRBRecommendationVariables {
  input: UpdateTRBAdviceLetterRecommendationInput;
}
