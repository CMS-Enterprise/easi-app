/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBGuidanceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbPublicGuidanceLetter
// ====================================================

export interface GetTrbPublicGuidanceLetter_trbRequest_requesterInfo {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetTrbPublicGuidanceLetter_trbRequest_form {
  __typename: "TRBRequestForm";
  id: UUID;
  submittedAt: Time | null;
  component: string | null;
  needsAssistanceWith: string | null;
}

export interface GetTrbPublicGuidanceLetter_trbRequest_guidanceLetter_insights {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface GetTrbPublicGuidanceLetter_trbRequest_guidanceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface GetTrbPublicGuidanceLetter_trbRequest_guidanceLetter {
  __typename: "TRBGuidanceLetter";
  id: UUID;
  meetingSummary: HTML | null;
  nextSteps: HTML | null;
  isFollowupRecommended: boolean | null;
  dateSent: Time | null;
  followupPoint: string | null;
  /**
   * List of recommendations in the order specified by users
   */
  insights: GetTrbPublicGuidanceLetter_trbRequest_guidanceLetter_insights[];
  author: GetTrbPublicGuidanceLetter_trbRequest_guidanceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface GetTrbPublicGuidanceLetter_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  guidanceLetterStatus: TRBGuidanceLetterStatus;
}

export interface GetTrbPublicGuidanceLetter_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  requesterInfo: GetTrbPublicGuidanceLetter_trbRequest_requesterInfo;
  requesterComponent: string | null;
  form: GetTrbPublicGuidanceLetter_trbRequest_form;
  type: TRBRequestType;
  consultMeetingTime: Time | null;
  guidanceLetter: GetTrbPublicGuidanceLetter_trbRequest_guidanceLetter | null;
  taskStatuses: GetTrbPublicGuidanceLetter_trbRequest_taskStatuses;
}

export interface GetTrbPublicGuidanceLetter {
  trbRequest: GetTrbPublicGuidanceLetter_trbRequest;
}

export interface GetTrbPublicGuidanceLetterVariables {
  id: UUID;
}
