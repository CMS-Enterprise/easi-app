/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccessibilityRequestDocumentStatus, AccessibilityRequestDocumentCommonType, TestDateTestType, AccessibilityRequestStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAccessibilityRequestAccessibilityTeamOnly
// ====================================================

export interface GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_system_businessOwner {
  __typename: "BusinessOwner";
  name: string;
  component: string;
}

export interface GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_system {
  __typename: "System";
  name: string;
  lcid: string;
  businessOwner: GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_system_businessOwner;
}

export interface GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_documents_documentType {
  __typename: "AccessibilityRequestDocumentType";
  commonType: AccessibilityRequestDocumentCommonType;
  otherTypeDescription: string | null;
}

export interface GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_documents {
  __typename: "AccessibilityRequestDocument";
  id: UUID;
  url: string;
  uploadedAt: Time;
  status: AccessibilityRequestDocumentStatus;
  documentType: GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_documents_documentType;
}

export interface GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_testDates {
  __typename: "TestDate";
  id: UUID;
  testType: TestDateTestType;
  date: Time;
  score: number | null;
}

export interface GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_statusRecord {
  __typename: "AccessibilityRequestStatusRecord";
  status: AccessibilityRequestStatus;
}

export interface GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_notes {
  __typename: "AccessibilityRequestNote";
  id: UUID;
  createdAt: Time;
  authorName: string;
  note: string;
}

export interface GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest {
  __typename: "AccessibilityRequest";
  id: UUID;
  euaUserId: string;
  submittedAt: Time;
  name: string;
  system: GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_system;
  documents: GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_documents[];
  testDates: GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_testDates[];
  statusRecord: GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_statusRecord;
  notes: GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest_notes[];
}

export interface GetAccessibilityRequestAccessibilityTeamOnly {
  accessibilityRequest: GetAccessibilityRequestAccessibilityTeamOnly_accessibilityRequest | null;
}

export interface GetAccessibilityRequestAccessibilityTeamOnlyVariables {
  id: UUID;
}
