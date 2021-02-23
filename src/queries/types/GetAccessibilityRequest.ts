/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccessibilityRequestDocumentStatus, TestDateTestType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAccessibilityRequest
// ====================================================

export interface GetAccessibilityRequest_accessibilityRequest_system_businessOwner {
  __typename: "BusinessOwner";
  name: string;
  component: string;
}

export interface GetAccessibilityRequest_accessibilityRequest_system {
  __typename: "System";
  name: string;
  lcid: string;
  businessOwner: GetAccessibilityRequest_accessibilityRequest_system_businessOwner;
}

export interface GetAccessibilityRequest_accessibilityRequest_documents {
  __typename: "AccessibilityRequestDocument";
  name: string;
  url: string;
  uploadedAt: Time;
  status: AccessibilityRequestDocumentStatus;
}

export interface GetAccessibilityRequest_accessibilityRequest_testDates {
  __typename: "TestDate";
  testType: TestDateTestType;
  date: Time;
  score: number | null;
}

export interface GetAccessibilityRequest_accessibilityRequest {
  __typename: "AccessibilityRequest";
  id: UUID;
  submittedAt: Time;
  name: string;
  system: GetAccessibilityRequest_accessibilityRequest_system;
  documents: GetAccessibilityRequest_accessibilityRequest_documents[];
  testDates: GetAccessibilityRequest_accessibilityRequest_testDates[];
}

export interface GetAccessibilityRequest {
  accessibilityRequest: GetAccessibilityRequest_accessibilityRequest | null;
}

export interface GetAccessibilityRequestVariables {
  id: UUID;
}
