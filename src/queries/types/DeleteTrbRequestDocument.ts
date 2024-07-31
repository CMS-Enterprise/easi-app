/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTrbRequestDocument
// ====================================================

export interface DeleteTrbRequestDocument_deleteTRBRequestDocument_document {
  __typename: "TRBRequestDocument";
  fileName: string;
}

export interface DeleteTrbRequestDocument_deleteTRBRequestDocument {
  __typename: "DeleteTRBRequestDocumentPayload";
  document: DeleteTrbRequestDocument_deleteTRBRequestDocument_document | null;
}

export interface DeleteTrbRequestDocument {
  deleteTRBRequestDocument: DeleteTrbRequestDocument_deleteTRBRequestDocument | null;
}

export interface DeleteTrbRequestDocumentVariables {
  id: UUID;
}
