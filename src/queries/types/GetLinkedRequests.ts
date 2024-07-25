/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeState, TRBRequestState, SystemIntakeStatusRequester, TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetLinkedRequests
// ====================================================

export interface GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedSystemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  name: string | null;
  submittedAt: Time | null;
  status: SystemIntakeStatusRequester;
  lcid: string | null;
  requesterName: string | null;
}

export interface GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests_form {
  __typename: "TRBRequestForm";
  submittedAt: Time | null;
}

export interface GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests_requesterInfo {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  form: GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests_form;
  status: TRBRequestStatus;
  state: TRBRequestState;
  requesterInfo: GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests_requesterInfo;
}

export interface GetLinkedRequests_cedarSystemDetails_cedarSystem {
  __typename: "CedarSystem";
  id: string;
  linkedSystemIntakes: GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedSystemIntakes[];
  linkedTrbRequests: GetLinkedRequests_cedarSystemDetails_cedarSystem_linkedTrbRequests[];
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
  systemIntakeState: SystemIntakeState;
  trbRequestState: TRBRequestState;
}
