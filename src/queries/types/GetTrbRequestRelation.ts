/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestRelationType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequestRelation
// ====================================================

export interface GetTrbRequestRelation_trbRequest_contractNumbers {
  __typename: "TRBRequestContractNumber";
  contractNumber: string;
}

export interface GetTrbRequestRelation_trbRequest_systems {
  __typename: "CedarSystem";
  id: string;
  name: string;
  acronym: string | null;
}

export interface GetTrbRequestRelation_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  relationType: RequestRelationType | null;
  contractName: string | null;
  /**
   * Linked contract numbers
   */
  contractNumbers: GetTrbRequestRelation_trbRequest_contractNumbers[];
  /**
   * Linked systems
   */
  systems: GetTrbRequestRelation_trbRequest_systems[];
}

export interface GetTrbRequestRelation_cedarSystems {
  __typename: "CedarSystem";
  id: string;
  name: string;
}

export interface GetTrbRequestRelation {
  trbRequest: GetTrbRequestRelation_trbRequest;
  cedarSystems: GetTrbRequestRelation_cedarSystems[];
}

export interface GetTrbRequestRelationVariables {
  id: UUID;
}
