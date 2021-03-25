/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BasicActionInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionNotItRequest
// ====================================================

export interface CreateSystemIntakeActionNotItRequest_createSystemIntakeActionNotItRequest_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface CreateSystemIntakeActionNotItRequest_createSystemIntakeActionNotItRequest {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionNotItRequest_createSystemIntakeActionNotItRequest_systemIntake | null;
}

export interface CreateSystemIntakeActionNotItRequest {
  createSystemIntakeActionNotItRequest: CreateSystemIntakeActionNotItRequest_createSystemIntakeActionNotItRequest | null;
}

export interface CreateSystemIntakeActionNotItRequestVariables {
  input: BasicActionInput;
}
