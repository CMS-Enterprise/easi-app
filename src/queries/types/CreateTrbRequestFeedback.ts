/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBRequestFeedbackInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTrbRequestFeedback
// ====================================================

export interface CreateTrbRequestFeedback_createTRBRequestFeedback {
  __typename: "TRBRequestFeedback";
  id: UUID;
}

export interface CreateTrbRequestFeedback {
  createTRBRequestFeedback: CreateTrbRequestFeedback_createTRBRequestFeedback;
}

export interface CreateTrbRequestFeedbackVariables {
  input: CreateTRBRequestFeedbackInput;
}
