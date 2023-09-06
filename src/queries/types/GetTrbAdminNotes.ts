/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbAdminNotes
// ====================================================

export interface GetTrbAdminNotes_trbRequest_adminNotes_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetTrbAdminNotes_trbRequest_adminNotes {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: GetTrbAdminNotes_trbRequest_adminNotes_author;
  createdAt: Time;
}

export interface GetTrbAdminNotes_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  adminNotes: GetTrbAdminNotes_trbRequest_adminNotes[];
}

export interface GetTrbAdminNotes {
  trbRequest: GetTrbAdminNotes_trbRequest;
}

export interface GetTrbAdminNotesVariables {
  id: UUID;
}
