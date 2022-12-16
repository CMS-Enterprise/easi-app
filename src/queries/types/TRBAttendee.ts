/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PersonRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: TRBAttendee
// ====================================================

export interface TRBAttendee_userInfo {
  __typename: "UserInfo";
  commonName: string;
  email: string;
  euaUserId: string;
}

export interface TRBAttendee {
  __typename: "TRBRequestAttendee";
  id: UUID;
  trbRequestId: UUID;
  userInfo: TRBAttendee_userInfo | null;
  component: string;
  role: PersonRole;
  createdAt: Time;
}
