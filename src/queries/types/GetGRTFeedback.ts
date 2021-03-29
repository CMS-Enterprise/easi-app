/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GRTFeedbackType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetGRTFeedback
// ====================================================

export interface GetGRTFeedback_systemIntake_grtFeedbacks {
  __typename: "GRTFeedback";
  id: UUID | null;
  feedbackType: GRTFeedbackType | null;
  feedback: string | null;
  createdAt: Time | null;
}

export interface GetGRTFeedback_systemIntake {
  __typename: "SystemIntake";
  grtFeedbacks: GetGRTFeedback_systemIntake_grtFeedbacks[];
}

export interface GetGRTFeedback {
  systemIntake: GetGRTFeedback_systemIntake | null;
}

export interface GetGRTFeedbackVariables {
  intakeID: UUID;
}
