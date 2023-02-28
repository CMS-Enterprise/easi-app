/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBRequestFeedbackInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTrbRequestFeedbackQuery
// ====================================================

export interface CreateTrbRequestFeedbackQuery_createTRBRequestFeedback {
  __typename: "TRBRequestFeedback";
  id: UUID;
}

export interface CreateTrbRequestFeedbackQuery {
  createTRBRequestFeedback: CreateTrbRequestFeedbackQuery_createTRBRequestFeedback;
}

export interface CreateTrbRequestFeedbackQueryVariables {
  input: CreateTRBRequestFeedbackInput;
}
