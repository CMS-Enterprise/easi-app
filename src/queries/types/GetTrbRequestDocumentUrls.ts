/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrbRequestDocumentUrls
// ====================================================

export interface GetTrbRequestDocumentUrls_trbRequest_documents {
  __typename: "TRBRequestDocument";
  id: UUID;
  url: string;
  fileName: string;
}

export interface GetTrbRequestDocumentUrls_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  documents: GetTrbRequestDocumentUrls_trbRequest_documents[];
}

export interface GetTrbRequestDocumentUrls {
  trbRequest: GetTrbRequestDocumentUrls_trbRequest;
}

export interface GetTrbRequestDocumentUrlsVariables {
  id: UUID;
}
