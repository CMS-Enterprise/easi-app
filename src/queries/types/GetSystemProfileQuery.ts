/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CedarAssigneeType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemProfileQuery
// ====================================================

export interface GetSystemProfileQuery_cedarSystemDetails_cedarSystem {
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

export interface GetSystemProfileQuery_cedarSystemDetails_deployments_dataCenter {
  __typename: "CedarDataCenter";
  name: string | null;
}

export interface GetSystemProfileQuery_cedarSystemDetails_deployments {
  __typename: "CedarDeployment";
  id: string;
  dataCenter: GetSystemProfileQuery_cedarSystemDetails_deployments_dataCenter | null;
  deploymentType: string | null;
  name: string;
}

export interface GetSystemProfileQuery_cedarSystemDetails_roles {
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

export interface GetSystemProfileQuery_cedarSystemDetails_urls {
  __typename: "CedarURL";
  id: string;
  address: string | null;
  isAPIEndpoint: boolean | null;
  isBehindWebApplicationFirewall: boolean | null;
  isVersionCodeRepository: boolean | null;
  urlHostingEnv: string | null;
}

export interface GetSystemProfileQuery_cedarSystemDetails {
  __typename: "CedarSystemDetails";
  cedarSystem: GetSystemProfileQuery_cedarSystemDetails_cedarSystem;
  deployments: GetSystemProfileQuery_cedarSystemDetails_deployments[];
  roles: GetSystemProfileQuery_cedarSystemDetails_roles[];
  urls: GetSystemProfileQuery_cedarSystemDetails_urls[];
}

export interface GetSystemProfileQuery {
  cedarSystemDetails: GetSystemProfileQuery_cedarSystemDetails | null;
}

export interface GetSystemProfileQueryVariables {
  cedarSystemId: string;
}
