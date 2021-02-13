/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccessibilityRequests
// ====================================================

export interface GetAccessibilityRequests_accessibilityRequests_edges_node_system_businessOwner {
  __typename: "BusinessOwner";
  name: string;
  component: string;
}

export interface GetAccessibilityRequests_accessibilityRequests_edges_node_system {
  __typename: "System";
  name: string;
  lcid: string;
  businessOwner: GetAccessibilityRequests_accessibilityRequests_edges_node_system_businessOwner;
}

export interface GetAccessibilityRequests_accessibilityRequests_edges_node {
  __typename: "AccessibilityRequest";
  id: UUID;
  submittedAt: Time;
  system: GetAccessibilityRequests_accessibilityRequests_edges_node_system;
}

export interface GetAccessibilityRequests_accessibilityRequests_edges {
  __typename: "AccessibilityRequestEdge";
  node: GetAccessibilityRequests_accessibilityRequests_edges_node;
}

export interface GetAccessibilityRequests_accessibilityRequests {
  __typename: "AccessibilityRequestsConnection";
  edges: GetAccessibilityRequests_accessibilityRequests_edges[];
}

export interface GetAccessibilityRequests {
  accessibilityRequests: GetAccessibilityRequests_accessibilityRequests | null;
}

export interface GetAccessibilityRequestsVariables {
  first: number;
}
