/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CedarAssigneeType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemProfileTeam
// ====================================================

export interface GetSystemProfileTeam_cedarSystemDetails_businessOwnerInformation {
  __typename: "CedarBusinessOwnerInformation";
  numberOfContractorFte: string | null;
  numberOfFederalFte: string | null;
}

export interface GetSystemProfileTeam_cedarSystemDetails_roles {
  __typename: "CedarRole";
  application: string;
  objectID: string;
  roleTypeID: string;
  assigneeType: CedarAssigneeType | null;
  assigneeUsername: string | null;
  assigneeEmail: string | null;
  assigneeOrgID: string | null;
  assigneeOrgName: string | null;
  assigneeFirstName: string | null;
  assigneeLastName: string | null;
  roleTypeName: string | null;
  roleID: string | null;
}

export interface GetSystemProfileTeam_cedarSystemDetails {
  __typename: "CedarSystemDetails";
  businessOwnerInformation: GetSystemProfileTeam_cedarSystemDetails_businessOwnerInformation;
  roles: GetSystemProfileTeam_cedarSystemDetails_roles[];
}

export interface GetSystemProfileTeam {
  cedarSystemDetails: GetSystemProfileTeam_cedarSystemDetails | null;
}

export interface GetSystemProfileTeamVariables {
  systemId: string;
}
