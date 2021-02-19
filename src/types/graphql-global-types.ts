/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Represents the availability of a document
 */
export enum AccessibilityRequestDocumentStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

/**
 * The variety of a 508 test
 */
export enum TestDateTestType {
  INITIAL = "INITIAL",
  REMEDIATION = "REMEDIATION",
}

/**
 * Parameters for createAccessibilityRequestDocument
 */
export interface CreateAccessibilityRequestDocumentInput {
  key: string;
  mimeType: string;
  name: string;
  requestID: UUID;
  size: number;
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
