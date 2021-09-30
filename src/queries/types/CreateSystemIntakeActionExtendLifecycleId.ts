/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateSystemIntakeActionExtendLifecycleIdInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionExtendLifecycleId
// ====================================================

export interface CreateSystemIntakeActionExtendLifecycleId_createSystemIntakeActionExtendLifecycleId_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcidExpiresAt: Time | null;
}

export interface CreateSystemIntakeActionExtendLifecycleId_createSystemIntakeActionExtendLifecycleId {
  __typename: "CreateSystemIntakeActionExtendLifecycleIdPayload";
  systemIntake: CreateSystemIntakeActionExtendLifecycleId_createSystemIntakeActionExtendLifecycleId_systemIntake | null;
}

export interface CreateSystemIntakeActionExtendLifecycleId {
  createSystemIntakeActionExtendLifecycleId: CreateSystemIntakeActionExtendLifecycleId_createSystemIntakeActionExtendLifecycleId | null;
}

export interface CreateSystemIntakeActionExtendLifecycleIdVariables {
  input: CreateSystemIntakeActionExtendLifecycleIdInput;
}
