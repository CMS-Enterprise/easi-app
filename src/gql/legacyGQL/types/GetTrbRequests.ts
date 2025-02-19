/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestStatus, TRBRequestState } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequests
// ====================================================

export interface GetTrbRequests_myTrbRequests_form {
  __typename: "TRBRequestForm";
  submittedAt: Time | null;
}

export interface GetTrbRequests_myTrbRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  status: TRBRequestStatus;
  state: TRBRequestState;
  createdAt: Time;
  form: GetTrbRequests_myTrbRequests_form;
}

export interface GetTrbRequests {
  myTrbRequests: GetTrbRequests_myTrbRequests[];
}
