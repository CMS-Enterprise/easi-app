/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeContractDetailsInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeContractDetails
// ====================================================

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_fundingSources {
  __typename: "SystemIntakeFundingSource";
  id: UUID;
  fundingNumber: string | null;
  source: string | null;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_costs {
  __typename: "SystemIntakeCosts";
  expectedIncreaseAmount: string | null;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_annualSpending {
  __typename: "SystemIntakeAnnualSpending";
  currentAnnualSpending: string | null;
  currentAnnualSpendingITPortion: string | null;
  plannedYearOneSpending: string | null;
  plannedYearOneSpendingITPortion: string | null;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contract_endDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contract_startDate {
  __typename: "ContractDate";
  day: string | null;
  month: string | null;
  year: string | null;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contract {
  __typename: "SystemIntakeContract";
  contractor: string | null;
  endDate: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contract_endDate;
  hasContract: string | null;
  startDate: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contract_startDate;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  id: UUID;
  systemIntakeID: UUID;
  contractNumber: string;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  currentStage: string | null;
  fundingSources: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_fundingSources[];
  costs: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_costs | null;
  annualSpending: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_annualSpending | null;
  contract: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contract;
  /**
   * Linked contract numbers
   */
  contractNumbers: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contractNumbers[];
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake | null;
}

export interface UpdateSystemIntakeContractDetails {
  updateSystemIntakeContractDetails: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails | null;
}

export interface UpdateSystemIntakeContractDetailsVariables {
  input: UpdateSystemIntakeContractDetailsInput;
}
