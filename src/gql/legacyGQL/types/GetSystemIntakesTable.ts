/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeStatusAdmin, SystemIntakeState, SystemIntakeSoftwareAcquisitionMethods } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemIntakesTable
// ====================================================

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

export interface GetSystemIntakesTable_systemIntakes_fundingSources {
  __typename: "SystemIntakeFundingSource";
  id: UUID;
  fundingNumber: string | null;
  source: string | null;
}

export interface GetSystemIntakesTable_systemIntakes_annualSpending {
  __typename: "SystemIntakeAnnualSpending";
  currentAnnualSpending: string | null;
  currentAnnualSpendingITPortion: string | null;
  plannedYearOneSpending: string | null;
  plannedYearOneSpendingITPortion: string | null;
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
  vehicle: string | null;
  startDate: GetSystemIntakesTable_systemIntakes_contract_startDate;
  endDate: GetSystemIntakesTable_systemIntakes_contract_endDate;
}

export interface GetSystemIntakesTable_systemIntakes_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  contractNumber: string;
}

export interface GetSystemIntakesTable_systemIntakes_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
}

export interface GetSystemIntakesTable_systemIntakes_notes {
  __typename: "SystemIntakeNote";
  id: UUID;
  createdAt: Time;
  content: HTML;
}

export interface GetSystemIntakesTable_systemIntakes_actions {
  __typename: "SystemIntakeAction";
  id: UUID;
  createdAt: Time;
}

export interface GetSystemIntakesTable_systemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  euaUserId: string | null;
  requestName: string | null;
  statusAdmin: SystemIntakeStatusAdmin;
  state: SystemIntakeState;
  requesterName: string | null;
  requesterComponent: string | null;
  businessOwner: GetSystemIntakesTable_systemIntakes_businessOwner;
  productManager: GetSystemIntakesTable_systemIntakes_productManager;
  isso: GetSystemIntakesTable_systemIntakes_isso;
  trbCollaboratorName: string | null;
  oitSecurityCollaboratorName: string | null;
  eaCollaboratorName: string | null;
  existingFunding: boolean | null;
  fundingSources: GetSystemIntakesTable_systemIntakes_fundingSources[];
  annualSpending: GetSystemIntakesTable_systemIntakes_annualSpending | null;
  contract: GetSystemIntakesTable_systemIntakes_contract;
  contractName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetSystemIntakesTable_systemIntakes_contractNumbers[];
  /**
   * Linked systems
   */
  systems: GetSystemIntakesTable_systemIntakes_systems[];
  businessNeed: string | null;
  businessSolution: string | null;
  currentStage: string | null;
  needsEaSupport: boolean | null;
  grtDate: Time | null;
  grbDate: Time | null;
  lcid: string | null;
  lcidScope: HTML | null;
  lcidExpiresAt: Time | null;
  adminLead: string | null;
  notes: GetSystemIntakesTable_systemIntakes_notes[];
  actions: GetSystemIntakesTable_systemIntakes_actions[];
  hasUiChanges: boolean | null;
  usesAiTech: boolean | null;
  usingSoftware: string | null;
  acquisitionMethods: SystemIntakeSoftwareAcquisitionMethods[];
  decidedAt: Time | null;
  submittedAt: Time | null;
  updatedAt: Time | null;
  createdAt: Time | null;
  archivedAt: Time | null;
}

export interface GetSystemIntakesTable {
  systemIntakes: GetSystemIntakesTable_systemIntakes[];
}

export interface GetSystemIntakesTableVariables {
  openRequests: boolean;
}
