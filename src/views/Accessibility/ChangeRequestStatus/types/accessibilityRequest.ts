/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccessibilityRequestStatus } from "./../../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: accessibilityRequest
// ====================================================

export interface accessibilityRequest_accessibilityRequest_statusRecord {
  __typename: "AccessibilityRequestStatusRecord";
  status: AccessibilityRequestStatus;
}

export interface accessibilityRequest_accessibilityRequest {
  __typename: "AccessibilityRequest";
  id: UUID;
  name: string;
  statusRecord: accessibilityRequest_accessibilityRequest_statusRecord;
}

export interface accessibilityRequest {
  accessibilityRequest: accessibilityRequest_accessibilityRequest | null;
}

export interface accessibilityRequestVariables {
  id: UUID;
}
