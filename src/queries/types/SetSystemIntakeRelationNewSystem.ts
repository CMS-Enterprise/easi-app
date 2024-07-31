/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SetSystemIntakeRelationNewSystemInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: SetSystemIntakeRelationNewSystem
// ====================================================

export interface SetSystemIntakeRelationNewSystem_setSystemIntakeRelationNewSystem_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface SetSystemIntakeRelationNewSystem_setSystemIntakeRelationNewSystem {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: SetSystemIntakeRelationNewSystem_setSystemIntakeRelationNewSystem_systemIntake | null;
}

export interface SetSystemIntakeRelationNewSystem {
  setSystemIntakeRelationNewSystem: SetSystemIntakeRelationNewSystem_setSystemIntakeRelationNewSystem | null;
}

export interface SetSystemIntakeRelationNewSystemVariables {
  input: SetSystemIntakeRelationNewSystemInput;
}
