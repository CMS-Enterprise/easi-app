/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeCloseRequestInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionCloseRequest
// ====================================================

export interface CreateSystemIntakeActionCloseRequest_createSystemIntakeActionCloseRequest_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface CreateSystemIntakeActionCloseRequest_createSystemIntakeActionCloseRequest {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionCloseRequest_createSystemIntakeActionCloseRequest_systemIntake | null;
}

export interface CreateSystemIntakeActionCloseRequest {
  createSystemIntakeActionCloseRequest: CreateSystemIntakeActionCloseRequest_createSystemIntakeActionCloseRequest | null;
}

export interface CreateSystemIntakeActionCloseRequestVariables {
  input: SystemIntakeCloseRequestInput;
}
