/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeDocumentCommonType, SystemIntakeDocumentVersion, SystemIntakeDocumentStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteSystemIntakeDocument
// ====================================================

export interface DeleteSystemIntakeDocument_deleteSystemIntakeDocument_document_documentType {
  __typename: "SystemIntakeDocumentType";
  commonType: SystemIntakeDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface DeleteSystemIntakeDocument_deleteSystemIntakeDocument_document {
  __typename: "SystemIntakeDocument";
  documentType: DeleteSystemIntakeDocument_deleteSystemIntakeDocument_document_documentType;
  id: UUID;
  fileName: string;
  version: SystemIntakeDocumentVersion;
  status: SystemIntakeDocumentStatus;
  uploadedAt: Time;
  url: string;
}

export interface DeleteSystemIntakeDocument_deleteSystemIntakeDocument {
  __typename: "DeleteSystemIntakeDocumentPayload";
  document: DeleteSystemIntakeDocument_deleteSystemIntakeDocument_document | null;
}

export interface DeleteSystemIntakeDocument {
  deleteSystemIntakeDocument: DeleteSystemIntakeDocument_deleteSystemIntakeDocument | null;
}

export interface DeleteSystemIntakeDocumentVariables {
  id: UUID;
}
