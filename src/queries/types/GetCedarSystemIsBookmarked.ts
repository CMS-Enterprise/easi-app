/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCedarSystemIsBookmarked
// ====================================================

export interface GetCedarSystemIsBookmarked_cedarSystem {
  __typename: "CedarSystem";
  id: string;
  isBookmarked: boolean;
}

export interface GetCedarSystemIsBookmarked {
  cedarSystem: GetCedarSystemIsBookmarked_cedarSystem | null;
}

export interface GetCedarSystemIsBookmarkedVariables {
  id: string;
}
