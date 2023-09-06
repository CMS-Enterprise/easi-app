/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBFeedbackAction } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequestFeedback
// ====================================================

export interface GetTrbRequestFeedback_trbRequest_feedback_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetTrbRequestFeedback_trbRequest_feedback {
  __typename: "TRBRequestFeedback";
  id: UUID;
  action: TRBFeedbackAction;
  feedbackMessage: HTML;
  author: GetTrbRequestFeedback_trbRequest_feedback_author;
  createdAt: Time;
}

export interface GetTrbRequestFeedback_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  feedback: GetTrbRequestFeedback_trbRequest_feedback[];
}

export interface GetTrbRequestFeedback {
  trbRequest: GetTrbRequestFeedback_trbRequest;
}

export interface GetTrbRequestFeedbackVariables {
  id: UUID;
}
