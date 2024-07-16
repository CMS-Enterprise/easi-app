/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SystemIntakeGRBReviewer
// ====================================================

export interface SystemIntakeGRBReviewer_userAccount {
  __typename: "UserAccount";
  id: UUID;
  /**
   * The unique username of this user account
   */
  username: string;
}

export interface SystemIntakeGRBReviewer {
  __typename: "SystemIntakeGRBReviewer";
  id: UUID;
  userAccount: SystemIntakeGRBReviewer_userAccount;
}
