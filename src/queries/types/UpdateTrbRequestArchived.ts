/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateTrbRequestArchived
// ====================================================

export interface UpdateTrbRequestArchived_updateTRBRequest {
  __typename: "TRBRequest";
  id: UUID;
  archived: boolean;
}

export interface UpdateTrbRequestArchived {
  updateTRBRequest: UpdateTrbRequestArchived_updateTRBRequest;
}

export interface UpdateTrbRequestArchivedVariables {
  id: UUID;
  archived: boolean;
}
