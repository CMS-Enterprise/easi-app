/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeRequestType, SystemIntakeStatus, SystemIntakeState } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: SystemIntakeForCsv
// ====================================================

export interface SystemIntakeForCsv_requester {
  __typename: "SystemIntakeRequester";
  name: string;
  component: string | null;
}

export interface SystemIntakeForCsv_businessOwner {
  __typename: "SystemIntakeBusinessOwner";
  name: string | null;
  component: string | null;
}

export interface SystemIntakeForCsv_productManager {
  __typename: "SystemIntakeProductManager";
  name: string | null;
  component: string | null;
}

export interface SystemIntakeForCsv_isso {
  __typename: "SystemIntakeISSO";
  name: string | null;
}

export interface SystemIntakeForCsv_governanceTeams_teams {
  __typename: "SystemIntakeCollaborator";
  collaborator: string;
}

export interface SystemIntakeForCsv_governanceTeams {
  __typename: "SystemIntakeGovernanceTeam";
  isPresent: boolean | null;
  teams: SystemIntakeForCsv_governanceTeams_teams[] | null;
}

export interface SystemIntakeForCsv_fundingSources {
  __typename: "SystemIntakeFundingSource";
  source: string | null;
  fundingNumber: string | null;
}

export interface SystemIntakeForCsv_contract_startDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface SystemIntakeForCsv_contract_endDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface SystemIntakeForCsv_contract {
  __typename: "SystemIntakeContract";
  hasContract: string | null;
  contractor: string | null;
  number: string | null;
  startDate: SystemIntakeForCsv_contract_startDate;
  endDate: SystemIntakeForCsv_contract_endDate;
}

export interface SystemIntakeForCsv_notes {
  __typename: "SystemIntakeNote";
  id: UUID;
  createdAt: Time;
}

export interface SystemIntakeForCsv_actions {
  __typename: "SystemIntakeAction";
  id: UUID;
  createdAt: Time;
}

export interface SystemIntakeForCsv {
  __typename: "SystemIntake";
  id: UUID;
  euaUserId: string;
  requestName: string | null;
  requestType: SystemIntakeRequestType;
  status: SystemIntakeStatus;
  state: SystemIntakeState;
  requester: SystemIntakeForCsv_requester;
  businessOwner: SystemIntakeForCsv_businessOwner;
  productManager: SystemIntakeForCsv_productManager;
  isso: SystemIntakeForCsv_isso;
  governanceTeams: SystemIntakeForCsv_governanceTeams;
  existingFunding: boolean | null;
  fundingSources: SystemIntakeForCsv_fundingSources[];
  contract: SystemIntakeForCsv_contract;
  businessNeed: string | null;
  businessSolution: string | null;
  currentStage: string | null;
  needsEaSupport: boolean | null;
  lcid: string | null;
  lcidScope: HTML | null;
  adminLead: string | null;
  notes: SystemIntakeForCsv_notes[];
  actions: SystemIntakeForCsv_actions[];
  decidedAt: Time | null;
  submittedAt: Time | null;
  updatedAt: Time | null;
  createdAt: Time;
  archivedAt: Time | null;
}
