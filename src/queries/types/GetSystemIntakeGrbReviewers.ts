/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemIntakeGRBReviewers
// ====================================================

export interface GetSystemIntakeGRBReviewers_systemIntake_grbReviewers_userAccount {
  __typename: "UserAccount";
  id: UUID;
  /**
   * The unique username of this user account
   */
  username: string;
}

export interface GetSystemIntakeGRBReviewers_systemIntake_grbReviewers {
  __typename: "SystemIntakeGRBReviewer";
  id: UUID;
  userAccount: GetSystemIntakeGRBReviewers_systemIntake_grbReviewers_userAccount;
}

export interface GetSystemIntakeGRBReviewers_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  grbReviewers: GetSystemIntakeGRBReviewers_systemIntake_grbReviewers[];
}

export interface GetSystemIntakeGRBReviewers {
  systemIntake: GetSystemIntakeGRBReviewers_systemIntake | null;
}

export interface GetSystemIntakeGRBReviewersVariables {
  id: UUID;
}
