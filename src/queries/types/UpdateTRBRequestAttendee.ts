/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestAttendeeInput, PersonRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTRBRequestAttendee
// ====================================================

export interface UpdateTRBRequestAttendee_updateTRBRequestAttendee {
  __typename: "TRBRequestAttendee";
  id: UUID;
  euaUserId: string;
  trbRequestId: UUID;
  component: string;
  role: PersonRole;
  createdAt: Time;
}

export interface UpdateTRBRequestAttendee {
  updateTRBRequestAttendee: UpdateTRBRequestAttendee_updateTRBRequestAttendee;
}

export interface UpdateTRBRequestAttendeeVariables {
  input: UpdateTRBRequestAttendeeInput;
}
