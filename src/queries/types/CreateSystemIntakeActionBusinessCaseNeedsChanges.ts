/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BasicActionInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionBusinessCaseNeedsChanges
// ====================================================

export interface CreateSystemIntakeActionBusinessCaseNeedsChanges_createSystemIntakeActionBusinessCaseNeedsChanges_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface CreateSystemIntakeActionBusinessCaseNeedsChanges_createSystemIntakeActionBusinessCaseNeedsChanges {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionBusinessCaseNeedsChanges_createSystemIntakeActionBusinessCaseNeedsChanges_systemIntake | null;
}

export interface CreateSystemIntakeActionBusinessCaseNeedsChanges {
  createSystemIntakeActionBusinessCaseNeedsChanges: CreateSystemIntakeActionBusinessCaseNeedsChanges_createSystemIntakeActionBusinessCaseNeedsChanges | null;
}

export interface CreateSystemIntakeActionBusinessCaseNeedsChangesVariables {
  input: BasicActionInput;
}
