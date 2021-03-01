/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateAccessibilityRequestDocumentInput, AccessibilityRequestDocumentStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateAccessibilityRequestDocument
// ====================================================

export interface CreateAccessibilityRequestDocument_createAccessibilityRequestDocument_accessibilityRequestDocument {
  __typename: "AccessibilityRequestDocument";
  id: UUID;
  mimeType: string;
  name: string;
  status: AccessibilityRequestDocumentStatus;
  uploadedAt: Time;
  requestID: UUID;
}

export interface CreateAccessibilityRequestDocument_createAccessibilityRequestDocument_userErrors {
  __typename: "UserError";
  message: string;
  path: string[];
}

export interface CreateAccessibilityRequestDocument_createAccessibilityRequestDocument {
  __typename: "CreateAccessibilityRequestDocumentPayload";
  accessibilityRequestDocument: CreateAccessibilityRequestDocument_createAccessibilityRequestDocument_accessibilityRequestDocument | null;
  userErrors: CreateAccessibilityRequestDocument_createAccessibilityRequestDocument_userErrors[] | null;
}

export interface CreateAccessibilityRequestDocument {
  createAccessibilityRequestDocument: CreateAccessibilityRequestDocument_createAccessibilityRequestDocument | null;
}

export interface CreateAccessibilityRequestDocumentVariables {
  input: CreateAccessibilityRequestDocumentInput;
}
