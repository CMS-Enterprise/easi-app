/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarSubSystems
// ====================================================

export interface GetCedarSubSystems_cedarSubSystems {
  __typename: "CedarSubSystem";
  id: string;
  name: string;
  acronym: string | null;
  description: string | null;
}

export interface GetCedarSubSystems {
  cedarSubSystems: GetCedarSubSystems_cedarSubSystems[];
}

export interface GetCedarSubSystemsVariables {
  cedarSystemId: string;
}
