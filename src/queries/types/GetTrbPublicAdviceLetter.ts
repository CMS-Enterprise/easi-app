/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBAdviceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbPublicAdviceLetter
// ====================================================

export interface GetTrbPublicAdviceLetter_trbRequest_requesterInfo {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetTrbPublicAdviceLetter_trbRequest_form {
  __typename: "TRBRequestForm";
  id: UUID;
  submittedAt: Time | null;
  component: string | null;
  needsAssistanceWith: string | null;
}

export interface GetTrbPublicAdviceLetter_trbRequest_adviceLetter_recommendations {
  __typename: "TRBAdviceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: string;
  links: string[];
}

export interface GetTrbPublicAdviceLetter_trbRequest_adviceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface GetTrbPublicAdviceLetter_trbRequest_adviceLetter {
  __typename: "TRBAdviceLetter";
  id: UUID;
  meetingSummary: string | null;
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  dateSent: Time | null;
  followupPoint: string | null;
  recommendations: GetTrbPublicAdviceLetter_trbRequest_adviceLetter_recommendations[];
  author: GetTrbPublicAdviceLetter_trbRequest_adviceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface GetTrbPublicAdviceLetter_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface GetTrbPublicAdviceLetter_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  requesterInfo: GetTrbPublicAdviceLetter_trbRequest_requesterInfo;
  requesterComponent: string | null;
  form: GetTrbPublicAdviceLetter_trbRequest_form;
  type: TRBRequestType;
  consultMeetingTime: Time | null;
  adviceLetter: GetTrbPublicAdviceLetter_trbRequest_adviceLetter | null;
  taskStatuses: GetTrbPublicAdviceLetter_trbRequest_taskStatuses;
}

export interface GetTrbPublicAdviceLetter {
  trbRequest: GetTrbPublicAdviceLetter_trbRequest;
}

export interface GetTrbPublicAdviceLetterVariables {
  id: UUID;
}
