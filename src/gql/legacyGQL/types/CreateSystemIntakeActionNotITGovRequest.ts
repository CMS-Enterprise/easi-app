/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeNotITGovReqInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionNotITGovRequest
// ====================================================

export interface CreateSystemIntakeActionNotITGovRequest_createSystemIntakeActionNotITGovRequest_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface CreateSystemIntakeActionNotITGovRequest_createSystemIntakeActionNotITGovRequest {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionNotITGovRequest_createSystemIntakeActionNotITGovRequest_systemIntake | null;
}

export interface CreateSystemIntakeActionNotITGovRequest {
  createSystemIntakeActionNotITGovRequest: CreateSystemIntakeActionNotITGovRequest_createSystemIntakeActionNotITGovRequest | null;
}

export interface CreateSystemIntakeActionNotITGovRequestVariables {
  input: SystemIntakeNotITGovReqInput;
}
