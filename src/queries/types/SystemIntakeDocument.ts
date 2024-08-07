/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeDocumentCommonType, SystemIntakeDocumentVersion, SystemIntakeDocumentStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: SystemIntakeDocument
// ====================================================

export interface SystemIntakeDocument_documentType {
  __typename: "SystemIntakeDocumentType";
  commonType: SystemIntakeDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface SystemIntakeDocument {
  __typename: "SystemIntakeDocument";
  documentType: SystemIntakeDocument_documentType;
  id: UUID;
  fileName: string;
  version: SystemIntakeDocumentVersion;
  status: SystemIntakeDocumentStatus;
  uploadedAt: Time;
  url: string;
}
