/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystems
// ====================================================

export interface GetSystems_systems_edges_node_businessOwner {
  __typename: "BusinessOwner";
  name: string;
  component: string;
}

export interface GetSystems_systems_edges_node {
  __typename: "System";
  id: UUID;
  lcid: string;
  name: string;
  businessOwner: GetSystems_systems_edges_node_businessOwner;
}

export interface GetSystems_systems_edges {
  __typename: "SystemEdge";
  node: GetSystems_systems_edges_node;
}

export interface GetSystems_systems {
  __typename: "SystemConnection";
  edges: GetSystems_systems_edges[];
}

export interface GetSystems {
  systems: GetSystems_systems | null;
}

export interface GetSystemsVariables {
  first: number;
}
