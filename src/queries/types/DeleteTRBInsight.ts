/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTRBInsight
// ====================================================

export interface DeleteTRBInsight_deleteTRBGuidanceLetterInsight {
  __typename: "TRBGuidanceLetterInsight";
  id: UUID;
  title: string;
  insight: HTML;
  links: string[];
}

export interface DeleteTRBInsight {
  deleteTRBGuidanceLetterInsight: DeleteTRBInsight_deleteTRBGuidanceLetterInsight;
}

export interface DeleteTRBInsightVariables {
  id: UUID;
}
