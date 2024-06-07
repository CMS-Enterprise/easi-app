/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMyCedarSystems
// ====================================================

export interface GetMyCedarSystems_myCedarSystems {
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
  isBookmarked: boolean;
}

export interface GetMyCedarSystems {
  myCedarSystems: GetMyCedarSystems_myCedarSystems[];
}
