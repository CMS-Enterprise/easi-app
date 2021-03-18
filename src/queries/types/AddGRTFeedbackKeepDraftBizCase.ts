/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddGRTFeedbackInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: AddGRTFeedbackKeepDraftBizCase
// ====================================================

export interface AddGRTFeedbackKeepDraftBizCase_addGRTFeedbackAndKeepBusinessCaseInDraft {
  __typename: "AddGRTFeedbackPayload";
  id: UUID | null;
}

export interface AddGRTFeedbackKeepDraftBizCase {
  addGRTFeedbackAndKeepBusinessCaseInDraft: AddGRTFeedbackKeepDraftBizCase_addGRTFeedbackAndKeepBusinessCaseInDraft | null;
}

export interface AddGRTFeedbackKeepDraftBizCaseVariables {
  input: AddGRTFeedbackInput;
}
