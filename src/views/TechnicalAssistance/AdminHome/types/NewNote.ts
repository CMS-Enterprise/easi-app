/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBAdminNoteCategory } from "./../../../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: NewNote
// ====================================================

export interface NewNote_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface NewNote {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: string;
  author: NewNote_author;
  createdAt: Time;
}
