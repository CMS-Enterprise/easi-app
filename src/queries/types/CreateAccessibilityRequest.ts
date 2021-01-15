/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAccessibilityRequest
// ====================================================

export interface CreateAccessibilityRequest_createAccessibilityRequest_CreateAccessibilityRequestSuccess_accessibilityRequest {
  __typename: "AccessibilityRequest";
  id: string;
  name: string;
}

export interface CreateAccessibilityRequest_createAccessibilityRequest_CreateAccessibilityRequestSuccess {
  __typename: "CreateAccessibilityRequestSuccess";
  accessibilityRequest: CreateAccessibilityRequest_createAccessibilityRequest_CreateAccessibilityRequestSuccess_accessibilityRequest;
}

export interface CreateAccessibilityRequest_createAccessibilityRequest_CreateAccessibilityRequestFailure {
  __typename: "CreateAccessibilityRequestFailure";
  message: string;
}

export type CreateAccessibilityRequest_createAccessibilityRequest = CreateAccessibilityRequest_createAccessibilityRequest_CreateAccessibilityRequestSuccess | CreateAccessibilityRequest_createAccessibilityRequest_CreateAccessibilityRequestFailure;

export interface CreateAccessibilityRequest {
  createAccessibilityRequest: CreateAccessibilityRequest_createAccessibilityRequest | null;
}

export interface CreateAccessibilityRequestVariables {
  system: System;
  revision: string;
}
