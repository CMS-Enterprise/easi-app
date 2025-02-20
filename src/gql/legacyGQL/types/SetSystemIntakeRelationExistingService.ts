/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SetSystemIntakeRelationExistingServiceInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: SetSystemIntakeRelationExistingService
// ====================================================

export interface SetSystemIntakeRelationExistingService_setSystemIntakeRelationExistingService_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface SetSystemIntakeRelationExistingService_setSystemIntakeRelationExistingService {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: SetSystemIntakeRelationExistingService_setSystemIntakeRelationExistingService_systemIntake | null;
}

export interface SetSystemIntakeRelationExistingService {
  setSystemIntakeRelationExistingService: SetSystemIntakeRelationExistingService_setSystemIntakeRelationExistingService | null;
}

export interface SetSystemIntakeRelationExistingServiceVariables {
  input: SetSystemIntakeRelationExistingServiceInput;
}
