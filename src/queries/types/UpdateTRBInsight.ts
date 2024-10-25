/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBGuidanceLetterInsightInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTRBInsight
// ====================================================

export interface UpdateTRBInsight_updateTRBGuidanceLetterInsight {
  __typename: "TRBGuidanceLetterInsight";
  id: UUID;
  title: string;
  insight: HTML;
  links: string[];
}

export interface UpdateTRBInsight {
  updateTRBGuidanceLetterInsight: UpdateTRBInsight_updateTRBGuidanceLetterInsight;
}

export interface UpdateTRBInsightVariables {
  input: UpdateTRBGuidanceLetterInsightInput;
}
