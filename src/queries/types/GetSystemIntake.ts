/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GovernanceRequestFeedbackTargetForm, GovernanceRequestFeedbackType, SystemIntakeLCIDStatus, SystemIntakeRequestType, SystemIntakeStatusAdmin, SystemIntakeStatusRequester, SystemIntakeDocumentCommonType, SystemIntakeDocumentVersion, SystemIntakeDocumentStatus, SystemIntakeState, SystemIntakeDecisionState, SystemIntakeTRBFollowUp, SystemIntakeFormState, RequestRelationType, TRBRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemIntake
// ====================================================

export interface GetSystemIntake_systemIntake_businessOwner {
  __typename: "SystemIntakeBusinessOwner";
  component: string | null;
  name: string | null;
}

export interface GetSystemIntake_systemIntake_contract_endDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface GetSystemIntake_systemIntake_contract_startDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface GetSystemIntake_systemIntake_contract {
  __typename: "SystemIntakeContract";
  contractor: string | null;
  endDate: GetSystemIntake_systemIntake_contract_endDate;
  hasContract: string | null;
  startDate: GetSystemIntake_systemIntake_contract_startDate;
  vehicle: string | null;
}

export interface GetSystemIntake_systemIntake_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  id: UUID;
  contractNumber: string;
}

export interface GetSystemIntake_systemIntake_costs {
  __typename: "SystemIntakeCosts";
  isExpectingIncrease: string | null;
  expectedIncreaseAmount: string | null;
}

export interface GetSystemIntake_systemIntake_annualSpending {
  __typename: "SystemIntakeAnnualSpending";
  currentAnnualSpending: string | null;
  currentAnnualSpendingITPortion: string | null;
  plannedYearOneSpending: string | null;
  plannedYearOneSpendingITPortion: string | null;
}

export interface GetSystemIntake_systemIntake_governanceRequestFeedbacks_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetSystemIntake_systemIntake_governanceRequestFeedbacks {
  __typename: "GovernanceRequestFeedback";
  id: UUID;
  feedback: HTML;
  targetForm: GovernanceRequestFeedbackTargetForm;
  type: GovernanceRequestFeedbackType;
  author: GetSystemIntake_systemIntake_governanceRequestFeedbacks_author | null;
  createdAt: Time;
}

export interface GetSystemIntake_systemIntake_governanceTeams_teams {
  __typename: "SystemIntakeCollaborator";
  acronym: string;
  collaborator: string;
  key: string;
  label: string;
  name: string;
}

export interface GetSystemIntake_systemIntake_governanceTeams {
  __typename: "SystemIntakeGovernanceTeam";
  isPresent: boolean | null;
  teams: GetSystemIntake_systemIntake_governanceTeams_teams[] | null;
}

export interface GetSystemIntake_systemIntake_isso {
  __typename: "SystemIntakeISSO";
  isPresent: boolean | null;
  name: string | null;
}

export interface GetSystemIntake_systemIntake_fundingSources {
  __typename: "SystemIntakeFundingSource";
  id: UUID;
  fundingNumber: string | null;
  source: string | null;
}

export interface GetSystemIntake_systemIntake_productManager {
  __typename: "SystemIntakeProductManager";
  component: string | null;
  name: string | null;
}

export interface GetSystemIntake_systemIntake_requester {
  __typename: "SystemIntakeRequester";
  component: string | null;
  email: string | null;
  name: string;
}

export interface GetSystemIntake_systemIntake_documents_documentType {
  __typename: "SystemIntakeDocumentType";
  commonType: SystemIntakeDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface GetSystemIntake_systemIntake_documents {
  __typename: "SystemIntakeDocument";
  documentType: GetSystemIntake_systemIntake_documents_documentType;
  id: UUID;
  fileName: string;
  version: SystemIntakeDocumentVersion;
  status: SystemIntakeDocumentStatus;
  uploadedAt: Time;
  url: string;
}

export interface GetSystemIntake_systemIntake_systems_businessOwnerRoles {
  __typename: "CedarRole";
  objectID: string;
  assigneeFirstName: string | null;
  assigneeLastName: string | null;
}

export interface GetSystemIntake_systemIntake_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
  description: string | null;
  acronym: string | null;
  businessOwnerOrg: string | null;
  businessOwnerRoles: GetSystemIntake_systemIntake_systems_businessOwnerRoles[];
}

export interface GetSystemIntake_systemIntake_relatedTRBRequests_contractNumbers {
  __typename: "TRBRequestContractNumber";
  contractNumber: string;
}

export interface GetSystemIntake_systemIntake_relatedTRBRequests {
  __typename: "TRBRequest";
  id: UUID;
  name: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetSystemIntake_systemIntake_relatedTRBRequests_contractNumbers[];
  status: TRBRequestStatus;
  createdAt: Time;
}

export interface GetSystemIntake_systemIntake_relatedIntakes_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  contractNumber: string;
}

export interface GetSystemIntake_systemIntake_relatedIntakes {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetSystemIntake_systemIntake_relatedIntakes_contractNumbers[];
  decisionState: SystemIntakeDecisionState;
  submittedAt: Time | null;
}

export interface GetSystemIntake_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  adminLead: string | null;
  businessNeed: string | null;
  businessSolution: string | null;
  businessOwner: GetSystemIntake_systemIntake_businessOwner;
  contract: GetSystemIntake_systemIntake_contract;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetSystemIntake_systemIntake_contractNumbers[];
  costs: GetSystemIntake_systemIntake_costs | null;
  annualSpending: GetSystemIntake_systemIntake_annualSpending | null;
  currentStage: string | null;
  decisionNextSteps: HTML | null;
  grbDate: Time | null;
  grtDate: Time | null;
  governanceRequestFeedbacks: GetSystemIntake_systemIntake_governanceRequestFeedbacks[];
  governanceTeams: GetSystemIntake_systemIntake_governanceTeams;
  isso: GetSystemIntake_systemIntake_isso;
  existingFunding: boolean | null;
  fundingSources: GetSystemIntake_systemIntake_fundingSources[];
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
  productManager: GetSystemIntake_systemIntake_productManager;
  rejectionReason: HTML | null;
  requester: GetSystemIntake_systemIntake_requester;
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
  documents: GetSystemIntake_systemIntake_documents[];
  state: SystemIntakeState;
  decisionState: SystemIntakeDecisionState;
  trbFollowUpRecommendation: SystemIntakeTRBFollowUp | null;
  requestFormState: SystemIntakeFormState;
  relationType: RequestRelationType | null;
  contractName: string | null;
  /**
   * Linked systems
   */
  systems: GetSystemIntake_systemIntake_systems[];
  /**
   * TRB Requests that share a CEDAR System or Contract Number
   */
  relatedTRBRequests: GetSystemIntake_systemIntake_relatedTRBRequests[];
  /**
   * Other System Intakes that share a CEDAR System or Contract Number
   */
  relatedIntakes: GetSystemIntake_systemIntake_relatedIntakes[];
}

export interface GetSystemIntake {
  systemIntake: GetSystemIntake_systemIntake | null;
}

export interface GetSystemIntakeVariables {
  id: UUID;
}
