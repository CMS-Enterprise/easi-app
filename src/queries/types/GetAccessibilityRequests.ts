/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccessibilityRequests
// ====================================================

export interface GetAccessibilityRequests_accessibilityRequests_edges_node {
  __typename: "AccessibilityRequest";
  id: UUID;
  name: string;
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
