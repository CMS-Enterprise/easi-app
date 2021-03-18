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
  addGRTFeedbackAndProgressToFinalBusinessCase: AddGRTFeedbackProgressToFinal_addGRTFeedbackAndProgressToFinalBusinessCase | null;
}

export interface AddGRTFeedbackProgressToFinalVariables {
  input: AddGRTFeedbackInput;
}
