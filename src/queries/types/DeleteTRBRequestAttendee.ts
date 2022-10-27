/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PersonRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteTRBRequestAttendee
// ====================================================

export interface DeleteTRBRequestAttendee_deleteTRBRequestAttendee {
  __typename: "TRBRequestAttendee";
  id: UUID;
  euaUserId: string;
  trbRequestId: UUID;
  component: string;
  role: PersonRole;
  createdAt: Time;
}

export interface DeleteTRBRequestAttendee {
  deleteTRBRequestAttendee: DeleteTRBRequestAttendee_deleteTRBRequestAttendee;
}

export interface DeleteTRBRequestAttendeeVariables {
  id: UUID;
}
