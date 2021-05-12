/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IssueLifecycleIdInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: IssueLifecycleId
// ====================================================

export interface IssueLifecycleId_issueLifecycleId_systemIntake {
  __typename: "SystemIntake";
  decisionNextSteps: string | null;
  id: UUID;
  lcid: string | null;
  lcidExpiresAt: Time | null;
  lcidScope: string | null;
}

export interface IssueLifecycleId_issueLifecycleId {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: IssueLifecycleId_issueLifecycleId_systemIntake | null;
}

export interface IssueLifecycleId {
  issueLifecycleId: IssueLifecycleId_issueLifecycleId | null;
}

export interface IssueLifecycleIdVariables {
  input: IssueLifecycleIdInput;
}
