/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SendTRBGuidanceLetterInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: SendTRBGuidanceLetter
// ====================================================

export interface SendTRBGuidanceLetter_sendTRBGuidanceLetter {
  __typename: "TRBGuidanceLetter";
  id: UUID;
}

export interface SendTRBGuidanceLetter {
  sendTRBGuidanceLetter: SendTRBGuidanceLetter_sendTRBGuidanceLetter;
}

export interface SendTRBGuidanceLetterVariables {
  input: SendTRBGuidanceLetterInput;
}
