/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddGRTFeedbackInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: AddGRTFeedbackProgressToFinal
// ====================================================

export interface AddGRTFeedbackProgressToFinal_addGRTFeedbackAndProgressToFinalBusinessCase {
  __typename: "AddGRTFeedbackPayload";
  id: UUID | null;
}

export interface AddGRTFeedbackProgressToFinal {
  /**
   * Used for IT Gov v1 workflow; for v2, use createSystemIntakeActionProgressToNewStep
   */
  addGRTFeedbackAndProgressToFinalBusinessCase: AddGRTFeedbackProgressToFinal_addGRTFeedbackAndProgressToFinalBusinessCase | null;
}

export interface AddGRTFeedbackProgressToFinalVariables {
  input: AddGRTFeedbackInput;
}
