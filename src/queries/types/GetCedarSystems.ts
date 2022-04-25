/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarSystems
// ====================================================

export interface GetCedarSystems_cedarSystems {
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

export interface GetCedarSystems {
  cedarSystems: (GetCedarSystems_cedarSystems | null)[] | null;
}
