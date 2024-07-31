/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystems
// ====================================================

export interface GetSystems_systemIntakes_businessOwner {
  __typename: "SystemIntakeBusinessOwner";
  name: string | null;
  component: string | null;
}

export interface GetSystems_systemIntakes {
  __typename: "SystemIntake";
  id: UUID;
  lcid: string | null;
  businessOwner: GetSystems_systemIntakes_businessOwner;
}

export interface GetSystems {
  systemIntakes: GetSystems_systemIntakes[];
}

export interface GetSystemsVariables {
  openRequests: boolean;
}
