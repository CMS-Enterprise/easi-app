/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeChangeLCIDRetirementDateInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeActionChangeLcidRetirementDate
// ====================================================

export interface CreateSystemIntakeActionChangeLcidRetirementDate_createSystemIntakeActionChangeLCIDRetirementDate_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
}

export interface CreateSystemIntakeActionChangeLcidRetirementDate_createSystemIntakeActionChangeLCIDRetirementDate {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: CreateSystemIntakeActionChangeLcidRetirementDate_createSystemIntakeActionChangeLCIDRetirementDate_systemIntake | null;
}

export interface CreateSystemIntakeActionChangeLcidRetirementDate {
  createSystemIntakeActionChangeLCIDRetirementDate: CreateSystemIntakeActionChangeLcidRetirementDate_createSystemIntakeActionChangeLCIDRetirementDate | null;
}

export interface CreateSystemIntakeActionChangeLcidRetirementDateVariables {
  input: SystemIntakeChangeLCIDRetirementDateInput;
}
