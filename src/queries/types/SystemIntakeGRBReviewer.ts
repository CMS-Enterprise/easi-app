/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeGRBReviewerVotingRole, SystemIntakeGRBReviewerRole } from "./../../types/graphql-global-types";

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
  /**
   * The Common Name of a user. Typically this is a combination of Given and Family name
   */
  commonName: string;
  /**
   * The email address associated to this user account
   */
  email: string;
}

export interface SystemIntakeGRBReviewer {
  __typename: "SystemIntakeGRBReviewer";
  id: UUID;
  votingRole: SystemIntakeGRBReviewerVotingRole;
  grbRole: SystemIntakeGRBReviewerRole;
  userAccount: SystemIntakeGRBReviewer_userAccount;
}
