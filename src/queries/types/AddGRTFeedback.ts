/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddGRTFeedbackInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: AddGRTFeedback
// ====================================================

export interface AddGRTFeedback_addGRTFeedback {
  __typename: "AddGRTFeedbackPayload";
  id: UUID | null;
}

export interface AddGRTFeedback {
  addGRTFeedback: AddGRTFeedback_addGRTFeedback | null;
}

export interface AddGRTFeedbackVariables {
  input: AddGRTFeedbackInput;
}
