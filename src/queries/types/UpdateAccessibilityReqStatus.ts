/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateAccessibilityRequestStatus, AccessibilityRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateAccessibilityReqStatus
// ====================================================

export interface UpdateAccessibilityReqStatus_updateAccessibilityRequestStatus_userErrors {
  __typename: "UserError";
  message: string;
  path: string[];
}

export interface UpdateAccessibilityReqStatus_updateAccessibilityRequestStatus {
  __typename: "UpdateAccessibilityRequestStatusPayload";
  id: UUID;
  requestID: UUID;
  status: AccessibilityRequestStatus;
  euaUserId: string;
  userErrors: UpdateAccessibilityReqStatus_updateAccessibilityRequestStatus_userErrors[] | null;
}

export interface UpdateAccessibilityReqStatus {
  updateAccessibilityRequestStatus: UpdateAccessibilityReqStatus_updateAccessibilityRequestStatus | null;
}

export interface UpdateAccessibilityReqStatusVariables {
  input: UpdateAccessibilityRequestStatus;
}
