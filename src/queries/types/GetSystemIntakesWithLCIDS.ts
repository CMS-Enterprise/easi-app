/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemIntakesWithLCIDS
// ====================================================

export interface GetSystemIntakesWithLCIDS_systemIntakesWithLcids {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
  requestName: string | null;
}

export interface GetSystemIntakesWithLCIDS {
  systemIntakesWithLcids: GetSystemIntakesWithLCIDS_systemIntakesWithLcids[];
}
