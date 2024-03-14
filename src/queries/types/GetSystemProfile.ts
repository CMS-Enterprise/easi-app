/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CedarAssigneeType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemProfile
// ====================================================

export interface GetSystemProfile_cedarAuthorityToOperate {
  __typename: "CedarAuthorityToOperate";
  uuid: string;
  tlcPhase: string | null;
  dateAuthorizationMemoExpires: Time | null;
  countOfOpenPoams: number;
  lastAssessmentDate: Time | null;
}

export interface GetSystemProfile_cedarThreat {
  __typename: "CedarThreat";
  weaknessRiskLevel: string | null;
}

export interface GetSystemProfile_cedarSoftwareProducts_softwareProducts {
  __typename: "CedarSoftwareProductItem";
  apiGatewayUse: boolean | null;
  elaPurchase: string | null;
  elaVendorId: string | null;
  providesAiCapability: boolean | null;
  refstr: string | null;
  softwareCatagoryConnectionGuid: string | null;
  softwareVendorConnectionGuid: string | null;
  softwareCost: string | null;
  softwareElaOrganization: string | null;
  softwareName: string | null;
  systemSoftwareConnectionGuid: string | null;
  technopediaCategory: string | null;
  technopediaID: string | null;
  vendorName: string | null;
}

export interface GetSystemProfile_cedarSoftwareProducts {
  __typename: "CedarSoftwareProducts";
  aiSolnCatg: (string | null)[];
  aiSolnCatgOther: string | null;
  apiDataArea: (string | null)[];
  apiDescPubLocation: string | null;
  apiDescPublished: string | null;
  apiFHIRUse: string | null;
  apiFHIRUseOther: string | null;
  apiHasPortal: boolean | null;
  apisAccessibility: string | null;
  apisDeveloped: string | null;
  developmentStage: string | null;
  softwareProducts: GetSystemProfile_cedarSoftwareProducts_softwareProducts[];
  systemHasAPIGateway: boolean | null;
  usesAiTech: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_businessOwnerInformation {
  __typename: "CedarBusinessOwnerInformation";
  isCmsOwned: boolean | null;
  numberOfContractorFte: string | null;
  numberOfFederalFte: string | null;
  numberOfSupportedUsersPerMonth: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_cedarSystem {
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

export interface GetSystemProfile_cedarSystemDetails_deployments_dataCenter {
  __typename: "CedarDataCenter";
  name: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_deployments {
  __typename: "CedarDeployment";
  id: string;
  dataCenter: GetSystemProfile_cedarSystemDetails_deployments_dataCenter | null;
  deploymentType: string | null;
  name: string;
}

export interface GetSystemProfile_cedarSystemDetails_roles {
  __typename: "CedarRole";
  application: string;
  objectID: string;
  roleTypeID: string;
  assigneeType: CedarAssigneeType | null;
  assigneeUsername: string | null;
  assigneeEmail: string | null;
  assigneeOrgID: string | null;
  assigneeOrgName: string | null;
  assigneeFirstName: string | null;
  assigneeLastName: string | null;
  roleTypeName: string | null;
  roleID: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_urls {
  __typename: "CedarURL";
  id: string;
  address: string | null;
  isAPIEndpoint: boolean | null;
  isBehindWebApplicationFirewall: boolean | null;
  isVersionCodeRepository: boolean | null;
  urlHostingEnv: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_systemMaintainerInformation {
  __typename: "CedarSystemMaintainerInformation";
  agileUsed: boolean | null;
  deploymentFrequency: string | null;
  devCompletionPercent: string | null;
  devWorkDescription: string | null;
  netAccessibility: string | null;
}

export interface GetSystemProfile_cedarSystemDetails {
  __typename: "CedarSystemDetails";
  businessOwnerInformation: GetSystemProfile_cedarSystemDetails_businessOwnerInformation;
  cedarSystem: GetSystemProfile_cedarSystemDetails_cedarSystem;
  deployments: GetSystemProfile_cedarSystemDetails_deployments[];
  roles: GetSystemProfile_cedarSystemDetails_roles[];
  urls: GetSystemProfile_cedarSystemDetails_urls[];
  systemMaintainerInformation: GetSystemProfile_cedarSystemDetails_systemMaintainerInformation;
}

export interface GetSystemProfile {
  cedarAuthorityToOperate: GetSystemProfile_cedarAuthorityToOperate[];
  cedarThreat: GetSystemProfile_cedarThreat[];
  cedarSoftwareProducts: GetSystemProfile_cedarSoftwareProducts | null;
  cedarSystemDetails: GetSystemProfile_cedarSystemDetails | null;
}

export interface GetSystemProfileVariables {
  cedarSystemId: string;
}
