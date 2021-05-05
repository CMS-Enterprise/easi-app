/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteAccessibilityRequestInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteAccessibilityRequest
// ====================================================

export interface DeleteAccessibilityRequest_deleteAccessibilityRequest {
  __typename: "DeleteAccessibilityRequestPayload";
  id: UUID | null;
}

export interface DeleteAccessibilityRequest {
  deleteAccessibilityRequest: DeleteAccessibilityRequest_deleteAccessibilityRequest | null;
}

export interface DeleteAccessibilityRequestVariables {
  input: DeleteAccessibilityRequestInput;
}
