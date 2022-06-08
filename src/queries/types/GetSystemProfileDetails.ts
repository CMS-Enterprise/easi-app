/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemProfileDetails
// ====================================================

export interface GetSystemProfileDetails_cedarSystemDetails_businessOwnerInformation {
  __typename: "CedarBusinessOwnerInformation";
  isCmsOwned: boolean | null;
  numberOfSupportedUsersPerMonth: string | null;
}

export interface GetSystemProfileDetails_cedarSystemDetails_cedarSystem {
  __typename: "CedarSystem";
  id: string;
}

export interface GetSystemProfileDetails_cedarSystemDetails_deployments_dataCenter {
  __typename: "CedarDataCenter";
  name: string | null;
}

export interface GetSystemProfileDetails_cedarSystemDetails_deployments {
  __typename: "CedarDeployment";
  id: string;
  dataCenter: GetSystemProfileDetails_cedarSystemDetails_deployments_dataCenter | null;
  deploymentType: string | null;
  name: string;
}

export interface GetSystemProfileDetails_cedarSystemDetails_systemMaintainerInformation {
  __typename: "CedarSystemMaintainerInformation";
  agileUsed: boolean | null;
  deploymentFrequency: string | null;
  devCompletionPercent: string | null;
  devWorkDescription: string | null;
  netAccessibility: string | null;
}

export interface GetSystemProfileDetails_cedarSystemDetails_urls {
  __typename: "CedarURL";
  id: string;
  address: string | null;
  isAPIEndpoint: boolean | null;
  isBehindWebApplicationFirewall: boolean | null;
  isVersionCodeRepository: boolean | null;
  urlHostingEnv: string | null;
}

export interface GetSystemProfileDetails_cedarSystemDetails {
  __typename: "CedarSystemDetails";
  businessOwnerInformation: GetSystemProfileDetails_cedarSystemDetails_businessOwnerInformation;
  cedarSystem: GetSystemProfileDetails_cedarSystemDetails_cedarSystem;
  deployments: GetSystemProfileDetails_cedarSystemDetails_deployments[];
  systemMaintainerInformation: GetSystemProfileDetails_cedarSystemDetails_systemMaintainerInformation;
  urls: GetSystemProfileDetails_cedarSystemDetails_urls[];
}

export interface GetSystemProfileDetails {
  cedarSystemDetails: GetSystemProfileDetails_cedarSystemDetails | null;
}

export interface GetSystemProfileDetailsVariables {
  cedarSystemId: string;
}
