/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrbRecommendations
// ====================================================

export interface GetTrbRecommendations_trbRequest_adviceLetter_recommendations {
  __typename: "TRBAdviceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: string;
  links: string[];
}

export interface GetTrbRecommendations_trbRequest_adviceLetter {
  __typename: "TRBAdviceLetter";
  recommendations: GetTrbRecommendations_trbRequest_adviceLetter_recommendations[];
}

export interface GetTrbRecommendations_trbRequest {
  __typename: "TRBRequest";
  adviceLetter: GetTrbRecommendations_trbRequest_adviceLetter | null;
}

export interface GetTrbRecommendations {
  trbRequest: GetTrbRecommendations_trbRequest;
}

export interface GetTrbRecommendationsVariables {
  id: UUID;
}
