/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeUpdateLCIDInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionUpdateLcid
// ====================================================

export interface CreateSystemIntakeActionUpdateLcid_createSystemIntakeActionUpdateLCID_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
}

export interface CreateSystemIntakeActionUpdateLcid_createSystemIntakeActionUpdateLCID {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionUpdateLcid_createSystemIntakeActionUpdateLCID_systemIntake | null;
}

export interface CreateSystemIntakeActionUpdateLcid {
  createSystemIntakeActionUpdateLCID: CreateSystemIntakeActionUpdateLcid_createSystemIntakeActionUpdateLCID | null;
}

export interface CreateSystemIntakeActionUpdateLcidVariables {
  input: SystemIntakeUpdateLCIDInput;
}
