/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeContactInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeContact
// ====================================================

export interface UpdateSystemIntakeContact_updateSystemIntakeContact_systemIntakeContact {
  __typename: "SystemIntakeContact";
  id: UUID;
  euaUserId: string;
  systemIntakeId: UUID;
  component: string;
  role: string;
}

export interface UpdateSystemIntakeContact_updateSystemIntakeContact {
  __typename: "CreateSystemIntakeContactPayload";
  systemIntakeContact: UpdateSystemIntakeContact_updateSystemIntakeContact_systemIntakeContact | null;
}

export interface UpdateSystemIntakeContact {
  updateSystemIntakeContact: UpdateSystemIntakeContact_updateSystemIntakeContact | null;
}

export interface UpdateSystemIntakeContactVariables {
  input: UpdateSystemIntakeContactInput;
}
