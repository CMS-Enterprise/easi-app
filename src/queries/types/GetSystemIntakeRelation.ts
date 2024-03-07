/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestRelationType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemIntakeRelation
// ====================================================

export interface GetSystemIntakeRelation_systemIntake_contractNumbers {
  __typename: "SystemIntakeContractNumber";
  contractNumber: string;
}

export interface GetSystemIntakeRelation_systemIntake_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
  acronym: string | null;
}

export interface GetSystemIntakeRelation_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  relationType: RequestRelationType | null;
  contractName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetSystemIntakeRelation_systemIntake_contractNumbers[];
  /**
   * Linked systems
   */
  systems: GetSystemIntakeRelation_systemIntake_systems[];
}

export interface GetSystemIntakeRelation_cedarSystems {
  __typename: "CedarSystem";
  id: string;
  name: string;
}

export interface GetSystemIntakeRelation {
  systemIntake: GetSystemIntakeRelation_systemIntake | null;
  cedarSystems: GetSystemIntakeRelation_cedarSystems[];
}

export interface GetSystemIntakeRelationVariables {
  id: UUID;
}
