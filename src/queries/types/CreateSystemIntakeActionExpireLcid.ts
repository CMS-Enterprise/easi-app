/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeExpireLCIDInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionExpireLcid
// ====================================================

export interface CreateSystemIntakeActionExpireLcid_createSystemIntakeActionExpireLCID_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
}

export interface CreateSystemIntakeActionExpireLcid_createSystemIntakeActionExpireLCID {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionExpireLcid_createSystemIntakeActionExpireLCID_systemIntake | null;
}

export interface CreateSystemIntakeActionExpireLcid {
  createSystemIntakeActionExpireLCID: CreateSystemIntakeActionExpireLcid_createSystemIntakeActionExpireLCID | null;
}

export interface CreateSystemIntakeActionExpireLcidVariables {
  input: SystemIntakeExpireLCIDInput;
}
