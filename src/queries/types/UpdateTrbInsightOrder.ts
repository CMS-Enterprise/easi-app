/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBGuidanceLetterInsightOrderInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbInsightOrder
// ====================================================

export interface UpdateTrbInsightOrder_updateTRBGuidanceLetterInsightOrder {
  __typename: "TRBGuidanceLetterInsight";
  id: UUID;
  title: string;
  insight: HTML;
  links: string[];
}

export interface UpdateTrbInsightOrder {
  updateTRBGuidanceLetterInsightOrder: UpdateTrbInsightOrder_updateTRBGuidanceLetterInsightOrder[];
}

export interface UpdateTrbInsightOrderVariables {
  input: UpdateTRBGuidanceLetterInsightOrderInput;
}
