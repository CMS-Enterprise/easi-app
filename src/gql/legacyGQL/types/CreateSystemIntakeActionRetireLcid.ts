/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeRetireLCIDInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionRetireLcid
// ====================================================

export interface CreateSystemIntakeActionRetireLcid_createSystemIntakeActionRetireLCID_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
}

export interface CreateSystemIntakeActionRetireLcid_createSystemIntakeActionRetireLCID {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionRetireLcid_createSystemIntakeActionRetireLCID_systemIntake | null;
}

export interface CreateSystemIntakeActionRetireLcid {
  createSystemIntakeActionRetireLCID: CreateSystemIntakeActionRetireLcid_createSystemIntakeActionRetireLCID | null;
}

export interface CreateSystemIntakeActionRetireLcidVariables {
  input: SystemIntakeRetireLCIDInput;
}
