/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PersonRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTRBRequestAttendees
// ====================================================

export interface GetTRBRequestAttendees_trbRequest_attendees {
  __typename: "TRBRequestAttendee";
  id: UUID;
  euaUserId: string;
  trbRequestId: UUID;
  component: string;
  role: PersonRole;
  createdAt: Time;
}

export interface GetTRBRequestAttendees_trbRequest {
  __typename: "TRBRequest";
  attendees: GetTRBRequestAttendees_trbRequest_attendees[];
}

export interface GetTRBRequestAttendees {
  trbRequest: GetTRBRequestAttendees_trbRequest;
}

export interface GetTRBRequestAttendeesVariables {
  id: UUID;
}
