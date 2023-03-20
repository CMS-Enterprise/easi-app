/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbTasklist
// ====================================================

export interface GetTrbTasklist_trbRequest_form {
  __typename: "TRBRequestForm";
  status: TRBFormStatus;
}

export interface GetTrbTasklist_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  feedbackStatus: TRBFeedbackStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  attendConsultStatus: TRBAttendConsultStatus;
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface GetTrbTasklist_trbRequest_feedback {
  __typename: "TRBRequestFeedback";
  id: UUID;
}

export interface GetTrbTasklist_trbRequest {
  __typename: "TRBRequest";
  type: TRBRequestType;
  form: GetTrbTasklist_trbRequest_form;
  taskStatuses: GetTrbTasklist_trbRequest_taskStatuses;
  feedback: GetTrbTasklist_trbRequest_feedback[];
  consultMeetingTime: Time | null;
}

export interface GetTrbTasklist {
  trbRequest: GetTrbTasklist_trbRequest;
}

export interface GetTrbTasklistVariables {
  id: UUID;
}
