/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTRBRecommendation
// ====================================================

export interface DeleteTRBRecommendation_deleteTRBAdviceLetterRecommendation {
  __typename: "TRBAdviceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: string;
  links: string[];
}

export interface DeleteTRBRecommendation {
  deleteTRBAdviceLetterRecommendation: DeleteTRBRecommendation_deleteTRBAdviceLetterRecommendation;
}

export interface DeleteTRBRecommendationVariables {
  id: UUID;
}
