/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: TRBAdminNoteFragment
// ====================================================

export interface TRBAdminNoteFragment_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface TRBAdminNoteFragment {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: TRBAdminNoteFragment_author;
  createdAt: Time;
}
