/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestFormInput, TRBWhereInProcessOption, TRBCollabGroupOption } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRequestForm
// ====================================================

export interface UpdateTrbRequestForm_updateTRBRequestForm {
  __typename: "TRBRequestForm";
  id: UUID;
}

export interface UpdateTrbRequestForm_updateTRBRequest_form {
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

export interface UpdateTrbRequestForm_updateTRBRequest {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  form: UpdateTrbRequestForm_updateTRBRequest_form;
}

export interface UpdateTrbRequestForm {
  updateTRBRequestForm: UpdateTrbRequestForm_updateTRBRequestForm;
  updateTRBRequest: UpdateTrbRequestForm_updateTRBRequest;
}

export interface UpdateTrbRequestFormVariables {
  input: UpdateTRBRequestFormInput;
  id: UUID;
  name?: string | null;
}
