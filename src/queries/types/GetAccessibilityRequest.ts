/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccessibilityRequestDocumentStatus, AccessibilityRequestDocumentCommonType, TestDateTestType } from "./../../types/graphql-global-types";

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

export interface GetAccessibilityRequest_accessibilityRequest_documents_documentType {
  __typename: "AccessibilityRequestDocumentType";
  commonType: AccessibilityRequestDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface GetAccessibilityRequest_accessibilityRequest_documents {
  __typename: "AccessibilityRequestDocument";
  id: UUID;
  url: string;
  uploadedAt: Time;
  status: AccessibilityRequestDocumentStatus;
  documentType: GetAccessibilityRequest_accessibilityRequest_documents_documentType;
}

export interface GetAccessibilityRequest_accessibilityRequest_testDates {
  __typename: "TestDate";
  id: UUID;
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
