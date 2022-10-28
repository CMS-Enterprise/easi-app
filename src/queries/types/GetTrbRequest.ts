/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBWhereInProcessOption, TRBCollabGroupOption } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequest
// ====================================================

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
  collabDateSecurity: Time | null;
  collabDateEnterpriseArchitecture: Time | null;
  collabDateCloud: Time | null;
  collabDatePrivacyAdvisor: Time | null;
  collabDateGovernanceReviewBoard: Time | null;
  collabDateOther: Time | null;
  collabGroupOther: string | null;
}

export interface GetTrbRequest_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  form: GetTrbRequest_trbRequest_form;
}

export interface GetTrbRequest {
  trbRequest: GetTrbRequest_trbRequest;
}

export interface GetTrbRequestVariables {
  id: UUID;
}
