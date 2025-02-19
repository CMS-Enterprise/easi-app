/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBDocumentCommonType, TRBRequestDocumentStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequestDocuments
// ====================================================

export interface GetTrbRequestDocuments_trbRequest_documents_documentType {
  __typename: "TRBRequestDocumentType";
  commonType: TRBDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface GetTrbRequestDocuments_trbRequest_documents {
  __typename: "TRBRequestDocument";
  id: UUID;
  fileName: string;
  documentType: GetTrbRequestDocuments_trbRequest_documents_documentType;
  status: TRBRequestDocumentStatus;
  uploadedAt: Time;
}

export interface GetTrbRequestDocuments_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  documents: GetTrbRequestDocuments_trbRequest_documents[];
}

export interface GetTrbRequestDocuments {
  trbRequest: GetTrbRequestDocuments_trbRequest;
}

export interface GetTrbRequestDocumentsVariables {
  id: UUID;
}
