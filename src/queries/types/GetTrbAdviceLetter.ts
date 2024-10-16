/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBGuidanceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbAdviceLetter
// ====================================================

export interface GetTrbAdviceLetter_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  guidanceLetterStatus: TRBGuidanceLetterStatus;
}

export interface GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

export interface GetTrbAdviceLetter_trbRequest_adviceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface GetTrbAdviceLetter_trbRequest_adviceLetter {
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
  recommendations: GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations[];
  author: GetTrbAdviceLetter_trbRequest_adviceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface GetTrbAdviceLetter_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  type: TRBRequestType;
  createdAt: Time;
  consultMeetingTime: Time | null;
  taskStatuses: GetTrbAdviceLetter_trbRequest_taskStatuses;
  adviceLetter: GetTrbAdviceLetter_trbRequest_adviceLetter | null;
}

export interface GetTrbAdviceLetter {
  trbRequest: GetTrbAdviceLetter_trbRequest;
}

export interface GetTrbAdviceLetterVariables {
  id: UUID;
}
