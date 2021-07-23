/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubmitIntakeInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: SubmitIntake
// ====================================================

export interface SubmitIntake_submitIntake_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface SubmitIntake_submitIntake {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: SubmitIntake_submitIntake_systemIntake | null;
}

export interface SubmitIntake {
  submitIntake: SubmitIntake_submitIntake | null;
}

export interface SubmitIntakeVariables {
  input: SubmitIntakeInput;
}
