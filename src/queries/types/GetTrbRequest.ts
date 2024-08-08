/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestState, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus, TRBWhereInProcessOption, TRBCollabGroupOption, TRBSubjectAreaOption, TRBFeedbackAction, TRBRequestStatus, SystemIntakeDecisionState } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequest
// ====================================================

export interface GetTrbRequest_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  feedbackStatus: TRBFeedbackStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  attendConsultStatus: TRBAttendConsultStatus;
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface GetTrbRequest_trbRequest_form_fundingSources {
  __typename: "TRBFundingSource";
  id: UUID;
  fundingNumber: string;
  source: string;
}

export interface GetTrbRequest_trbRequest_form_systemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  lcid: string | null;
}

export interface GetTrbRequest_trbRequest_form {
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
  /**
   * TODO: Make Funding sources non-nullable
   */
  fundingSources: GetTrbRequest_trbRequest_form_fundingSources[] | null;
  systemIntakes: GetTrbRequest_trbRequest_form_systemIntakes[];
  submittedAt: Time | null;
}

export interface GetTrbRequest_trbRequest_feedback_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetTrbRequest_trbRequest_feedback {
  __typename: "TRBRequestFeedback";
  id: UUID;
  action: TRBFeedbackAction;
  feedbackMessage: HTML;
  author: GetTrbRequest_trbRequest_feedback_author;
  createdAt: Time;
}

export interface GetTrbRequest_trbRequest_relatedTRBRequests_contractNumbers {
  __typename: "TRBRequestContractNumber";
  contractNumber: string;
}

export interface GetTrbRequest_trbRequest_relatedTRBRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetTrbRequest_trbRequest_relatedTRBRequests_contractNumbers[];
  status: TRBRequestStatus;
  createdAt: Time;
}

export interface GetTrbRequest_trbRequest_relatedIntakes_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  contractNumber: string;
}

export interface GetTrbRequest_trbRequest_relatedIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetTrbRequest_trbRequest_relatedIntakes_contractNumbers[];
  decisionState: SystemIntakeDecisionState;
  submittedAt: Time | null;
}

export interface GetTrbRequest_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  type: TRBRequestType;
  state: TRBRequestState;
  taskStatuses: GetTrbRequest_trbRequest_taskStatuses;
  form: GetTrbRequest_trbRequest_form;
  feedback: GetTrbRequest_trbRequest_feedback[];
  /**
   * Other TRB Requests that share a CEDAR System or Contract Number
   */
  relatedTRBRequests: GetTrbRequest_trbRequest_relatedTRBRequests[];
  /**
   * System Intakes that share a CEDAR System or Contract Number
   */
  relatedIntakes: GetTrbRequest_trbRequest_relatedIntakes[];
}

export interface GetTrbRequest {
  trbRequest: GetTrbRequest_trbRequest;
}

export interface GetTrbRequestVariables {
  id: UUID;
}
