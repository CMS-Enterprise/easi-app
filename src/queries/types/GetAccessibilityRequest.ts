/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccessibilityRequest
// ====================================================

export interface GetAccessibilityRequest_accessibilityRequest_system {
  __typename: "System";
  lcid: string;
  name: string;
  businessOwnerName: string;
  businessOwnerComponent: string;
}

export interface GetAccessibilityRequest_accessibilityRequest {
  __typename: "AccessibilityRequest";
  id: UUID;
  submittedAt: Time;
  system: GetAccessibilityRequest_accessibilityRequest_system;
}

export interface GetAccessibilityRequest {
  accessibilityRequest: GetAccessibilityRequest_accessibilityRequest | null;
}

export interface GetAccessibilityRequestVariables {
  id: UUID;
}
