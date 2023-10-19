/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteSupportingDocumentsInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteSupportingDocuments
// ====================================================

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_author;
  createdAt: Time;
}

export interface CreateTRBAdminNoteSupportingDocuments {
  createTRBAdminNoteSupportingDocuments: CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments;
}

export interface CreateTRBAdminNoteSupportingDocumentsVariables {
  input: CreateTRBAdminNoteSupportingDocumentsInput;
}
