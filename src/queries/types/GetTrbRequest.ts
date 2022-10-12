/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequest
// ====================================================

export interface GetTrbRequest_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  status: TRBRequestStatus;
  createdAt: Time;
}

export interface GetTrbRequest {
  trbRequest: GetTrbRequest_trbRequest;
}

export interface GetTrbRequestVariables {
  id: UUID;
}
