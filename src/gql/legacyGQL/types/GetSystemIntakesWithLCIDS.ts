/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemIntakeTRBFollowUp } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemIntakesWithLCIDS
// ====================================================

export interface GetSystemIntakesWithLCIDS_systemIntakesWithLcids {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
  requestName: string | null;
  lcidExpiresAt: Time | null;
  lcidScope: HTML | null;
  decisionNextSteps: HTML | null;
  trbFollowUpRecommendation: SystemIntakeTRBFollowUp | null;
  lcidCostBaseline: string | null;
}

export interface GetSystemIntakesWithLCIDS {
  systemIntakesWithLcids: GetSystemIntakesWithLCIDS_systemIntakesWithLcids[];
}
