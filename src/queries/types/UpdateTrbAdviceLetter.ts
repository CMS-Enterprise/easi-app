/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBAdviceLetterInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbAdviceLetter
// ====================================================

export interface UpdateTrbAdviceLetter_updateTRBAdviceLetter {
  __typename: "TRBAdviceLetter";
  id: UUID;
  meetingSummary: string | null;
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  followupPoint: string | null;
  createdBy: string;
  createdAt: Time;
  modifiedBy: string | null;
  modifiedAt: Time | null;
}

export interface UpdateTrbAdviceLetter {
  updateTRBAdviceLetter: UpdateTrbAdviceLetter_updateTRBAdviceLetter;
}

export interface UpdateTrbAdviceLetterVariables {
  input: UpdateTRBAdviceLetterInput;
}
