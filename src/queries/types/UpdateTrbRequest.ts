/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestChanges, TRBRequestType, TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRequest
// ====================================================

export interface UpdateTrbRequest_updateTRBRequest {
  __typename: "TRBRequest";
  name: string;
  archived: boolean;
  type: TRBRequestType;
  status: TRBRequestStatus;
}

export interface UpdateTrbRequest {
  updateTRBRequest: UpdateTrbRequest_updateTRBRequest;
}

export interface UpdateTrbRequestVariables {
  id: UUID;
  changes?: TRBRequestChanges | null;
}
