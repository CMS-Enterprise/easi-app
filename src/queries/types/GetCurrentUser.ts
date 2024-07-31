/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUser
// ====================================================

export interface GetCurrentUser_currentUser_launchDarkly {
  __typename: "LaunchDarklySettings";
  userKey: string;
  signedHash: string;
}

export interface GetCurrentUser_currentUser {
  __typename: "CurrentUser";
  launchDarkly: GetCurrentUser_currentUser_launchDarkly;
}

export interface GetCurrentUser {
  currentUser: GetCurrentUser_currentUser | null;
}
