/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestStatus, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbAdminTeamHome
// ====================================================

export interface GetTrbAdminTeamHome_trbRequests_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  feedbackStatus: TRBFeedbackStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  attendConsultStatus: TRBAttendConsultStatus;
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface GetTrbAdminTeamHome_trbRequests_form {
  __typename: "TRBRequestForm";
  submittedAt: Time | null;
}

export interface GetTrbAdminTeamHome_trbRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  type: TRBRequestType;
  isRecent: boolean;
  status: TRBRequestStatus;
  trbLead: string | null;
  consultMeetingTime: Time | null;
  taskStatuses: GetTrbAdminTeamHome_trbRequests_taskStatuses;
  form: GetTrbAdminTeamHome_trbRequests_form;
}

export interface GetTrbAdminTeamHome {
  trbRequests: GetTrbAdminTeamHome_trbRequests[];
}
