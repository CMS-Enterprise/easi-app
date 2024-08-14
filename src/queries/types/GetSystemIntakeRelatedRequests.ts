/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeDecisionState, TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemIntakeRelatedRequests
// ====================================================

export interface GetSystemIntakeRelatedRequests_systemIntake_relatedIntakes_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  contractNumber: string;
}

export interface GetSystemIntakeRelatedRequests_systemIntake_relatedIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetSystemIntakeRelatedRequests_systemIntake_relatedIntakes_contractNumbers[];
  decisionState: SystemIntakeDecisionState;
  submittedAt: Time | null;
}

export interface GetSystemIntakeRelatedRequests_systemIntake_relatedTRBRequests_contractNumbers {
  __typename: "TRBRequestContractNumber";
  contractNumber: string;
}

export interface GetSystemIntakeRelatedRequests_systemIntake_relatedTRBRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetSystemIntakeRelatedRequests_systemIntake_relatedTRBRequests_contractNumbers[];
  status: TRBRequestStatus;
  createdAt: Time;
}

export interface GetSystemIntakeRelatedRequests_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  /**
   * Other System Intakes that share a CEDAR System or Contract Number
   */
  relatedIntakes: GetSystemIntakeRelatedRequests_systemIntake_relatedIntakes[];
  /**
   * TRB Requests that share a CEDAR System or Contract Number
   */
  relatedTRBRequests: GetSystemIntakeRelatedRequests_systemIntake_relatedTRBRequests[];
}

export interface GetSystemIntakeRelatedRequests {
  systemIntake: GetSystemIntakeRelatedRequests_systemIntake | null;
}

export interface GetSystemIntakeRelatedRequestsVariables {
  systemIntakeID: UUID;
}
