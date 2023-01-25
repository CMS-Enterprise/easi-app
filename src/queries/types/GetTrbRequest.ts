/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestStatus, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBAdviceLetterStatus, TRBWhereInProcessOption, TRBCollabGroupOption, TRBTechnicalReferenceArchitectureOption, TRBNetworkAndSecurityOption, TRBCloudAndInfrastructureOption, TRBApplicationDevelopmentOption, TRBDataAndDataManagementOption, TRBGovernmentProcessesAndPoliciesOption, TRBOtherTechnicalTopicsOption, TRBFeedbackAction } from "./../../types/graphql-global-types";

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
  subjectAreaTechnicalReferenceArchitecture: TRBTechnicalReferenceArchitectureOption[] | null;
  subjectAreaNetworkAndSecurity: TRBNetworkAndSecurityOption[] | null;
  subjectAreaCloudAndInfrastructure: TRBCloudAndInfrastructureOption[] | null;
  subjectAreaApplicationDevelopment: TRBApplicationDevelopmentOption[] | null;
  subjectAreaDataAndDataManagement: TRBDataAndDataManagementOption[] | null;
  subjectAreaGovernmentProcessesAndPolicies: TRBGovernmentProcessesAndPoliciesOption[] | null;
  subjectAreaOtherTechnicalTopics: TRBOtherTechnicalTopicsOption[] | null;
  subjectAreaTechnicalReferenceArchitectureOther: string | null;
  subjectAreaNetworkAndSecurityOther: string | null;
  subjectAreaCloudAndInfrastructureOther: string | null;
  subjectAreaApplicationDevelopmentOther: string | null;
  subjectAreaDataAndDataManagementOther: string | null;
  subjectAreaGovernmentProcessesAndPoliciesOther: string | null;
  subjectAreaOtherTechnicalTopicsOther: string | null;
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
  feedbackMessage: string;
  author: GetTrbRequest_trbRequest_feedback_author;
  createdAt: Time;
}

export interface GetTrbRequest_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  createdBy: string;
  createdAt: Time;
  type: TRBRequestType;
  status: TRBRequestStatus;
  taskStatuses: GetTrbRequest_trbRequest_taskStatuses;
  trbLead: string | null;
  form: GetTrbRequest_trbRequest_form;
  feedback: GetTrbRequest_trbRequest_feedback[];
}

export interface GetTrbRequest {
  trbRequest: GetTrbRequest_trbRequest;
}

export interface GetTrbRequestVariables {
  id: UUID;
}
