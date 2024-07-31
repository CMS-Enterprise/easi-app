/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PersonRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteTRBRequestAttendee
// ====================================================

export interface DeleteTRBRequestAttendee_deleteTRBRequestAttendee_userInfo {
  __typename: "UserInfo";
  commonName: string;
  email: EmailAddress;
  euaUserId: string;
}

export interface DeleteTRBRequestAttendee_deleteTRBRequestAttendee {
  __typename: "TRBRequestAttendee";
  id: UUID;
  trbRequestId: UUID;
  userInfo: DeleteTRBRequestAttendee_deleteTRBRequestAttendee_userInfo | null;
  component: string | null;
  role: PersonRole | null;
  createdAt: Time;
}

export interface DeleteTRBRequestAttendee {
  deleteTRBRequestAttendee: DeleteTRBRequestAttendee_deleteTRBRequestAttendee;
}

export interface DeleteTRBRequestAttendeeVariables {
  id: UUID;
}
