/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteAdviceLetterInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteAdviceLetter
// ====================================================

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_author;
  createdAt: Time;
}

export interface CreateTRBAdminNoteAdviceLetter {
  createTRBAdminNoteAdviceLetter: CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter;
}

export interface CreateTRBAdminNoteAdviceLetterVariables {
  input: CreateTRBAdminNoteAdviceLetterInput;
}
