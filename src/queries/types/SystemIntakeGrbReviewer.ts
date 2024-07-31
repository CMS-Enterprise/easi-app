/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SystemIntakeGrbReviewer
// ====================================================

export interface SystemIntakeGrbReviewer_userAccount {
  __typename: "UserAccount";
  id: UUID;
  /**
   * The unique username of this user account
   */
  username: string;
}

export interface SystemIntakeGrbReviewer {
  __typename: "SystemIntakeGRBReviewer";
  id: UUID;
  userAccount: SystemIntakeGrbReviewer_userAccount;
}
