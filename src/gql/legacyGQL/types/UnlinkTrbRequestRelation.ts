/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnlinkTrbRequestRelation
// ====================================================

export interface UnlinkTrbRequestRelation_unlinkTRBRequestRelation {
  __typename: "TRBRequest";
  id: UUID;
}

export interface UnlinkTrbRequestRelation {
  unlinkTRBRequestRelation: UnlinkTrbRequestRelation_unlinkTRBRequestRelation | null;
}

export interface UnlinkTrbRequestRelationVariables {
  trbRequestID: UUID;
}
