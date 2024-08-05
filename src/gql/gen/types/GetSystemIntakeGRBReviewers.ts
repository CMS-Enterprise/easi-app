/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeGRBReviewerRole, SystemIntakeGRBReviewerVotingRole } from "./../../../types/graphql-global-types";

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
  /**
   * The Common Name of a user. Typically this is a combination of Given and Family name
   */
  commonName: string;
  /**
   * The email address associated to this user account
   */
  email: string;
}

export interface GetSystemIntakeGRBReviewers_systemIntake_grbReviewers {
  __typename: "SystemIntakeGRBReviewer";
  id: UUID;
  grbRole: SystemIntakeGRBReviewerRole;
  votingRole: SystemIntakeGRBReviewerVotingRole;
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
