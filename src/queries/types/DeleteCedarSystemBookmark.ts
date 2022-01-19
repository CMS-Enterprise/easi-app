/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateCedarSystemBookmarkInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteCedarSystemBookmark
// ====================================================

export interface DeleteCedarSystemBookmark_deleteCedarSystemBookmark {
  __typename: "DeleteCedarSystemBookmarkPayload";
  cedarSystemId: string;
}

export interface DeleteCedarSystemBookmark {
  deleteCedarSystemBookmark: DeleteCedarSystemBookmark_deleteCedarSystemBookmark | null;
}

export interface DeleteCedarSystemBookmarkVariables {
  input: CreateCedarSystemBookmarkInput;
}
