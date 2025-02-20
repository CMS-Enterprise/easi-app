/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateSystemIntakeContactInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeContact
// ====================================================

export interface CreateSystemIntakeContact_createSystemIntakeContact_systemIntakeContact {
  __typename: "SystemIntakeContact";
  id: UUID;
  euaUserId: string;
  systemIntakeId: UUID;
  component: string;
  role: string;
}

export interface CreateSystemIntakeContact_createSystemIntakeContact {
  __typename: "CreateSystemIntakeContactPayload";
  systemIntakeContact: CreateSystemIntakeContact_createSystemIntakeContact_systemIntakeContact | null;
}

export interface CreateSystemIntakeContact {
  createSystemIntakeContact: CreateSystemIntakeContact_createSystemIntakeContact | null;
}

export interface CreateSystemIntakeContactVariables {
  input: CreateSystemIntakeContactInput;
}
