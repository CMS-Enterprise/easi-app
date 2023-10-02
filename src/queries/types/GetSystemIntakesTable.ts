/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeRequestType, SystemIntakeStatus, SystemIntakeState } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemIntakesTable
// ====================================================

export interface GetSystemIntakesTable_systemIntakes_requester {
  __typename: "SystemIntakeRequester";
  name: string;
  component: string | null;
}

export interface GetSystemIntakesTable_systemIntakes_businessOwner {
  __typename: "SystemIntakeBusinessOwner";
  name: string | null;
  component: string | null;
}

export interface GetSystemIntakesTable_systemIntakes_productManager {
  __typename: "SystemIntakeProductManager";
  name: string | null;
  component: string | null;
}

export interface GetSystemIntakesTable_systemIntakes_isso {
  __typename: "SystemIntakeISSO";
  name: string | null;
}

export interface GetSystemIntakesTable_systemIntakes_governanceTeams_teams {
  __typename: "SystemIntakeCollaborator";
  collaborator: string;
}

export interface GetSystemIntakesTable_systemIntakes_governanceTeams {
  __typename: "SystemIntakeGovernanceTeam";
  isPresent: boolean | null;
  teams: GetSystemIntakesTable_systemIntakes_governanceTeams_teams[] | null;
}

export interface GetSystemIntakesTable_systemIntakes_fundingSources {
  __typename: "SystemIntakeFundingSource";
  source: string | null;
  fundingNumber: string | null;
}

export interface GetSystemIntakesTable_systemIntakes_contract_startDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface GetSystemIntakesTable_systemIntakes_contract_endDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface GetSystemIntakesTable_systemIntakes_contract {
  __typename: "SystemIntakeContract";
  hasContract: string | null;
  contractor: string | null;
  number: string | null;
  startDate: GetSystemIntakesTable_systemIntakes_contract_startDate;
  endDate: GetSystemIntakesTable_systemIntakes_contract_endDate;
}

export interface GetSystemIntakesTable_systemIntakes_notes {
  __typename: "SystemIntakeNote";
  id: UUID;
  createdAt: Time;
}

export interface GetSystemIntakesTable_systemIntakes_actions {
  __typename: "SystemIntakeAction";
  id: UUID;
  createdAt: Time;
}

export interface GetSystemIntakesTable_systemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  euaUserId: string;
  requestName: string | null;
  requestType: SystemIntakeRequestType;
  status: SystemIntakeStatus;
  state: SystemIntakeState;
  requester: GetSystemIntakesTable_systemIntakes_requester;
  businessOwner: GetSystemIntakesTable_systemIntakes_businessOwner;
  productManager: GetSystemIntakesTable_systemIntakes_productManager;
  isso: GetSystemIntakesTable_systemIntakes_isso;
  governanceTeams: GetSystemIntakesTable_systemIntakes_governanceTeams;
  existingFunding: boolean | null;
  fundingSources: GetSystemIntakesTable_systemIntakes_fundingSources[];
  contract: GetSystemIntakesTable_systemIntakes_contract;
  businessNeed: string | null;
  businessSolution: string | null;
  currentStage: string | null;
  needsEaSupport: boolean | null;
  lcid: string | null;
  lcidScope: HTML | null;
  adminLead: string | null;
  notes: GetSystemIntakesTable_systemIntakes_notes[];
  actions: GetSystemIntakesTable_systemIntakes_actions[];
  decidedAt: Time | null;
  submittedAt: Time | null;
  updatedAt: Time | null;
  createdAt: Time;
  archivedAt: Time | null;
}

export interface GetSystemIntakesTable {
  systemIntakes: GetSystemIntakesTable_systemIntakes[];
}
