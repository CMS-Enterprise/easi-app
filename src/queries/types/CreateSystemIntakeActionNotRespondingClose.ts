/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BasicActionInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionNotRespondingClose
// ====================================================

export interface CreateSystemIntakeActionNotRespondingClose_createSystemIntakeActionNotRespondingClose_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface CreateSystemIntakeActionNotRespondingClose_createSystemIntakeActionNotRespondingClose {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionNotRespondingClose_createSystemIntakeActionNotRespondingClose_systemIntake | null;
}

export interface CreateSystemIntakeActionNotRespondingClose {
  createSystemIntakeActionNotRespondingClose: CreateSystemIntakeActionNotRespondingClose_createSystemIntakeActionNotRespondingClose | null;
}

export interface CreateSystemIntakeActionNotRespondingCloseVariables {
  input: BasicActionInput;
}
