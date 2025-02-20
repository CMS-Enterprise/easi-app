/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBRequestAttendeeInput, PersonRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBRequestAttendee
// ====================================================

export interface CreateTRBRequestAttendee_createTRBRequestAttendee_userInfo {
  __typename: "UserInfo";
  commonName: string;
  email: EmailAddress;
  euaUserId: string;
}

export interface CreateTRBRequestAttendee_createTRBRequestAttendee {
  __typename: "TRBRequestAttendee";
  id: UUID;
  trbRequestId: UUID;
  userInfo: CreateTRBRequestAttendee_createTRBRequestAttendee_userInfo | null;
  component: string | null;
  role: PersonRole | null;
  createdAt: Time;
}

export interface CreateTRBRequestAttendee {
  createTRBRequestAttendee: CreateTRBRequestAttendee_createTRBRequestAttendee;
}

export interface CreateTRBRequestAttendeeVariables {
  input: CreateTRBRequestAttendeeInput;
}
