/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GovernanceRequestFeedbackTargetForm, GovernanceRequestFeedbackType, SystemIntakeLCIDStatus, SystemIntakeRequestType, SystemIntakeStatusAdmin, SystemIntakeStatusRequester, SystemIntakeDocumentCommonType, SystemIntakeDocumentVersion, SystemIntakeDocumentStatus, SystemIntakeState, SystemIntakeDecisionState, SystemIntakeTRBFollowUp, SystemIntakeFormState, RequestRelationType, TRBRequestStatus } from "./../../types/graphql-global-types";

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
}

export interface SystemIntake_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  id: UUID;
  contractNumber: string;
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
  id: UUID;
  fundingNumber: string | null;
  source: string | null;
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
  version: SystemIntakeDocumentVersion;
  status: SystemIntakeDocumentStatus;
  uploadedAt: Time;
  url: string;
}

export interface SystemIntake_systems_businessOwnerRoles {
  __typename: "CedarRole";
  objectID: string;
  assigneeFirstName: string | null;
  assigneeLastName: string | null;
}

export interface SystemIntake_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
  description: string | null;
  acronym: string | null;
  businessOwnerOrg: string | null;
  businessOwnerRoles: SystemIntake_systems_businessOwnerRoles[];
}

export interface SystemIntake_relatedTRBRequests_contractNumbers {
  __typename: "TRBRequestContractNumber";
  contractNumber: string;
}

export interface SystemIntake_relatedTRBRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: SystemIntake_relatedTRBRequests_contractNumbers[];
  status: TRBRequestStatus;
  createdAt: Time;
}

export interface SystemIntake_relatedIntakes_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  contractNumber: string;
}

export interface SystemIntake_relatedIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: SystemIntake_relatedIntakes_contractNumbers[];
  decisionState: SystemIntakeDecisionState;
  submittedAt: Time | null;
}

export interface SystemIntake {
  __typename: "SystemIntake";
  id: UUID;
  adminLead: string | null;
  businessNeed: string | null;
  businessSolution: string | null;
  businessOwner: SystemIntake_businessOwner;
  contract: SystemIntake_contract;
  /**
   * Linked contract numbers
   */
  contractNumbers: SystemIntake_contractNumbers[];
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
  euaUserId: string | null;
  hasUiChanges: boolean | null;
  documents: SystemIntake_documents[];
  state: SystemIntakeState;
  decisionState: SystemIntakeDecisionState;
  trbFollowUpRecommendation: SystemIntakeTRBFollowUp | null;
  requestFormState: SystemIntakeFormState;
  relationType: RequestRelationType | null;
  contractName: string | null;
  /**
   * Linked systems
   */
  systems: SystemIntake_systems[];
  /**
   * TRB Requests that share a CEDAR System or Contract Number
   */
  relatedTRBRequests: SystemIntake_relatedTRBRequests[];
  /**
   * Other System Intakes that share a CEDAR System or Contract Number
   */
  relatedIntakes: SystemIntake_relatedIntakes[];
}
