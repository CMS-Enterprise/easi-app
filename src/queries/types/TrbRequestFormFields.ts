/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBWhereInProcessOption, TRBCollabGroupOption } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: TrbRequestFormFields
// ====================================================

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
  collabDateSecurity: Time | null;
  collabDateEnterpriseArchitecture: Time | null;
  collabDateCloud: Time | null;
  collabDatePrivacyAdvisor: Time | null;
  collabDateGovernanceReviewBoard: Time | null;
  collabDateOther: Time | null;
  collabGroupOther: string | null;
}

export interface TrbRequestFormFields {
  __typename: "TRBRequest";
  id: UUID;
  name: string;
  form: TrbRequestFormFields_form;
}
