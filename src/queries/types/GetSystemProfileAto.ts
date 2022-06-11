/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemProfileAto
// ====================================================

export interface GetSystemProfileAto_cedarThreat {
  __typename: "CedarThreat";
  id: string | null;
  parentId: string | null;
  alternativeId: string | null;
  type: string | null;
  weaknessRiskLevel: string | null;
  daysOpen: number | null;
  controlFamily: string | null;
}

export interface GetSystemProfileAto {
  cedarThreat: GetSystemProfileAto_cedarThreat[];
}

export interface GetSystemProfileAtoVariables {
  cedarSystemId: string;
}
