/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateSystemIntakeGRBReviewerInput, SystemIntakeGRBReviewerVotingRole, SystemIntakeGRBReviewerRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateSystemIntakeGRBReviewer
// ====================================================

export interface CreateSystemIntakeGRBReviewer_createSystemIntakeGRBReviewer_userAccount {
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

export interface CreateSystemIntakeGRBReviewer_createSystemIntakeGRBReviewer {
  __typename: "SystemIntakeGRBReviewer";
  id: UUID;
  votingRole: SystemIntakeGRBReviewerVotingRole;
  grbRole: SystemIntakeGRBReviewerRole;
  userAccount: CreateSystemIntakeGRBReviewer_createSystemIntakeGRBReviewer_userAccount;
}

export interface CreateSystemIntakeGRBReviewer {
  createSystemIntakeGRBReviewer: CreateSystemIntakeGRBReviewer_createSystemIntakeGRBReviewer;
}

export interface CreateSystemIntakeGRBReviewerVariables {
  input: CreateSystemIntakeGRBReviewerInput;
}
