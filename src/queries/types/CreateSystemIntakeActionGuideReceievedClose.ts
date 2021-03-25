/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BasicActionInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionGuideReceievedClose
// ====================================================

export interface CreateSystemIntakeActionGuideReceievedClose_createSystemIntakeActionGuideReceievedClose_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface CreateSystemIntakeActionGuideReceievedClose_createSystemIntakeActionGuideReceievedClose {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionGuideReceievedClose_createSystemIntakeActionGuideReceievedClose_systemIntake | null;
}

export interface CreateSystemIntakeActionGuideReceievedClose {
  createSystemIntakeActionGuideReceievedClose: CreateSystemIntakeActionGuideReceievedClose_createSystemIntakeActionGuideReceievedClose | null;
}

export interface CreateSystemIntakeActionGuideReceievedCloseVariables {
  input: BasicActionInput;
}
