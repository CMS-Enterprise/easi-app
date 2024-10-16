/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBGuidanceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbGuidanceLetter
// ====================================================

export interface GetTrbGuidanceLetter_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  guidanceLetterStatus: TRBGuidanceLetterStatus;
}

export interface GetTrbGuidanceLetter_trbRequest_guidanceLetter_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface GetTrbGuidanceLetter_trbRequest_guidanceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface GetTrbGuidanceLetter_trbRequest_guidanceLetter {
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
  recommendations: GetTrbGuidanceLetter_trbRequest_guidanceLetter_recommendations[];
  author: GetTrbGuidanceLetter_trbRequest_guidanceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface GetTrbGuidanceLetter_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  type: TRBRequestType;
  createdAt: Time;
  consultMeetingTime: Time | null;
  taskStatuses: GetTrbGuidanceLetter_trbRequest_taskStatuses;
  guidanceLetter: GetTrbGuidanceLetter_trbRequest_guidanceLetter | null;
}

export interface GetTrbGuidanceLetter {
  trbRequest: GetTrbGuidanceLetter_trbRequest;
}

export interface GetTrbGuidanceLetterVariables {
  id: UUID;
}
