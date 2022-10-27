/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBRequestAttendeeInput, PersonRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBRequestAttendee
// ====================================================

export interface CreateTRBRequestAttendee_createTRBRequestAttendee {
  __typename: "TRBRequestAttendee";
  id: UUID;
  euaUserId: string;
  trbRequestId: UUID;
  component: string;
  role: PersonRole;
  createdAt: Time;
}

export interface CreateTRBRequestAttendee {
  createTRBRequestAttendee: CreateTRBRequestAttendee_createTRBRequestAttendee;
}

export interface CreateTRBRequestAttendeeVariables {
  input: CreateTRBRequestAttendeeInput;
}
