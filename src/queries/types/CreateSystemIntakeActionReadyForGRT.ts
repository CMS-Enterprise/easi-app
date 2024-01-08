/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BasicActionInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionReadyForGRT
// ====================================================

export interface CreateSystemIntakeActionReadyForGRT_createSystemIntakeActionReadyForGRT_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface CreateSystemIntakeActionReadyForGRT_createSystemIntakeActionReadyForGRT {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionReadyForGRT_createSystemIntakeActionReadyForGRT_systemIntake | null;
}

export interface CreateSystemIntakeActionReadyForGRT {
  /**
   * Used for IT Gov v1 workflow; for v2, use createSystemIntakeActionProgressToNewStep
   */
  createSystemIntakeActionReadyForGRT: CreateSystemIntakeActionReadyForGRT_createSystemIntakeActionReadyForGRT | null;
}

export interface CreateSystemIntakeActionReadyForGRTVariables {
  input: BasicActionInput;
}
