/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestState, TRBRequestStatus, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequestSummary
// ====================================================

export interface GetTrbRequestSummary_trbRequest_trbLeadInfo {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetTrbRequestSummary_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  feedbackStatus: TRBFeedbackStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  attendConsultStatus: TRBAttendConsultStatus;
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface GetTrbRequestSummary_trbRequest_adminNotes {
  __typename: "TRBAdminNote";
  id: UUID;
}

export interface GetTrbRequestSummary_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  type: TRBRequestType;
  state: TRBRequestState;
  status: TRBRequestStatus;
  trbLeadInfo: GetTrbRequestSummary_trbRequest_trbLeadInfo;
  createdAt: Time;
  taskStatuses: GetTrbRequestSummary_trbRequest_taskStatuses;
  adminNotes: GetTrbRequestSummary_trbRequest_adminNotes[];
}

export interface GetTrbRequestSummary {
  trbRequest: GetTrbRequestSummary_trbRequest;
}

export interface GetTrbRequestSummaryVariables {
  id: UUID;
}
