/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GRTFeedbackType, SystemIntakeRequestType, SystemIntakeStatus } from "./../../types/graphql-global-types";

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
  endDate: GetSystemIntake_systemIntake_contract_endDate | null;
  hasContract: string | null;
  startDate: GetSystemIntake_systemIntake_contract_startDate | null;
  vehicle: string | null;
}

export interface GetSystemIntake_systemIntake_costs {
  __typename: "SystemIntakeCosts";
  isExpectingIncrease: string | null;
  expectedIncreaseAmount: string | null;
}

export interface GetSystemIntake_systemIntake_grtFeedbacks {
  __typename: "GRTFeedback";
  feedback: string | null;
  feedbackType: GRTFeedbackType | null;
  createdAt: Time | null;
}

export interface GetSystemIntake_systemIntake_governanceTeams_teams {
  __typename: "SystemIntakeCollaborator";
  acronym: string | null;
  collaborator: string | null;
  key: string | null;
  label: string | null;
  name: string | null;
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

export interface GetSystemIntake_systemIntake_fundingSource {
  __typename: "SystemIntakeFundingSource";
  fundingNumber: string | null;
  isFunded: boolean | null;
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

export interface GetSystemIntake_systemIntake_lastAdminNote {
  __typename: "LastAdminNote";
  content: string | null;
  createdAt: Time | null;
}

export interface GetSystemIntake_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  adminLead: string | null;
  businessNeed: string | null;
  businessSolution: string | null;
  businessOwner: GetSystemIntake_systemIntake_businessOwner | null;
  contract: GetSystemIntake_systemIntake_contract | null;
  costs: GetSystemIntake_systemIntake_costs | null;
  currentStage: string | null;
  decisionNextSteps: string | null;
  grbDate: Time | null;
  grtDate: Time | null;
  grtFeedbacks: GetSystemIntake_systemIntake_grtFeedbacks[];
  governanceTeams: GetSystemIntake_systemIntake_governanceTeams | null;
  isso: GetSystemIntake_systemIntake_isso | null;
  fundingSource: GetSystemIntake_systemIntake_fundingSource | null;
  lcid: string | null;
  lcidExpiresAt: Time | null;
  lcidScope: string | null;
  needsEaSupport: boolean | null;
  productManager: GetSystemIntake_systemIntake_productManager | null;
  rejectionReason: string | null;
  requester: GetSystemIntake_systemIntake_requester;
  requestName: string | null;
  requestType: SystemIntakeRequestType;
  status: SystemIntakeStatus;
  grtReviewEmailBody: string | null;
  decidedAt: Time | null;
  businessCaseId: UUID | null;
  submittedAt: Time | null;
  updatedAt: Time;
  createdAt: Time;
  archivedAt: Time | null;
  euaUserId: string;
  lastAdminNote: GetSystemIntake_systemIntake_lastAdminNote;
}

export interface GetSystemIntake {
  systemIntake: GetSystemIntake_systemIntake | null;
}

export interface GetSystemIntakeVariables {
  id: UUID;
}
