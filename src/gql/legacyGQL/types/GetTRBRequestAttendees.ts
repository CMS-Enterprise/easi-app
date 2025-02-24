/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PersonRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTRBRequestAttendees
// ====================================================

export interface GetTRBRequestAttendees_trbRequest_attendees_userInfo {
  __typename: "UserInfo";
  commonName: string;
  email: EmailAddress;
  euaUserId: string;
}

export interface GetTRBRequestAttendees_trbRequest_attendees {
  __typename: "TRBRequestAttendee";
  id: UUID;
  trbRequestId: UUID;
  userInfo: GetTRBRequestAttendees_trbRequest_attendees_userInfo | null;
  component: string | null;
  role: PersonRole | null;
  createdAt: Time;
}

export interface GetTRBRequestAttendees_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  attendees: GetTRBRequestAttendees_trbRequest_attendees[];
}

export interface GetTRBRequestAttendees {
  trbRequest: GetTRBRequestAttendees_trbRequest;
}

export interface GetTRBRequestAttendeesVariables {
  id: UUID;
}
