/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarSystem
// ====================================================

export interface GetCedarSystem_cedarSystem {
  __typename: "CedarSystem";
  id: string;
  name: string;
  description: string | null;
  acronym: string | null;
  status: string | null;
  businessOwnerOrg: string | null;
  businessOwnerOrgComp: string | null;
  systemMaintainerOrg: string | null;
  systemMaintainerOrgComp: string | null;
}

export interface GetCedarSystem {
  cedarSystem: GetCedarSystem_cedarSystem | null;
}

export interface GetCedarSystemVariables {
  id: string;
}
