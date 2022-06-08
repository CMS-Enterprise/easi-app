/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemProfileAto
// ====================================================

export interface GetSystemProfileAto_cedarAuthorityToOperate {
  __typename: "CedarAuthorityToOperate";
  uuid: string;
  tlcPhase: string | null;
  dateAuthorizationMemoExpires: Time | null;
  countOfOpenPoams: number;
  lastAssessmentDate: Time | null;
}

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
  cedarAuthorityToOperate: GetSystemProfileAto_cedarAuthorityToOperate[];
  cedarThreat: GetSystemProfileAto_cedarThreat[];
}

export interface GetSystemProfileAtoVariables {
  cedarSystemId: string;
}
