/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeStatusRequester, SystemIntakeStatusAdmin, TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetRequests
// ====================================================

export interface GetRequests_mySystemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  submittedAt: Time | null;
  statusRequester: SystemIntakeStatusRequester;
  statusAdmin: SystemIntakeStatusAdmin;
  grbDate: Time | null;
  grtDate: Time | null;
}

export interface GetRequests_myTrbRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  submittedAt: Time;
  status: TRBRequestStatus;
  nextMeetingDate: Time | null;
}

export interface GetRequests {
  mySystemIntakes: GetRequests_mySystemIntakes[];
  myTrbRequests: GetRequests_myTrbRequests[];
}
