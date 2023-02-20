/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestStatus, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequestSummary
// ====================================================

export interface GetTrbRequestSummary_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  feedbackStatus: TRBFeedbackStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  attendConsultStatus: TRBAttendConsultStatus;
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface GetTrbRequestSummary_trbRequest {
  __typename: "TRBRequest";
  name: string;
  type: TRBRequestType;
  status: TRBRequestStatus;
  trbLead: string | null;
  createdAt: Time;
  taskStatuses: GetTrbRequestSummary_trbRequest_taskStatuses;
}

export interface GetTrbRequestSummary {
  trbRequest: GetTrbRequestSummary_trbRequest;
}

export interface GetTrbRequestSummaryVariables {
  id: UUID;
}
