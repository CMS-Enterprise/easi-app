/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestFormInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbForm
// ====================================================

export interface UpdateTrbForm_updateTRBRequestForm {
  __typename: "TRBRequestForm";
  id: UUID;
}

export interface UpdateTrbForm {
  updateTRBRequestForm: UpdateTrbForm_updateTRBRequestForm;
}

export interface UpdateTrbFormVariables {
  input: UpdateTRBRequestFormInput;
}
