/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBGuidanceLetterInsightInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBInsight
// ====================================================

export interface CreateTRBInsight_createTRBGuidanceLetterInsight {
  __typename: "TRBGuidanceLetterInsight";
  id: UUID;
  title: string;
  insight: HTML;
  links: string[];
}

export interface CreateTRBInsight {
  createTRBGuidanceLetterInsight: CreateTRBInsight_createTRBGuidanceLetterInsight;
}

export interface CreateTRBInsightVariables {
  input: CreateTRBGuidanceLetterInsightInput;
}
