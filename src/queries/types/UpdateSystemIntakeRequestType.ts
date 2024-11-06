/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeRequestType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeRequestType
// ====================================================

export interface UpdateSystemIntakeRequestType_updateSystemIntakeRequestType {
  __typename: "SystemIntake";
  id: UUID;
}

export interface UpdateSystemIntakeRequestType {
  updateSystemIntakeRequestType: UpdateSystemIntakeRequestType_updateSystemIntakeRequestType;
}

export interface UpdateSystemIntakeRequestTypeVariables {
  id: UUID;
  requestType: SystemIntakeRequestType;
}
