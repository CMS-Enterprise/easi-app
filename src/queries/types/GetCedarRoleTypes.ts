/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarRoleTypes
// ====================================================

export interface GetCedarRoleTypes_roleTypes {
  __typename: "CedarRoleType";
  id: string;
  name: string;
  description: string | null;
}

export interface GetCedarRoleTypes {
  roleTypes: GetCedarRoleTypes_roleTypes[];
}
