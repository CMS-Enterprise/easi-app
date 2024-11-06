/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestStatus, TRBRequestState, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbAdminTeamHome
// ====================================================

export interface GetTrbAdminTeamHome_trbRequests_trbLeadInfo {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetTrbAdminTeamHome_trbRequests_requesterInfo {
  __typename: "UserInfo";
  commonName: string;
}

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

export interface GetTrbAdminTeamHome_trbRequests_contractNumbers {
  __typename: "TRBRequestContractNumber";
  contractNumber: string;
}

export interface GetTrbAdminTeamHome_trbRequests_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
}

export interface GetTrbAdminTeamHome_trbRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  type: TRBRequestType;
  isRecent: boolean;
  status: TRBRequestStatus;
  state: TRBRequestState;
  consultMeetingTime: Time | null;
  trbLeadInfo: GetTrbAdminTeamHome_trbRequests_trbLeadInfo;
  requesterComponent: string | null;
  requesterInfo: GetTrbAdminTeamHome_trbRequests_requesterInfo;
  taskStatuses: GetTrbAdminTeamHome_trbRequests_taskStatuses;
  form: GetTrbAdminTeamHome_trbRequests_form;
  contractName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetTrbAdminTeamHome_trbRequests_contractNumbers[];
  /**
   * Linked systems
   */
  systems: GetTrbAdminTeamHome_trbRequests_systems[];
}

export interface GetTrbAdminTeamHome {
  trbRequests: GetTrbAdminTeamHome_trbRequests[];
}
