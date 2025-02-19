/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBRequestDocumentInput, TRBDocumentCommonType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTrbRequestDocument
// ====================================================

export interface CreateTrbRequestDocument_createTRBRequestDocument_document_documentType {
  __typename: "TRBRequestDocumentType";
  commonType: TRBDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface CreateTrbRequestDocument_createTRBRequestDocument_document {
  __typename: "TRBRequestDocument";
  id: UUID;
  documentType: CreateTrbRequestDocument_createTRBRequestDocument_document_documentType;
  fileName: string;
}

export interface CreateTrbRequestDocument_createTRBRequestDocument {
  __typename: "CreateTRBRequestDocumentPayload";
  document: CreateTrbRequestDocument_createTRBRequestDocument_document | null;
}

export interface CreateTrbRequestDocument {
  createTRBRequestDocument: CreateTrbRequestDocument_createTRBRequestDocument | null;
}

export interface CreateTrbRequestDocumentVariables {
  input: CreateTRBRequestDocumentInput;
}
