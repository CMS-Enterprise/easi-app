/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeGRBReviewerInput, SystemIntakeGRBReviewerVotingRole, SystemIntakeGRBReviewerRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeGRBReviewer
// ====================================================

export interface UpdateSystemIntakeGRBReviewer_updateSystemIntakeGRBReviewer_userAccount {
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

export interface UpdateSystemIntakeGRBReviewer_updateSystemIntakeGRBReviewer {
  __typename: "SystemIntakeGRBReviewer";
  id: UUID;
  votingRole: SystemIntakeGRBReviewerVotingRole;
  grbRole: SystemIntakeGRBReviewerRole;
  userAccount: UpdateSystemIntakeGRBReviewer_updateSystemIntakeGRBReviewer_userAccount;
}

export interface UpdateSystemIntakeGRBReviewer {
  updateSystemIntakeGRBReviewer: UpdateSystemIntakeGRBReviewer_updateSystemIntakeGRBReviewer;
}

export interface UpdateSystemIntakeGRBReviewerVariables {
  input: UpdateSystemIntakeGRBReviewerInput;
}
