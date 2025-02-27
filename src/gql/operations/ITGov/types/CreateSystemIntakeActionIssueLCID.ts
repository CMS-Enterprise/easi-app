/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeIssueLCIDInput } from "./../../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionIssueLCID
// ====================================================

export interface CreateSystemIntakeActionIssueLCID_createSystemIntakeActionIssueLCID_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
}

export interface CreateSystemIntakeActionIssueLCID_createSystemIntakeActionIssueLCID {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionIssueLCID_createSystemIntakeActionIssueLCID_systemIntake | null;
}

export interface CreateSystemIntakeActionIssueLCID {
  createSystemIntakeActionIssueLCID: CreateSystemIntakeActionIssueLCID_createSystemIntakeActionIssueLCID | null;
}

export interface CreateSystemIntakeActionIssueLCIDVariables {
  input: SystemIntakeIssueLCIDInput;
}
