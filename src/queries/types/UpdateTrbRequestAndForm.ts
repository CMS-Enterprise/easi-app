/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestFormInput, TRBRequestChanges, TRBWhereInProcessOption, TRBCollabGroupOption, TRBTechnicalReferenceArchitectureOption, TRBNetworkAndSecurityOption, TRBCloudAndInfrastructureOption, TRBApplicationDevelopmentOption, TRBDataAndDataManagementOption, TRBGovernmentProcessesAndPoliciesOption, TRBOtherTechnicalTopicsOption } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRequestAndForm
// ====================================================

export interface UpdateTrbRequestAndForm_updateTRBRequestForm {
  __typename: "TRBRequestForm";
  id: UUID;
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
}

export interface UpdateTrbRequestAndForm_updateTRBRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  form: UpdateTrbRequestAndForm_updateTRBRequest_form;
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
