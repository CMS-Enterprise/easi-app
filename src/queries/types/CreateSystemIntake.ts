/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateSystemIntakeInput, SystemIntakeStatus, SystemIntakeRequestType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntake
// ====================================================

export interface CreateSystemIntake_createSystemIntake_requester {
  __typename: "SystemIntakeRequester";
  name: string;
}

export interface CreateSystemIntake_createSystemIntake {
  __typename: "SystemIntake";
  id: UUID;
  status: SystemIntakeStatus;
  requestType: SystemIntakeRequestType;
  requester: CreateSystemIntake_createSystemIntake_requester;
}

export interface CreateSystemIntake {
  createSystemIntake: CreateSystemIntake_createSystemIntake | null;
}

export interface CreateSystemIntakeVariables {
  input: CreateSystemIntakeInput;
}
