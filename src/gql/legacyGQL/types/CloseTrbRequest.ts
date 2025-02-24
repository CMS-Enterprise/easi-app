/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CloseTRBRequestInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CloseTrbRequest
// ====================================================

export interface CloseTrbRequest_closeTRBRequest {
  __typename: "TRBRequest";
  id: UUID;
}

export interface CloseTrbRequest {
  closeTRBRequest: CloseTrbRequest_closeTRBRequest;
}

export interface CloseTrbRequestVariables {
  input: CloseTRBRequestInput;
}
