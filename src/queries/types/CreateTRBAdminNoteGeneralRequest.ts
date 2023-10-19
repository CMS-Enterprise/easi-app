/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteGeneralRequestInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteGeneralRequest
// ====================================================

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_author;
  createdAt: Time;
}

export interface CreateTRBAdminNoteGeneralRequest {
  createTRBAdminNoteGeneralRequest: CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest;
}

export interface CreateTRBAdminNoteGeneralRequestVariables {
  input: CreateTRBAdminNoteGeneralRequestInput;
}
