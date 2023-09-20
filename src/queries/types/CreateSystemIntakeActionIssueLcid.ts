/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeIssueLCIDInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionIssueLcid
// ====================================================

export interface CreateSystemIntakeActionIssueLcid_createSystemIntakeActionIssueLCID_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
}

export interface CreateSystemIntakeActionIssueLcid_createSystemIntakeActionIssueLCID {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionIssueLcid_createSystemIntakeActionIssueLCID_systemIntake | null;
}

export interface CreateSystemIntakeActionIssueLcid {
  createSystemIntakeActionIssueLCID: CreateSystemIntakeActionIssueLcid_createSystemIntakeActionIssueLCID | null;
}

export interface CreateSystemIntakeActionIssueLcidVariables {
  input: SystemIntakeIssueLCIDInput;
}
