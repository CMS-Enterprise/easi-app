/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTrbAdminNote
// ====================================================

export interface CreateTrbAdminNote_createTRBAdminNote {
  __typename: "TRBAdminNote";
  id: UUID;
}

export interface CreateTrbAdminNote {
  createTRBAdminNote: CreateTrbAdminNote_createTRBAdminNote;
}

export interface CreateTrbAdminNoteVariables {
  input: CreateTRBAdminNoteInput;
}
