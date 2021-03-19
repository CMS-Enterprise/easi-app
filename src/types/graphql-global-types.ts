/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Common document type of an Accessibility Request document
 */
export enum AccessibilityRequestDocumentCommonType {
  AWARDED_VPAT = "AWARDED_VPAT",
  OTHER = "OTHER",
  REMEDIATION_PLAN = "REMEDIATION_PLAN",
  TESTING_VPAT = "TESTING_VPAT",
  TEST_PLAN = "TEST_PLAN",
  TEST_RESULTS = "TEST_RESULTS",
}

/**
 * Represents the availability of a document
 */
export enum AccessibilityRequestDocumentStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

/**
 * Type or recipient of GRT Feedback
 */
export enum GRTFeedbackType {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  GRB = "GRB",
}

/**
 * The variety of a 508 test
 */
export enum TestDateTestType {
  INITIAL = "INITIAL",
  REMEDIATION = "REMEDIATION",
}

/**
 * Input for adding GRT Feedback
 */
export interface AddGRTFeedbackInput {
  emailBody: string;
  feedback: string;
  intakeID: UUID;
}

/**
 * Parameters for createAccessibilityRequestDocument
 */
export interface CreateAccessibilityRequestDocumentInput {
  commonDocumentType: AccessibilityRequestDocumentCommonType;
  mimeType: string;
  name: string;
  otherDocumentTypeDescription?: string | null;
  requestID: UUID;
  size: number;
  url: string;
}

/**
 * Parameters required to create an AccessibilityRequest
 */
export interface CreateAccessibilityRequestInput {
  intakeID: UUID;
  name: string;
}

/**
 * Parameters for creating a test date
 */
export interface CreateTestDateInput {
  date: Time;
  requestID: UUID;
  score?: number | null;
  testType: TestDateTestType;
}

/**
 * Parameters required to generate a presigned upload URL
 */
export interface GeneratePresignedUploadURLInput {
  fileName: string;
  mimeType: string;
  size: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
