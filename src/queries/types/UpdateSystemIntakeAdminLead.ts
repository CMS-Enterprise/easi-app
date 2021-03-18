/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeAdminLeadInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeAdminLead
// ====================================================

export interface UpdateSystemIntakeAdminLead_updateSystemIntakeAdminLead_systemIntake {
  __typename: "SystemIntake";
  adminLead: string | null;
}

export interface UpdateSystemIntakeAdminLead_updateSystemIntakeAdminLead {
  __typename: "UpdateSystemIntakeAdminLeadPayload";
  systemIntake: UpdateSystemIntakeAdminLead_updateSystemIntakeAdminLead_systemIntake | null;
}

export interface UpdateSystemIntakeAdminLead {
  updateSystemIntakeAdminLead: UpdateSystemIntakeAdminLead_updateSystemIntakeAdminLead | null;
}

export interface UpdateSystemIntakeAdminLeadVariables {
  input: UpdateSystemIntakeAdminLeadInput;
}
