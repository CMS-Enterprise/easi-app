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

export interface GetSystemProfileDetails_cedarSystemDetails_systemMaintainerInformation {
  __typename: "CedarSystemMaintainerInformation";
  deploymentFrequency: string | null;
  devCompletionPercent: string | null;
  devWorkDescription: string | null;
  netAccessibility: string | null;
}

export interface GetSystemProfileDetails_cedarSystemDetails {
  __typename: "CedarSystemDetails";
  businessOwnerInformation: GetSystemProfileDetails_cedarSystemDetails_businessOwnerInformation;
  systemMaintainerInformation: GetSystemProfileDetails_cedarSystemDetails_systemMaintainerInformation;
}

export interface GetSystemProfileDetails {
  cedarSystemDetails: GetSystemProfileDetails_cedarSystemDetails | null;
}

export interface GetSystemProfileDetailsVariables {
  cedarSystemId: string;
}
