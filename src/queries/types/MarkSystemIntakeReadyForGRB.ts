/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddGRTFeedbackInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: MarkSystemIntakeReadyForGRB
// ====================================================

export interface MarkSystemIntakeReadyForGRB_markSystemIntakeReadyForGRB {
  __typename: "AddGRTFeedbackPayload";
  id: UUID | null;
}

export interface MarkSystemIntakeReadyForGRB {
  markSystemIntakeReadyForGRB: MarkSystemIntakeReadyForGRB_markSystemIntakeReadyForGRB | null;
}

export interface MarkSystemIntakeReadyForGRBVariables {
  input: AddGRTFeedbackInput;
}
