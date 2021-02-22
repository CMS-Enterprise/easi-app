/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GeneratePresignedUploadURLInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: GeneratePresignedUploadURL
// ====================================================

export interface GeneratePresignedUploadURL_generatePresignedUploadURL_userErrors {
  __typename: "UserError";
  message: string;
  path: string[];
}

export interface GeneratePresignedUploadURL_generatePresignedUploadURL {
  __typename: "GeneratePresignedUploadURLPayload";
  url: string | null;
  userErrors: GeneratePresignedUploadURL_generatePresignedUploadURL_userErrors[] | null;
}

export interface GeneratePresignedUploadURL {
  generatePresignedUploadURL: GeneratePresignedUploadURL_generatePresignedUploadURL | null;
}

export interface GeneratePresignedUploadURLVariables {
  input: GeneratePresignedUploadURLInput;
}
