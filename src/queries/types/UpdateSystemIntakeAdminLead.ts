/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeAdminLeadInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeAdminLead
// ====================================================

export interface UpdateSystemIntakeAdminLead_updateSystemIntakeAdminLead {
  __typename: "UpdateSystemIntakeAdminLeadPayload";
  adminLead: string | null;
}

export interface UpdateSystemIntakeAdminLead {
  updateSystemIntakeAdminLead: UpdateSystemIntakeAdminLead_updateSystemIntakeAdminLead | null;
}

export interface UpdateSystemIntakeAdminLeadVariables {
  input: UpdateSystemIntakeAdminLeadInput;
}
