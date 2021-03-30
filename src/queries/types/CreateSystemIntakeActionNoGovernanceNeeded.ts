/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BasicActionInput, SystemIntakeStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionNoGovernanceNeeded
// ====================================================

export interface CreateSystemIntakeActionNoGovernanceNeeded_createSystemIntakeActionNoGovernanceNeeded_systemIntake {
  __typename: "SystemIntake";
  status: SystemIntakeStatus;
  id: UUID;
}

export interface CreateSystemIntakeActionNoGovernanceNeeded_createSystemIntakeActionNoGovernanceNeeded {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionNoGovernanceNeeded_createSystemIntakeActionNoGovernanceNeeded_systemIntake | null;
}

export interface CreateSystemIntakeActionNoGovernanceNeeded {
  createSystemIntakeActionNoGovernanceNeeded: CreateSystemIntakeActionNoGovernanceNeeded_createSystemIntakeActionNoGovernanceNeeded | null;
}

export interface CreateSystemIntakeActionNoGovernanceNeededVariables {
  input: BasicActionInput;
}
