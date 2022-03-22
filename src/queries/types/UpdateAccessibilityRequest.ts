/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateAccessibilityRequestCedarSystemInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateAccessibilityRequest
// ====================================================

export interface UpdateAccessibilityRequest_updateAccessibilityRequestCedarSystem_accessibilityRequest {
  __typename: "AccessibilityRequest";
  id: UUID;
  name: string;
}

export interface UpdateAccessibilityRequest_updateAccessibilityRequestCedarSystem {
  __typename: "UpdateAccessibilityRequestCedarSystemPayload";
  id: UUID;
  accessibilityRequest: UpdateAccessibilityRequest_updateAccessibilityRequestCedarSystem_accessibilityRequest | null;
}

export interface UpdateAccessibilityRequest {
  updateAccessibilityRequestCedarSystem: UpdateAccessibilityRequest_updateAccessibilityRequestCedarSystem | null;
}

export interface UpdateAccessibilityRequestVariables {
  input: UpdateAccessibilityRequestCedarSystemInput;
}
