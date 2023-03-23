/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequests
// ====================================================

export interface GetTrbRequests_trbRequests_form {
  __typename: "TRBRequestForm";
  submittedAt: Time | null;
}

export interface GetTrbRequests_trbRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  status: TRBRequestStatus;
  createdAt: Time;
  form: GetTrbRequests_trbRequests_form;
}

export interface GetTrbRequests {
  trbRequests: GetTrbRequests_trbRequests[];
}
