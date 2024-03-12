/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GovernanceRequestFeedbackTargetForm, GovernanceRequestFeedbackType, SystemIntakeLCIDStatus, SystemIntakeRequestType, SystemIntakeStatusAdmin, SystemIntakeStatusRequester, SystemIntakeDocumentCommonType, SystemIntakeDocumentStatus, SystemIntakeState, SystemIntakeDecisionState, SystemIntakeTRBFollowUp, SystemIntakeFormState } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: SystemIntake
// ====================================================

export interface SystemIntake_businessOwner {
  __typename: "SystemIntakeBusinessOwner";
  component: string | null;
  name: string | null;
}

export interface SystemIntake_contract_endDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface SystemIntake_contract_startDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface SystemIntake_contract {
  __typename: "SystemIntakeContract";
  contractor: string | null;
  endDate: SystemIntake_contract_endDate;
  hasContract: string | null;
  startDate: SystemIntake_contract_startDate;
  vehicle: string | null;
  number: string | null;
}

export interface SystemIntake_costs {
  __typename: "SystemIntakeCosts";
  isExpectingIncrease: string | null;
  expectedIncreaseAmount: string | null;
}

export interface SystemIntake_annualSpending {
  __typename: "SystemIntakeAnnualSpending";
  currentAnnualSpending: string | null;
  currentAnnualSpendingITPortion: string | null;
  plannedYearOneSpending: string | null;
  plannedYearOneSpendingITPortion: string | null;
}

export interface SystemIntake_governanceRequestFeedbacks_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface SystemIntake_governanceRequestFeedbacks {
  __typename: "GovernanceRequestFeedback";
  id: UUID;
  feedback: HTML;
  targetForm: GovernanceRequestFeedbackTargetForm;
  type: GovernanceRequestFeedbackType;
  author: SystemIntake_governanceRequestFeedbacks_author | null;
  createdAt: Time;
}

export interface SystemIntake_governanceTeams_teams {
  __typename: "SystemIntakeCollaborator";
  acronym: string;
  collaborator: string;
  key: string;
  label: string;
  name: string;
}

export interface SystemIntake_governanceTeams {
  __typename: "SystemIntakeGovernanceTeam";
  isPresent: boolean | null;
  teams: SystemIntake_governanceTeams_teams[] | null;
}

export interface SystemIntake_isso {
  __typename: "SystemIntakeISSO";
  isPresent: boolean | null;
  name: string | null;
}

export interface SystemIntake_fundingSources {
  __typename: "SystemIntakeFundingSource";
  source: string | null;
  fundingNumber: string | null;
}

export interface SystemIntake_productManager {
  __typename: "SystemIntakeProductManager";
  component: string | null;
  name: string | null;
}

export interface SystemIntake_requester {
  __typename: "SystemIntakeRequester";
  component: string | null;
  email: string | null;
  name: string;
}

export interface SystemIntake_documents_documentType {
  __typename: "SystemIntakeDocumentType";
  commonType: SystemIntakeDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface SystemIntake_documents {
  __typename: "SystemIntakeDocument";
  documentType: SystemIntake_documents_documentType;
  id: UUID;
  fileName: string;
  status: SystemIntakeDocumentStatus;
  uploadedAt: Time;
  url: string;
}

export interface SystemIntake {
  __typename: "SystemIntake";
  id: UUID;
  adminLead: string | null;
  businessNeed: string | null;
  businessSolution: string | null;
  businessOwner: SystemIntake_businessOwner;
  contract: SystemIntake_contract;
  costs: SystemIntake_costs | null;
  annualSpending: SystemIntake_annualSpending | null;
  currentStage: string | null;
  decisionNextSteps: HTML | null;
  grbDate: Time | null;
  grtDate: Time | null;
  governanceRequestFeedbacks: SystemIntake_governanceRequestFeedbacks[];
  governanceTeams: SystemIntake_governanceTeams;
  isso: SystemIntake_isso;
  existingFunding: boolean | null;
  fundingSources: SystemIntake_fundingSources[];
  lcid: string | null;
  lcidIssuedAt: Time | null;
  lcidExpiresAt: Time | null;
  lcidRetiresAt: Time | null;
  lcidScope: HTML | null;
  lcidCostBaseline: string | null;
  /**
   * Intentionally nullable - lcidStatus is null if (and only if) the intake doesn't have an LCID issued
   */
  lcidStatus: SystemIntakeLCIDStatus | null;
  needsEaSupport: boolean | null;
  productManager: SystemIntake_productManager;
  rejectionReason: HTML | null;
  requester: SystemIntake_requester;
  requestName: string | null;
  requestType: SystemIntakeRequestType;
  statusAdmin: SystemIntakeStatusAdmin;
  statusRequester: SystemIntakeStatusRequester;
  grtReviewEmailBody: string | null;
  decidedAt: Time | null;
  businessCaseId: UUID | null;
  submittedAt: Time | null;
  updatedAt: Time | null;
  createdAt: Time | null;
  archivedAt: Time | null;
  euaUserId: string;
  hasUiChanges: boolean | null;
  documents: SystemIntake_documents[];
  state: SystemIntakeState;
  decisionState: SystemIntakeDecisionState;
  trbFollowUpRecommendation: SystemIntakeTRBFollowUp | null;
  requestFormState: SystemIntakeFormState;
}
