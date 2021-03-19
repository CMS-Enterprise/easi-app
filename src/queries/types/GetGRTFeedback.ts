/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GRTFeedbackType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetGRTFeedback
// ====================================================

export interface GetGRTFeedback_grtFeedbacks {
  __typename: "GRTFeedback";
  feedback: string | null;
  feedbackType: GRTFeedbackType | null;
  createdAt: Time | null;
}

export interface GetGRTFeedback {
  grtFeedbacks: GetGRTFeedback_grtFeedbacks[] | null;
}

export interface GetGRTFeedbackVariables {
  intakeID: UUID;
}
