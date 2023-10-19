/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteConsultSessionInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteConsultSession
// ====================================================

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_author;
  createdAt: Time;
}

export interface CreateTRBAdminNoteConsultSession {
  createTRBAdminNoteConsultSession: CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession;
}

export interface CreateTRBAdminNoteConsultSessionVariables {
  input: CreateTRBAdminNoteConsultSessionInput;
}
