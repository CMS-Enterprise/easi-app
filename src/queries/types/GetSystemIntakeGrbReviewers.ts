/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeGRBReviewerRole, SystemIntakeGRBReviewerVotingRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemIntakeGrbReviewers
// ====================================================

export interface GetSystemIntakeGrbReviewers_systemIntake_grbReviewers_userAccount {
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

export interface GetSystemIntakeGrbReviewers_systemIntake_grbReviewers {
  __typename: "SystemIntakeGRBReviewer";
  id: UUID;
  grbRole: SystemIntakeGRBReviewerRole;
  votingRole: SystemIntakeGRBReviewerVotingRole;
  userAccount: GetSystemIntakeGrbReviewers_systemIntake_grbReviewers_userAccount;
}

export interface GetSystemIntakeGrbReviewers_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  grbReviewers: GetSystemIntakeGrbReviewers_systemIntake_grbReviewers[];
}

export interface GetSystemIntakeGrbReviewers {
  systemIntake: GetSystemIntakeGrbReviewers_systemIntake | null;
}

export interface GetSystemIntakeGrbReviewersVariables {
  id: UUID;
}
