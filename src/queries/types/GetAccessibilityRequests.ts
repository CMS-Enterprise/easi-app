/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccessibilityRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAccessibilityRequests
// ====================================================

export interface GetAccessibilityRequests_accessibilityRequests_edges_node_relevantTestDate {
  __typename: "TestDate";
  date: Time;
}

export interface GetAccessibilityRequests_accessibilityRequests_edges_node_system_businessOwner {
  __typename: "BusinessOwner";
  name: string;
  component: string;
}

export interface GetAccessibilityRequests_accessibilityRequests_edges_node_system {
  __typename: "System";
  lcid: string;
  businessOwner: GetAccessibilityRequests_accessibilityRequests_edges_node_system_businessOwner;
}

export interface GetAccessibilityRequests_accessibilityRequests_edges_node_statusRecord {
  __typename: "AccessibilityRequestStatusRecord";
  status: AccessibilityRequestStatus;
  createdAt: Time;
}

export interface GetAccessibilityRequests_accessibilityRequests_edges_node {
  __typename: "AccessibilityRequest";
  id: UUID;
  name: string;
  relevantTestDate: GetAccessibilityRequests_accessibilityRequests_edges_node_relevantTestDate | null;
  submittedAt: Time;
  system: GetAccessibilityRequests_accessibilityRequests_edges_node_system;
  statusRecord: GetAccessibilityRequests_accessibilityRequests_edges_node_statusRecord;
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
