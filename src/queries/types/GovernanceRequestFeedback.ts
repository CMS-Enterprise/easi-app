/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GovernanceRequestFeedbackTargetForm, GovernanceRequestFeedbackType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: GovernanceRequestFeedback
// ====================================================

export interface GovernanceRequestFeedback_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface GovernanceRequestFeedback {
  __typename: "GovernanceRequestFeedback";
  id: UUID;
  feedback: HTML;
  targetForm: GovernanceRequestFeedbackTargetForm;
  type: GovernanceRequestFeedbackType;
  author: GovernanceRequestFeedback_author | null;
  createdAt: Time;
}
