/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddGRTFeedbackInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: AddGRTFeedbackRequestBizCase
// ====================================================

export interface AddGRTFeedbackRequestBizCase_addGRTFeedbackAndRequestBusinessCase {
  __typename: "AddGRTFeedbackPayload";
  id: UUID | null;
}

export interface AddGRTFeedbackRequestBizCase {
  /**
   * Used for IT Gov v1 workflow; for v2, use createSystemIntakeActionProgressToNewStep
   */
  addGRTFeedbackAndRequestBusinessCase: AddGRTFeedbackRequestBizCase_addGRTFeedbackAndRequestBusinessCase | null;
}

export interface AddGRTFeedbackRequestBizCaseVariables {
  input: AddGRTFeedbackInput;
}
