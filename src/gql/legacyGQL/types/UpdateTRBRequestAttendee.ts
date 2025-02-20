/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestAttendeeInput, PersonRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTRBRequestAttendee
// ====================================================

export interface UpdateTRBRequestAttendee_updateTRBRequestAttendee_userInfo {
  __typename: "UserInfo";
  commonName: string;
  email: EmailAddress;
  euaUserId: string;
}

export interface UpdateTRBRequestAttendee_updateTRBRequestAttendee {
  __typename: "TRBRequestAttendee";
  id: UUID;
  trbRequestId: UUID;
  userInfo: UpdateTRBRequestAttendee_updateTRBRequestAttendee_userInfo | null;
  component: string | null;
  role: PersonRole | null;
  createdAt: Time;
}

export interface UpdateTRBRequestAttendee {
  updateTRBRequestAttendee: UpdateTRBRequestAttendee_updateTRBRequestAttendee;
}

export interface UpdateTRBRequestAttendeeVariables {
  input: UpdateTRBRequestAttendeeInput;
}
