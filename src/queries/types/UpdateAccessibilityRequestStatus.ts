/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateAccessibilityRequestStatus, AccessibilityRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateAccessibilityRequestStatus
// ====================================================

export interface UpdateAccessibilityRequestStatus_updateAccessibilityRequestStatus_userErrors {
  __typename: "UserError";
  message: string;
  path: string[];
}

export interface UpdateAccessibilityRequestStatus_updateAccessibilityRequestStatus {
  __typename: "UpdateAccessibilityRequestStatusPayload";
  id: UUID;
  requestID: UUID;
  status: AccessibilityRequestStatus;
  euaUserId: string;
  userErrors: UpdateAccessibilityRequestStatus_updateAccessibilityRequestStatus_userErrors[] | null;
}

export interface UpdateAccessibilityRequestStatus {
  updateAccessibilityRequestStatus: UpdateAccessibilityRequestStatus_updateAccessibilityRequestStatus | null;
}

export interface UpdateAccessibilityRequestStatusVariables {
  input: UpdateAccessibilityRequestStatus;
}
