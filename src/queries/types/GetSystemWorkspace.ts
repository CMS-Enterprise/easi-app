/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CedarAssigneeType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemWorkspace
// ====================================================

export interface GetSystemWorkspace_cedarAuthorityToOperate {
  __typename: "CedarAuthorityToOperate";
  uuid: string;
  tlcPhase: string | null;
  dateAuthorizationMemoExpires: Time | null;
  countOfOpenPoams: number;
  lastAssessmentDate: Time | null;
}

export interface GetSystemWorkspace_cedarSystemDetails_cedarSystem {
  __typename: "CedarSystem";
  id: string;
  name: string;
  isBookmarked: boolean;
}

export interface GetSystemWorkspace_cedarSystemDetails_roles {
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

export interface GetSystemWorkspace_cedarSystemDetails {
  __typename: "CedarSystemDetails";
  isMySystem: boolean | null;
  cedarSystem: GetSystemWorkspace_cedarSystemDetails_cedarSystem;
  roles: GetSystemWorkspace_cedarSystemDetails_roles[];
}

export interface GetSystemWorkspace {
  cedarAuthorityToOperate: GetSystemWorkspace_cedarAuthorityToOperate[];
  cedarSystemDetails: GetSystemWorkspace_cedarSystemDetails | null;
}

export interface GetSystemWorkspaceVariables {
  cedarSystemId: string;
}
