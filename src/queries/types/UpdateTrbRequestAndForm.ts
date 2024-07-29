/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestFormInput, TRBRequestChanges, TRBRequestType, TRBRequestState, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus, TRBWhereInProcessOption, TRBCollabGroupOption, TRBSubjectAreaOption, TRBFeedbackAction, TRBRequestStatus, SystemIntakeDecisionState } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRequestAndForm
// ====================================================

export interface UpdateTrbRequestAndForm_updateTRBRequestForm {
  __typename: "TRBRequestForm";
  id: UUID;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  feedbackStatus: TRBFeedbackStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  attendConsultStatus: TRBAttendConsultStatus;
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_form_fundingSources {
  __typename: "TRBFundingSource";
  id: UUID;
  fundingNumber: string;
  source: string;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_form_systemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  lcid: string | null;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_form {
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
  fundingSources: UpdateTrbRequestAndForm_updateTRBRequest_form_fundingSources[] | null;
  systemIntakes: UpdateTrbRequestAndForm_updateTRBRequest_form_systemIntakes[];
  submittedAt: Time | null;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_feedback_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_feedback {
  __typename: "TRBRequestFeedback";
  id: UUID;
  action: TRBFeedbackAction;
  feedbackMessage: HTML;
  author: UpdateTrbRequestAndForm_updateTRBRequest_feedback_author;
  createdAt: Time;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_relatedTRBRequests_contractNumbers {
  __typename: "TRBRequestContractNumber";
  contractNumber: string;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_relatedTRBRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: UpdateTrbRequestAndForm_updateTRBRequest_relatedTRBRequests_contractNumbers[];
  status: TRBRequestStatus;
  createdAt: Time;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_relatedIntakes_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  contractNumber: string;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest_relatedIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: UpdateTrbRequestAndForm_updateTRBRequest_relatedIntakes_contractNumbers[];
  decisionState: SystemIntakeDecisionState;
  submittedAt: Time | null;
}

export interface UpdateTrbRequestAndForm_updateTRBRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  type: TRBRequestType;
  state: TRBRequestState;
  taskStatuses: UpdateTrbRequestAndForm_updateTRBRequest_taskStatuses;
  form: UpdateTrbRequestAndForm_updateTRBRequest_form;
  feedback: UpdateTrbRequestAndForm_updateTRBRequest_feedback[];
  /**
   * Other TRB Requests that share a CEDAR System or Contract Number
   */
  relatedTRBRequests: UpdateTrbRequestAndForm_updateTRBRequest_relatedTRBRequests[];
  /**
   * System Intakes that share a CEDAR System or Contract Number
   */
  relatedIntakes: UpdateTrbRequestAndForm_updateTRBRequest_relatedIntakes[];
}

export interface UpdateTrbRequestAndForm {
  updateTRBRequestForm: UpdateTrbRequestAndForm_updateTRBRequestForm;
  updateTRBRequest: UpdateTrbRequestAndForm_updateTRBRequest;
}

export interface UpdateTrbRequestAndFormVariables {
  input: UpdateTRBRequestFormInput;
  id: UUID;
  changes?: TRBRequestChanges | null;
}
