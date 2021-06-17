/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetRequests
// ====================================================

export interface GetRequests_requests_edges_node {
  __typename: "Request";
  id: UUID;
  name: string | null;
  submittedAt: Time | null;
  type: RequestType;
  status: string;
  lcid: string | null;
}

export interface GetRequests_requests_edges {
  __typename: "RequestEdge";
  node: GetRequests_requests_edges_node;
}

export interface GetRequests_requests {
  __typename: "RequestsConnection";
  edges: GetRequests_requests_edges[];
}

export interface GetRequests {
  requests: GetRequests_requests | null;
}

export interface GetRequestsVariables {
  first: number;
}
