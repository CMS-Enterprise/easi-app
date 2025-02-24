/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestState, TRBRequestStatus, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBGuidanceLetterStatus, RequestRelationType } from "./../../../types/graphql-global-types";

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
  guidanceLetterStatus: TRBGuidanceLetterStatus;
}

export interface GetTrbRequestSummary_trbRequest_adminNotes {
  __typename: "TRBAdminNote";
  id: UUID;
}

export interface GetTrbRequestSummary_trbRequest_contractNumbers {
  __typename: "TRBRequestContractNumber";
  id: UUID;
  contractNumber: string;
}

export interface GetTrbRequestSummary_trbRequest_systems_businessOwnerRoles {
  __typename: "CedarRole";
  objectID: string;
  assigneeFirstName: string | null;
  assigneeLastName: string | null;
}

export interface GetTrbRequestSummary_trbRequest_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
  description: string | null;
  acronym: string | null;
  businessOwnerOrg: string | null;
  businessOwnerRoles: GetTrbRequestSummary_trbRequest_systems_businessOwnerRoles[];
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
  relationType: RequestRelationType | null;
  contractName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetTrbRequestSummary_trbRequest_contractNumbers[];
  /**
   * Linked systems
   */
  systems: GetTrbRequestSummary_trbRequest_systems[];
}

export interface GetTrbRequestSummary {
  trbRequest: GetTrbRequestSummary_trbRequest;
}

export interface GetTrbRequestSummaryVariables {
  id: UUID;
}
