/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRequestType
// ====================================================

export interface UpdateTrbRequestType_updateTRBRequest {
  __typename: "TRBRequest";
  id: UUID;
  type: TRBRequestType;
}

export interface UpdateTrbRequestType {
  updateTRBRequest: UpdateTrbRequestType_updateTRBRequest;
}

export interface UpdateTrbRequestTypeVariables {
  id: UUID;
  type: TRBRequestType;
}
