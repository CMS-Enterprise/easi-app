/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeProgressToNewStepsInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionProgressToNewStep
// ====================================================

export interface CreateSystemIntakeActionProgressToNewStep_createSystemIntakeActionProgressToNewStep_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
}

export interface CreateSystemIntakeActionProgressToNewStep_createSystemIntakeActionProgressToNewStep {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionProgressToNewStep_createSystemIntakeActionProgressToNewStep_systemIntake | null;
}

export interface CreateSystemIntakeActionProgressToNewStep {
  createSystemIntakeActionProgressToNewStep: CreateSystemIntakeActionProgressToNewStep_createSystemIntakeActionProgressToNewStep | null;
}

export interface CreateSystemIntakeActionProgressToNewStepVariables {
  input: SystemIntakeProgressToNewStepsInput;
}
