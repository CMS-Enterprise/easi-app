/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GovernanceRequestFeedbackTargetForm, GovernanceRequestFeedbackType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetGovernanceRequestFeedback
// ====================================================

export interface GetGovernanceRequestFeedback_systemIntake_governanceRequestFeedbacks_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetGovernanceRequestFeedback_systemIntake_governanceRequestFeedbacks {
  __typename: "GovernanceRequestFeedback";
  id: UUID;
  feedback: HTML;
  targetForm: GovernanceRequestFeedbackTargetForm;
  type: GovernanceRequestFeedbackType;
  author: GetGovernanceRequestFeedback_systemIntake_governanceRequestFeedbacks_author;
  createdAt: Time;
}

export interface GetGovernanceRequestFeedback_systemIntake {
  __typename: "SystemIntake";
  governanceRequestFeedbacks: GetGovernanceRequestFeedback_systemIntake_governanceRequestFeedbacks[];
}

export interface GetGovernanceRequestFeedback {
  systemIntake: GetGovernanceRequestFeedback_systemIntake | null;
}

export interface GetGovernanceRequestFeedbackVariables {
  intakeID: UUID;
}
