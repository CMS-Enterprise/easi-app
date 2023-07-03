/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarSystemsAndBookmarks
// ====================================================

export interface GetCedarSystemsAndBookmarks_cedarSystemBookmarks {
  __typename: "CedarSystemBookmark";
  euaUserId: string;
  cedarSystemId: string;
}

export interface GetCedarSystemsAndBookmarks_cedarSystems {
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

export interface GetCedarSystemsAndBookmarks {
  cedarSystemBookmarks: GetCedarSystemsAndBookmarks_cedarSystemBookmarks[];
  cedarSystems: (GetCedarSystemsAndBookmarks_cedarSystems | null)[] | null;
}
