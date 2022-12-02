/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBFormStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbTasklist
// ====================================================

export interface GetTrbTasklist_trbRequest_form {
  __typename: "TRBRequestForm";
  status: TRBFormStatus;
}

export interface GetTrbTasklist_trbRequest {
  __typename: "TRBRequest";
  type: TRBRequestType;
  form: GetTrbTasklist_trbRequest_form;
}

export interface GetTrbTasklist {
  trbRequest: GetTrbTasklist_trbRequest;
}

export interface GetTrbTasklistVariables {
  id: UUID;
}
