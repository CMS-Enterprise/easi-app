/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestState, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus, TRBWhereInProcessOption, TRBCollabGroupOption, TRBSubjectAreaOption, TRBFeedbackAction } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTrbRequest
// ====================================================

export interface CreateTrbRequest_createTRBRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  feedbackStatus: TRBFeedbackStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  attendConsultStatus: TRBAttendConsultStatus;
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface CreateTrbRequest_createTRBRequest_form_fundingSources {
  __typename: "TRBFundingSource";
  id: UUID;
  fundingNumber: string;
  source: string;
}

export interface CreateTrbRequest_createTRBRequest_form_systemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  lcid: string | null;
}

export interface CreateTrbRequest_createTRBRequest_form {
  __typename: "TRBRequestForm";
  id: UUID;
  component: string | null;
  needsAssistanceWith: string | null;
  hasSolutionInMind: boolean | null;
  proposedSolution: string | null;
  whereInProcess: TRBWhereInProcessOption | null;
  whereInProcessOther: string | null;
  hasExpectedStartEndDates: boolean | null;
  expectedStartDate: Time | null;
  expectedEndDate: Time | null;
  collabGroups: TRBCollabGroupOption[];
  collabDateSecurity: string | null;
  collabDateEnterpriseArchitecture: string | null;
  collabDateCloud: string | null;
  collabDatePrivacyAdvisor: string | null;
  collabDateGovernanceReviewBoard: string | null;
  collabDateOther: string | null;
  collabGroupOther: string | null;
  collabGRBConsultRequested: boolean | null;
  subjectAreaOptions: TRBSubjectAreaOption[] | null;
  subjectAreaOptionOther: string | null;
  fundingSources: CreateTrbRequest_createTRBRequest_form_fundingSources[] | null;
  systemIntakes: CreateTrbRequest_createTRBRequest_form_systemIntakes[];
  submittedAt: Time | null;
}

export interface CreateTrbRequest_createTRBRequest_feedback_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTrbRequest_createTRBRequest_feedback {
  __typename: "TRBRequestFeedback";
  id: UUID;
  action: TRBFeedbackAction;
  feedbackMessage: string;
  author: CreateTrbRequest_createTRBRequest_feedback_author;
  createdAt: Time;
}

export interface CreateTrbRequest_createTRBRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  type: TRBRequestType;
  state: TRBRequestState;
  taskStatuses: CreateTrbRequest_createTRBRequest_taskStatuses;
  form: CreateTrbRequest_createTRBRequest_form;
  feedback: CreateTrbRequest_createTRBRequest_feedback[];
}

export interface CreateTrbRequest {
  createTRBRequest: CreateTrbRequest_createTRBRequest;
}

export interface CreateTrbRequestVariables {
  requestType: TRBRequestType;
}
