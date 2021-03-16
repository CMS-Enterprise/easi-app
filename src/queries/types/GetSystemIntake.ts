/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeRequestType, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemIntake
// ====================================================

export interface GetSystemIntake_systemIntake_requester {
  __typename: "SystemIntakeRequester";
  component: string | null;
  email: string | null;
  name: string;
}

export interface GetSystemIntake_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  requester: GetSystemIntake_systemIntake_requester;
  lcid: string | null;
  projectName: string | null;
  requestType: SystemIntakeRequestType;
  status: SystemIntakeStatus;
  submittedAt: Time | null;
}

export interface GetSystemIntake {
  systemIntake: GetSystemIntake_systemIntake | null;
}

export interface GetSystemIntakeVariables {
  id: UUID;
}
