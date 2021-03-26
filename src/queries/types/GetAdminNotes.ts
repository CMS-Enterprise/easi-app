/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAdminNotes
// ====================================================

export interface GetAdminNotes_systemIntake_notes_author {
  __typename: "SystemIntakeNoteAuthor";
  name: string;
  eua: string;
}

export interface GetAdminNotes_systemIntake_notes {
  __typename: "SystemIntakeNote";
  id: UUID;
  createdAt: Time;
  content: string;
  author: GetAdminNotes_systemIntake_notes_author;
}

export interface GetAdminNotes_systemIntake {
  __typename: "SystemIntake";
  notes: GetAdminNotes_systemIntake_notes[];
}

export interface GetAdminNotes {
  systemIntake: GetAdminNotes_systemIntake | null;
}

export interface GetAdminNotesVariables {
  id: UUID;
}
