/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeReopenRequestInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionReopenRequest
// ====================================================

export interface CreateSystemIntakeActionReopenRequest_createSystemIntakeActionReopenRequest_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface CreateSystemIntakeActionReopenRequest_createSystemIntakeActionReopenRequest {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionReopenRequest_createSystemIntakeActionReopenRequest_systemIntake | null;
}

export interface CreateSystemIntakeActionReopenRequest {
  createSystemIntakeActionReopenRequest: CreateSystemIntakeActionReopenRequest_createSystemIntakeActionReopenRequest | null;
}

export interface CreateSystemIntakeActionReopenRequestVariables {
  input: SystemIntakeReopenRequestInput;
}
