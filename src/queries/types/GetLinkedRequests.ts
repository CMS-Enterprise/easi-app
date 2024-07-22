/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestStatus, SystemIntakeStatusRequester } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetLinkedRequests
// ====================================================

export interface GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  createdAt: Time;
  status: TRBRequestStatus;
  nextMeetingDate: Time | null;
}

export interface GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedSystemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  createdAt: Time | null;
  status: SystemIntakeStatusRequester;
}

export interface GetLinkedRequests_cedarSystemDetails_cedarSystem {
  __typename: "CedarSystem";
  linkedTrbRequests: GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests[];
  linkedSystemIntakes: GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedSystemIntakes[];
}

export interface GetLinkedRequests_cedarSystemDetails {
  __typename: "CedarSystemDetails";
  cedarSystem: GetLinkedRequests_cedarSystemDetails_cedarSystem;
}

export interface GetLinkedRequests {
  cedarSystemDetails: GetLinkedRequests_cedarSystemDetails | null;
}

export interface GetLinkedRequestsVariables {
  cedarSystemId: string;
}
