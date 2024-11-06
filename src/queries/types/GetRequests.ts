/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeStatusRequester, SystemIntakeStatusAdmin, TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetRequests
// ====================================================

export interface GetRequests_mySystemIntakes_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
}

export interface GetRequests_mySystemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  submittedAt: Time | null;
  statusRequester: SystemIntakeStatusRequester;
  statusAdmin: SystemIntakeStatusAdmin;
  grbDate: Time | null;
  grtDate: Time | null;
  /**
   * Linked systems
   */
  systems: GetRequests_mySystemIntakes_systems[];
  lcid: string | null;
  nextMeetingDate: Time | null;
  lastMeetingDate: Time | null;
}

export interface GetRequests_myTrbRequests_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
}

export interface GetRequests_myTrbRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  submittedAt: Time;
  status: TRBRequestStatus;
  nextMeetingDate: Time | null;
  lastMeetingDate: Time | null;
  /**
   * Linked systems
   */
  systems: GetRequests_myTrbRequests_systems[];
}

export interface GetRequests {
  mySystemIntakes: GetRequests_mySystemIntakes[];
  myTrbRequests: GetRequests_myTrbRequests[];
}
