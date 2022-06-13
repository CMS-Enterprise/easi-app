/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemProfileAto
// ====================================================

export interface GetSystemProfileAto_cedarThreat {
  __typename: "CedarThreat";
  weaknessRiskLevel: string | null;
}

export interface GetSystemProfileAto {
  cedarThreat: GetSystemProfileAto_cedarThreat[];
}

export interface GetSystemProfileAtoVariables {
  cedarSystemId: string;
}
