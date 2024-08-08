/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeDecisionState, TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTRBRequestRelatedRequests
// ====================================================

export interface GetTRBRequestRelatedRequests_trbRequest_relatedIntakes_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  contractNumber: string;
}

export interface GetTRBRequestRelatedRequests_trbRequest_relatedIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetTRBRequestRelatedRequests_trbRequest_relatedIntakes_contractNumbers[];
  decisionState: SystemIntakeDecisionState;
  submittedAt: Time | null;
}

export interface GetTRBRequestRelatedRequests_trbRequest_relatedTRBRequests_contractNumbers {
  __typename: "TRBRequestContractNumber";
  contractNumber: string;
}

export interface GetTRBRequestRelatedRequests_trbRequest_relatedTRBRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetTRBRequestRelatedRequests_trbRequest_relatedTRBRequests_contractNumbers[];
  status: TRBRequestStatus;
  createdAt: Time;
}

export interface GetTRBRequestRelatedRequests_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  /**
   * System Intakes that share a CEDAR System or Contract Number
   */
  relatedIntakes: GetTRBRequestRelatedRequests_trbRequest_relatedIntakes[];
  /**
   * Other TRB Requests that share a CEDAR System or Contract Number
   */
  relatedTRBRequests: GetTRBRequestRelatedRequests_trbRequest_relatedTRBRequests[];
}

export interface GetTRBRequestRelatedRequests {
  trbRequest: GetTRBRequestRelatedRequests_trbRequest;
}

export interface GetTRBRequestRelatedRequestsVariables {
  trbRequestID: UUID;
}
