/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTRBGuidanceLetterInsights
// ====================================================

export interface GetTRBGuidanceLetterInsights_trbRequest_guidanceLetter_insights {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface GetTRBGuidanceLetterInsights_trbRequest_guidanceLetter {
  __typename: "TRBGuidanceLetter";
  /**
   * List of recommendations in the order specified by users
   */
  insights: GetTRBGuidanceLetterInsights_trbRequest_guidanceLetter_insights[];
}

export interface GetTRBGuidanceLetterInsights_trbRequest {
  __typename: "TRBRequest";
  guidanceLetter: GetTRBGuidanceLetterInsights_trbRequest_guidanceLetter | null;
}

export interface GetTRBGuidanceLetterInsights {
  trbRequest: GetTRBGuidanceLetterInsights_trbRequest;
}

export interface GetTRBGuidanceLetterInsightsVariables {
  id: UUID;
}
