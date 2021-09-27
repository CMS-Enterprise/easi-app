/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeContractDetailsInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeContractDetails
// ====================================================

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_fundingSource {
  __typename: "SystemIntakeFundingSource";
  fundingNumber: string | null;
  isFunded: boolean | null;
  source: string | null;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_costs {
  __typename: "SystemIntakeCosts";
  expectedIncreaseAmount: string | null;
  isExpectingIncrease: string | null;
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
  vehicle: string | null;
}

export interface UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  currentStage: string | null;
  fundingSource: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_fundingSource;
  costs: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_costs;
  contract: UpdateSystemIntakeContractDetails_updateSystemIntakeContractDetails_systemIntake_contract;
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
