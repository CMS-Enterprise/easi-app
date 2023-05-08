/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemProfileTeam
// ====================================================

export interface GetSystemProfileTeam_cedarSystemDetails_businessOwnerInformation {
  __typename: "CedarBusinessOwnerInformation";
  numberOfFederalFte: string | null;
  numberOfContractorFte: string | null;
}

export interface GetSystemProfileTeam_cedarSystemDetails_roles {
  __typename: "CedarRole";
  objectID: string;
  assigneeFirstName: string | null;
  assigneeLastName: string | null;
  assigneeUsername: string | null;
  assigneeEmail: string | null;
  roleTypeName: string | null;
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
  cedarSystemId: string;
}
