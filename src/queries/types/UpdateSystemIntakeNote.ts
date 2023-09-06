/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeNoteInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeNote
// ====================================================

export interface UpdateSystemIntakeNote_updateSystemIntakeNote {
  __typename: "SystemIntakeNote";
  id: UUID;
  content: HTML;
}

export interface UpdateSystemIntakeNote {
  updateSystemIntakeNote: UpdateSystemIntakeNote_updateSystemIntakeNote;
}

export interface UpdateSystemIntakeNoteVariables {
  input: UpdateSystemIntakeNoteInput;
}
