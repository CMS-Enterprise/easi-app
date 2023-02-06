/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBRequestType, TRBRequestStatus, TRBFormStatus, TRBFeedbackStatus, TRBConsultPrepStatus, TRBAttendConsultStatus, TRBWhereInProcessOption, TRBCollabGroupOption, TRBTechnicalReferenceArchitectureOption, TRBNetworkAndSecurityOption, TRBCloudAndInfrastructureOption, TRBApplicationDevelopmentOption, TRBDataAndDataManagementOption, TRBGovernmentProcessesAndPoliciesOption, TRBOtherTechnicalTopicsOption, TRBFeedbackAction } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: TrbRequestFormFields
// ====================================================

export interface TrbRequestFormFields_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  feedbackStatus: TRBFeedbackStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  attendConsultStatus: TRBAttendConsultStatus;
}

export interface TrbRequestFormFields_form {
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

export interface TrbRequestFormFields_feedback_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface TrbRequestFormFields_feedback {
  __typename: "TRBRequestFeedback";
  id: UUID;
  action: TRBFeedbackAction;
  feedbackMessage: string;
  author: TrbRequestFormFields_feedback_author;
  createdAt: Time;
}

export interface TrbRequestFormFields {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  createdBy: string;
  createdAt: Time;
  type: TRBRequestType;
  status: TRBRequestStatus;
  taskStatuses: TrbRequestFormFields_taskStatuses;
  trbLead: string | null;
  form: TrbRequestFormFields_form;
  feedback: TrbRequestFormFields_feedback[];
}
