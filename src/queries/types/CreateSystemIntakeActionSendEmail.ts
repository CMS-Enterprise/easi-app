/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BasicActionInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionSendEmail
// ====================================================

export interface CreateSystemIntakeActionSendEmail_createSystemIntakeActionSendEmail_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface CreateSystemIntakeActionSendEmail_createSystemIntakeActionSendEmail {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionSendEmail_createSystemIntakeActionSendEmail_systemIntake | null;
}

export interface CreateSystemIntakeActionSendEmail {
  createSystemIntakeActionSendEmail: CreateSystemIntakeActionSendEmail_createSystemIntakeActionSendEmail | null;
}

export interface CreateSystemIntakeActionSendEmailVariables {
  input: BasicActionInput;
}
