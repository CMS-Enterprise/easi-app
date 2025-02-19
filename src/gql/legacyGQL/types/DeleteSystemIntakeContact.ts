/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteSystemIntakeContactInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteSystemIntakeContact
// ====================================================

export interface DeleteSystemIntakeContact_deleteSystemIntakeContact_systemIntakeContact {
  __typename: "SystemIntakeContact";
  id: UUID;
  euaUserId: string;
  systemIntakeId: UUID;
  component: string;
  role: string;
}

export interface DeleteSystemIntakeContact_deleteSystemIntakeContact {
  __typename: "DeleteSystemIntakeContactPayload";
  systemIntakeContact: DeleteSystemIntakeContact_deleteSystemIntakeContact_systemIntakeContact | null;
}

export interface DeleteSystemIntakeContact {
  deleteSystemIntakeContact: DeleteSystemIntakeContact_deleteSystemIntakeContact | null;
}

export interface DeleteSystemIntakeContactVariables {
  input: DeleteSystemIntakeContactInput;
}
