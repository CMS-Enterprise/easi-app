/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrbRecommendations
// ====================================================

export interface GetTrbRecommendations_trbRequest_guidanceLetter_insights {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface GetTrbRecommendations_trbRequest_guidanceLetter {
  __typename: "TRBGuidanceLetter";
  /**
   * List of recommendations in the order specified by users
   */
  insights: GetTrbRecommendations_trbRequest_guidanceLetter_insights[];
}

export interface GetTrbRecommendations_trbRequest {
  __typename: "TRBRequest";
  guidanceLetter: GetTrbRecommendations_trbRequest_guidanceLetter | null;
}

export interface GetTrbRecommendations {
  trbRequest: GetTrbRecommendations_trbRequest;
}

export interface GetTrbRecommendationsVariables {
  id: UUID;
}
