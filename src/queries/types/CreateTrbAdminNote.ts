/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTrbAdminNote
// ====================================================

export interface CreateTrbAdminNote_createTRBAdminNote_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTrbAdminNote_createTRBAdminNote {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTrbAdminNote_createTRBAdminNote_author;
  createdAt: Time;
}

export interface CreateTrbAdminNote {
  createTRBAdminNote: CreateTrbAdminNote_createTRBAdminNote;
}

export interface CreateTrbAdminNoteVariables {
  input: CreateTRBAdminNoteInput;
}
