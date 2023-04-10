/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: TRBAdminNote
// ====================================================

export interface TRBAdminNote_adminNotes_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface TRBAdminNote_adminNotes {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: string;
  author: TRBAdminNote_adminNotes_author;
  createdAt: Time;
}

export interface TRBAdminNote {
  __typename: "TRBRequest";
  id: UUID;
  adminNotes: TRBAdminNote_adminNotes[];
}
