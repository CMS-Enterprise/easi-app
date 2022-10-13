/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTrbRequest
// ====================================================

export interface CreateTrbRequest_createTRBRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  status: TRBRequestStatus;
  createdAt: Time;
}

export interface CreateTrbRequest {
  createTRBRequest: CreateTrbRequest_createTRBRequest;
}

export interface CreateTrbRequestVariables {
  requestType: TRBRequestType;
}
