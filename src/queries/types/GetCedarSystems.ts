/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarSystems
// ====================================================

export interface GetCedarSystems_cedarSystems_linkedTrbRequests {
  __typename: "TRBRequest";
  id: UUID;
}

export interface GetCedarSystems_cedarSystems_linkedSystemIntakes {
  __typename: "SystemIntake";
  id: UUID;
}

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
  isBookmarked: boolean;
  linkedTrbRequests: GetCedarSystems_cedarSystems_linkedTrbRequests[];
  linkedSystemIntakes: GetCedarSystems_cedarSystems_linkedSystemIntakes[];
}

export interface GetCedarSystems {
  cedarSystems: GetCedarSystems_cedarSystems[];
}
