/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeRequestDetailsInput, SystemIntakeSoftwareAcquisitionMethods } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeRequestDetails
// ====================================================

export interface UpdateSystemIntakeRequestDetails_updateSystemIntakeRequestDetails_systemIntake_softwareAcquisition {
  __typename: "SystemIntakeSoftwareAcquisition";
  usingSoftware: string | null;
  acquisitionMethods: SystemIntakeSoftwareAcquisitionMethods[];
}

export interface UpdateSystemIntakeRequestDetails_updateSystemIntakeRequestDetails_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  businessNeed: string | null;
  businessSolution: string | null;
  needsEaSupport: boolean | null;
  hasUiChanges: boolean | null;
  usesAiTech: boolean | null;
  softwareAcquisition: UpdateSystemIntakeRequestDetails_updateSystemIntakeRequestDetails_systemIntake_softwareAcquisition | null;
}

export interface UpdateSystemIntakeRequestDetails_updateSystemIntakeRequestDetails {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: UpdateSystemIntakeRequestDetails_updateSystemIntakeRequestDetails_systemIntake | null;
}

export interface UpdateSystemIntakeRequestDetails {
  updateSystemIntakeRequestDetails: UpdateSystemIntakeRequestDetails_updateSystemIntakeRequestDetails | null;
}

export interface UpdateSystemIntakeRequestDetailsVariables {
  input: UpdateSystemIntakeRequestDetailsInput;
}
