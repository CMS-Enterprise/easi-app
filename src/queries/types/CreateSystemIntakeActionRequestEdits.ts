/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeRequestEditsInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionRequestEdits
// ====================================================

export interface CreateSystemIntakeActionRequestEdits_createSystemIntakeActionRequestEdits_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface CreateSystemIntakeActionRequestEdits_createSystemIntakeActionRequestEdits {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionRequestEdits_createSystemIntakeActionRequestEdits_systemIntake | null;
}

export interface CreateSystemIntakeActionRequestEdits {
  createSystemIntakeActionRequestEdits: CreateSystemIntakeActionRequestEdits_createSystemIntakeActionRequestEdits | null;
}

export interface CreateSystemIntakeActionRequestEditsVariables {
  input: SystemIntakeRequestEditsInput;
}
