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
  note: string;
  authorName: string;
  requestID: UUID;
  createdAt: Time;
}

export interface CreateAccessibilityRequestNote_createAccessibilityRequestNote_userErrors {
  __typename: "UserError";
  message: string;
  path: string[];
}

export interface CreateAccessibilityRequestNote_createAccessibilityRequestNote {
  __typename: "CreateAccessibilityRequestNotePayload";
  accessibilityRequestNote: CreateAccessibilityRequestNote_createAccessibilityRequestNote_accessibilityRequestNote;
  userErrors: CreateAccessibilityRequestNote_createAccessibilityRequestNote_userErrors[] | null;
}

export interface CreateAccessibilityRequestNote {
  createAccessibilityRequestNote: CreateAccessibilityRequestNote_createAccessibilityRequestNote | null;
}

export interface CreateAccessibilityRequestNoteVariables {
  input: CreateAccessibilityRequestNoteInput;
}
