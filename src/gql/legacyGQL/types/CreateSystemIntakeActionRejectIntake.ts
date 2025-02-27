/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeRejectIntakeInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionRejectIntake
// ====================================================

export interface CreateSystemIntakeActionRejectIntake_createSystemIntakeActionRejectIntake_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface CreateSystemIntakeActionRejectIntake_createSystemIntakeActionRejectIntake {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionRejectIntake_createSystemIntakeActionRejectIntake_systemIntake | null;
}

export interface CreateSystemIntakeActionRejectIntake {
  createSystemIntakeActionRejectIntake: CreateSystemIntakeActionRejectIntake_createSystemIntakeActionRejectIntake | null;
}

export interface CreateSystemIntakeActionRejectIntakeVariables {
  input: SystemIntakeRejectIntakeInput;
}
