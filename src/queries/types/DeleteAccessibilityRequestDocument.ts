/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteAccessibilityRequestDocumentInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteAccessibilityRequestDocument
// ====================================================

export interface DeleteAccessibilityRequestDocument_deleteAccessibilityRequestDocument {
  __typename: "DeleteAccessibilityRequestDocumentPayload";
  id: UUID | null;
}

export interface DeleteAccessibilityRequestDocument {
  deleteAccessibilityRequestDocument: DeleteAccessibilityRequestDocument_deleteAccessibilityRequestDocument | null;
}

export interface DeleteAccessibilityRequestDocumentVariables {
  input: DeleteAccessibilityRequestDocumentInput;
}
