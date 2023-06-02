/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBAdviceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbAdviceLetter
// ====================================================

export interface GetTrbAdviceLetter_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations {
  __typename: "TRBAdviceLetterRecommendation";
  id: UUID;
  title: string;
  recommendation: string;
  links: string[];
}

export interface GetTrbAdviceLetter_trbRequest_adviceLetter_author {
  __typename: "UserInfo";
  euaUserId: string;
  commonName: string;
}

export interface GetTrbAdviceLetter_trbRequest_adviceLetter {
  __typename: "TRBAdviceLetter";
  id: UUID;
  meetingSummary: string | null;
  nextSteps: string | null;
  isFollowupRecommended: boolean | null;
  dateSent: Time | null;
  followupPoint: string | null;
  recommendations: GetTrbAdviceLetter_trbRequest_adviceLetter_recommendations[];
  author: GetTrbAdviceLetter_trbRequest_adviceLetter_author;
  createdAt: Time;
  modifiedAt: Time | null;
}

export interface GetTrbAdviceLetter_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  taskStatuses: GetTrbAdviceLetter_trbRequest_taskStatuses;
  adviceLetter: GetTrbAdviceLetter_trbRequest_adviceLetter | null;
}

export interface GetTrbAdviceLetter {
  trbRequest: GetTrbAdviceLetter_trbRequest;
}

export interface GetTrbAdviceLetterVariables {
  id: UUID;
}
