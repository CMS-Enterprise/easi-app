/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeUnretireLCIDInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionUnretireLcid
// ====================================================

export interface CreateSystemIntakeActionUnretireLcid_createSystemIntakeActionUnretireLCID_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
}

export interface CreateSystemIntakeActionUnretireLcid_createSystemIntakeActionUnretireLCID {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionUnretireLcid_createSystemIntakeActionUnretireLCID_systemIntake | null;
}

export interface CreateSystemIntakeActionUnretireLcid {
  createSystemIntakeActionUnretireLCID: CreateSystemIntakeActionUnretireLcid_createSystemIntakeActionUnretireLCID | null;
}

export interface CreateSystemIntakeActionUnretireLcidVariables {
  input: SystemIntakeUnretireLCIDInput;
}
