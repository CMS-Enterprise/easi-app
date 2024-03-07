/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SetSystemIntakeRelationExistingSystemInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: SetSystemIntakeRelationExistingSystem
// ====================================================

export interface SetSystemIntakeRelationExistingSystem_setSystemIntakeRelationExistingSystem_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface SetSystemIntakeRelationExistingSystem_setSystemIntakeRelationExistingSystem {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: SetSystemIntakeRelationExistingSystem_setSystemIntakeRelationExistingSystem_systemIntake | null;
}

export interface SetSystemIntakeRelationExistingSystem {
  setSystemIntakeRelationExistingSystem: SetSystemIntakeRelationExistingSystem_setSystemIntakeRelationExistingSystem | null;
}

export interface SetSystemIntakeRelationExistingSystemVariables {
  input: SetSystemIntakeRelationExistingSystemInput;
}
