/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteInitialRequestFormInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteInitialRequestForm
// ====================================================

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_author;
  createdAt: Time;
}

export interface CreateTRBAdminNoteInitialRequestForm {
  createTRBAdminNoteInitialRequestForm: CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm;
}

export interface CreateTRBAdminNoteInitialRequestFormVariables {
  input: CreateTRBAdminNoteInitialRequestFormInput;
}
