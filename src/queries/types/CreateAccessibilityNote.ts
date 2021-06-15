/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateAccessibilityNoteInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateAccessibilityNote
// ====================================================

export interface CreateAccessibilityNote_createAccessibilityNote_accessibilityNote {
  __typename: "AccessibilityNote";
  id: UUID;
}

export interface CreateAccessibilityNote_createAccessibilityNote {
  __typename: "CreateAccessibilityNotePayload";
  accessibilityNote: CreateAccessibilityNote_createAccessibilityNote_accessibilityNote;
}

export interface CreateAccessibilityNote {
  createAccessibilityNote: CreateAccessibilityNote_createAccessibilityNote | null;
}

export interface CreateAccessibilityNoteVariables {
  input: CreateAccessibilityNoteInput;
}
