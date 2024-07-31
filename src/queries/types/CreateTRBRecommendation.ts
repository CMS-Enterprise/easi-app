/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdviceLetterRecommendationInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBRecommendation
// ====================================================

export interface CreateTRBRecommendation_createTRBAdviceLetterRecommendation {
  __typename: "TRBAdviceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface CreateTRBRecommendation {
  createTRBAdviceLetterRecommendation: CreateTRBRecommendation_createTRBAdviceLetterRecommendation;
}

export interface CreateTRBRecommendationVariables {
  input: CreateTRBAdviceLetterRecommendationInput;
}
