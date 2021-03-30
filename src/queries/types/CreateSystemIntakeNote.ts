/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateSystemIntakeNoteInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeNote
// ====================================================

export interface CreateSystemIntakeNote_createSystemIntakeNote_author {
  __typename: "SystemIntakeNoteAuthor";
  name: string;
  eua: string;
}

export interface CreateSystemIntakeNote_createSystemIntakeNote {
  __typename: "SystemIntakeNote";
  id: UUID;
  createdAt: Time;
  content: string;
  author: CreateSystemIntakeNote_createSystemIntakeNote_author;
}

export interface CreateSystemIntakeNote {
  createSystemIntakeNote: CreateSystemIntakeNote_createSystemIntakeNote | null;
}

export interface CreateSystemIntakeNoteVariables {
  input: CreateSystemIntakeNoteInput;
}
