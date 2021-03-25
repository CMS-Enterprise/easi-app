/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BasicActionInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionBusinessCaseNeeded
// ====================================================

export interface CreateSystemIntakeActionBusinessCaseNeeded_createSystemIntakeActionBusinessCaseNeeded_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface CreateSystemIntakeActionBusinessCaseNeeded_createSystemIntakeActionBusinessCaseNeeded {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionBusinessCaseNeeded_createSystemIntakeActionBusinessCaseNeeded_systemIntake | null;
}

export interface CreateSystemIntakeActionBusinessCaseNeeded {
  createSystemIntakeActionBusinessCaseNeeded: CreateSystemIntakeActionBusinessCaseNeeded_createSystemIntakeActionBusinessCaseNeeded | null;
}

export interface CreateSystemIntakeActionBusinessCaseNeededVariables {
  input: BasicActionInput;
}
