/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeConfirmLCIDInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionConfirmLcid
// ====================================================

export interface CreateSystemIntakeActionConfirmLcid_createSystemIntakeActionConfirmLCID_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
}

export interface CreateSystemIntakeActionConfirmLcid_createSystemIntakeActionConfirmLCID {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionConfirmLcid_createSystemIntakeActionConfirmLCID_systemIntake | null;
}

export interface CreateSystemIntakeActionConfirmLcid {
  createSystemIntakeActionConfirmLCID: CreateSystemIntakeActionConfirmLcid_createSystemIntakeActionConfirmLCID | null;
}

export interface CreateSystemIntakeActionConfirmLcidVariables {
  input: SystemIntakeConfirmLCIDInput;
}
