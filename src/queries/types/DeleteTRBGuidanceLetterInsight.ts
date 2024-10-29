/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTRBGuidanceLetterInsight
// ====================================================

export interface DeleteTRBGuidanceLetterInsight_deleteTRBGuidanceLetterRecommendation {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface DeleteTRBGuidanceLetterInsight {
  deleteTRBGuidanceLetterRecommendation: DeleteTRBGuidanceLetterInsight_deleteTRBGuidanceLetterRecommendation;
}

export interface DeleteTRBGuidanceLetterInsightVariables {
  id: UUID;
}
