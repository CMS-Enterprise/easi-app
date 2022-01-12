/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateCedarSystemBookmarkInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateCedarSystemBookmark
// ====================================================

export interface CreateCedarSystemBookmark_createCedarSystemBookmark_cedarSystemBookmark {
  __typename: "CedarSystemBookmark";
  euaUserId: string;
  cedarSystemId: string;
}

export interface CreateCedarSystemBookmark_createCedarSystemBookmark {
  __typename: "CreateCedarSystemBookmarkPayload";
  cedarSystemBookmark: CreateCedarSystemBookmark_createCedarSystemBookmark_cedarSystemBookmark | null;
}

export interface CreateCedarSystemBookmark {
  createCedarSystemBookmark: CreateCedarSystemBookmark_createCedarSystemBookmark | null;
}

export interface CreateCedarSystemBookmarkVariables {
  input: CreateCedarSystemBookmarkInput;
}
