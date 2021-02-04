/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateAccessibilityRequestInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateAccessibilityRequest
// ====================================================

export interface CreateAccessibilityRequest_createAccessibilityRequest_accessibilityRequest_system {
  __typename: "System";
  name: string;
}

export interface CreateAccessibilityRequest_createAccessibilityRequest_accessibilityRequest {
  __typename: "AccessibilityRequest";
  id: UUID;
  system: CreateAccessibilityRequest_createAccessibilityRequest_accessibilityRequest_system;
}

export interface CreateAccessibilityRequest_createAccessibilityRequest_userErrors {
  __typename: "UserError";
  message: string;
  path: string[];
}

export interface CreateAccessibilityRequest_createAccessibilityRequest {
  __typename: "CreateAccessibilityRequestPayload";
  accessibilityRequest: CreateAccessibilityRequest_createAccessibilityRequest_accessibilityRequest | null;
  userErrors: CreateAccessibilityRequest_createAccessibilityRequest_userErrors[] | null;
}

export interface CreateAccessibilityRequest {
  createAccessibilityRequest: CreateAccessibilityRequest_createAccessibilityRequest | null;
}

export interface CreateAccessibilityRequestVariables {
  input: CreateAccessibilityRequestInput;
}
