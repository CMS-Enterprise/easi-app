/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateAccessibilityRequestNoteInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateAccessibilityRequestNote
// ====================================================

export interface CreateAccessibilityRequestNote_createAccessibilityRequestNote_accessibilityRequestNote {
  __typename: "AccessibilityRequestNote";
  id: UUID;
}

export interface CreateAccessibilityRequestNote_createAccessibilityRequestNote {
  __typename: "CreateAccessibilityRequestNotePayload";
  accessibilityRequestNote: CreateAccessibilityRequestNote_createAccessibilityRequestNote_accessibilityRequestNote;
}

export interface CreateAccessibilityRequestNote {
  createAccessibilityRequestNote: CreateAccessibilityRequestNote_createAccessibilityRequestNote | null;
}

export interface CreateAccessibilityRequestNoteVariables {
  input: CreateAccessibilityRequestNoteInput;
}
