/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReopenTRBRequestInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: ReopenTrbRequest
// ====================================================

export interface ReopenTrbRequest_reopenTrbRequest {
  __typename: "TRBRequest";
  id: UUID;
}

export interface ReopenTrbRequest {
  reopenTrbRequest: ReopenTrbRequest_reopenTrbRequest;
}

export interface ReopenTrbRequestVariables {
  input: ReopenTRBRequestInput;
}
