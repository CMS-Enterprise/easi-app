/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RejectIntakeInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: RejectIntake
// ====================================================

export interface RejectIntake_rejectIntake_systemIntake {
  __typename: "SystemIntake";
  decisionNextSteps: string | null;
  id: UUID;
  rejectionReason: string | null;
}

export interface RejectIntake_rejectIntake {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: RejectIntake_rejectIntake_systemIntake | null;
}

export interface RejectIntake {
  rejectIntake: RejectIntake_rejectIntake | null;
}

export interface RejectIntakeVariables {
  input: RejectIntakeInput;
}
