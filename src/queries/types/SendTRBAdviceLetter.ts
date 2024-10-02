/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SendTRBGuidanceLetterInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: SendTRBAdviceLetter
// ====================================================

export interface SendTRBAdviceLetter_sendTRBAdviceLetter {
  __typename: "TRBGuidanceLetter";
  id: UUID;
}

export interface SendTRBAdviceLetter {
  sendTRBAdviceLetter: SendTRBAdviceLetter_sendTRBAdviceLetter;
}

export interface SendTRBAdviceLetterVariables {
  input: SendTRBGuidanceLetterInput;
}
