/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateSystemIntakeDocumentInput, SystemIntakeDocumentCommonType, SystemIntakeDocumentVersion, SystemIntakeDocumentStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeDocument
// ====================================================

export interface CreateSystemIntakeDocument_createSystemIntakeDocument_document_documentType {
  __typename: "SystemIntakeDocumentType";
  commonType: SystemIntakeDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface CreateSystemIntakeDocument_createSystemIntakeDocument_document {
  __typename: "SystemIntakeDocument";
  documentType: CreateSystemIntakeDocument_createSystemIntakeDocument_document_documentType;
  id: UUID;
  fileName: string;
  version: SystemIntakeDocumentVersion;
  status: SystemIntakeDocumentStatus;
  uploadedAt: Time;
  url: string;
}

export interface CreateSystemIntakeDocument_createSystemIntakeDocument {
  __typename: "CreateSystemIntakeDocumentPayload";
  document: CreateSystemIntakeDocument_createSystemIntakeDocument_document | null;
}

export interface CreateSystemIntakeDocument {
  createSystemIntakeDocument: CreateSystemIntakeDocument_createSystemIntakeDocument | null;
}

export interface CreateSystemIntakeDocumentVariables {
  input: CreateSystemIntakeDocumentInput;
}
