/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrbInsights
// ====================================================

export interface GetTrbInsights_trbRequest_guidanceLetter_insights {
  __typename: "TRBGuidanceLetterInsight";
  id: UUID;
  title: string;
  insight: HTML;
  links: string[];
}

export interface GetTrbInsights_trbRequest_guidanceLetter {
  __typename: "TRBGuidanceLetter";
  /**
   * List of recommendations in the order specified by users
   */
  insights: GetTrbInsights_trbRequest_guidanceLetter_insights[];
}

export interface GetTrbInsights_trbRequest {
  __typename: "TRBRequest";
  guidanceLetter: GetTrbInsights_trbRequest_guidanceLetter | null;
}

export interface GetTrbInsights {
  trbRequest: GetTrbInsights_trbRequest;
}

export interface GetTrbInsightsVariables {
  id: UUID;
}
