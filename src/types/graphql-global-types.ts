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
 * Indicates which action should be taken
 */
export enum SystemIntakeActionType {
  BIZ_CASE_NEEDS_CHANGES = "BIZ_CASE_NEEDS_CHANGES",
  CREATE_BIZ_CASE = "CREATE_BIZ_CASE",
  GUIDE_RECEIVED_CLOSE = "GUIDE_RECEIVED_CLOSE",
  ISSUE_LCID = "ISSUE_LCID",
  NEED_BIZ_CASE = "NEED_BIZ_CASE",
  NOT_IT_REQUEST = "NOT_IT_REQUEST",
  NOT_RESPONDING_CLOSE = "NOT_RESPONDING_CLOSE",
  NO_GOVERNANCE_NEEDED = "NO_GOVERNANCE_NEEDED",
  PROVIDE_FEEDBACK_NEED_BIZ_CASE = "PROVIDE_FEEDBACK_NEED_BIZ_CASE",
  PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT = "PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT",
  PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL = "PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL",
  READY_FOR_GRB = "READY_FOR_GRB",
  READY_FOR_GRT = "READY_FOR_GRT",
  REJECT = "REJECT",
  SEND_EMAIL = "SEND_EMAIL",
  SUBMIT_BIZ_CASE = "SUBMIT_BIZ_CASE",
  SUBMIT_FINAL_BIZ_CASE = "SUBMIT_FINAL_BIZ_CASE",
  SUBMIT_INTAKE = "SUBMIT_INTAKE",
}

/**
 * The request types for a system intake
 */
export enum SystemIntakeRequestType {
  MAJOR_CHANGES = "MAJOR_CHANGES",
  NEW = "NEW",
  RECOMPETE = "RECOMPETE",
  SHUTDOWN = "SHUTDOWN",
}

/**
 * The statuses for a system intake
 */
export enum SystemIntakeStatus {
  BIZ_CASE_CHANGES_NEEDED = "BIZ_CASE_CHANGES_NEEDED",
  BIZ_CASE_DRAFT = "BIZ_CASE_DRAFT",
  BIZ_CASE_DRAFT_SUBMITTED = "BIZ_CASE_DRAFT_SUBMITTED",
  BIZ_CASE_FINAL_NEEDED = "BIZ_CASE_FINAL_NEEDED",
  BIZ_CASE_FINAL_SUBMITTED = "BIZ_CASE_FINAL_SUBMITTED",
  INTAKE_DRAFT = "INTAKE_DRAFT",
  INTAKE_SUBMITTED = "INTAKE_SUBMITTED",
  LCID_ISSUED = "LCID_ISSUED",
  NEED_BIZ_CASE = "NEED_BIZ_CASE",
  NOT_APPROVED = "NOT_APPROVED",
  NOT_IT_REQUEST = "NOT_IT_REQUEST",
  NO_GOVERNANCE = "NO_GOVERNANCE",
  READY_FOR_GRB = "READY_FOR_GRB",
  READY_FOR_GRT = "READY_FOR_GRT",
  SHUTDOWN_COMPLETE = "SHUTDOWN_COMPLETE",
  SHUTDOWN_IN_PROGRESS = "SHUTDOWN_IN_PROGRESS",
  WITHDRAWN = "WITHDRAWN",
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
 * Parameters for actions without additional fields
 */
export interface BasicActionInput {
  feedback: string;
  intakeId: UUID;
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
 * Parameters required to create a note for an intake
 */
export interface CreateSystemIntakeNoteInput {
  content: string;
  authorName: string;
  intakeId: UUID;
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

/**
 * Input for issuing a lifecycle id
 */
export interface IssueLifecycleIdInput {
  expiresAt: Time;
  feedback: string;
  intakeId: UUID;
  lcid?: string | null;
  nextSteps?: string | null;
  scope: string;
}

/**
 * Input for rejecting an intake
 */
export interface RejectIntakeInput {
  feedback: string;
  intakeId: UUID;
  nextSteps?: string | null;
  reason: string;
}

/**
 * Parameters required to update the admin lead for an intake
 */
export interface UpdateSystemIntakeAdminLeadInput {
  adminLead: string;
  id: UUID;
}

/**
 * Parameters required to update the grt and grb dates for an intake
 */
export interface UpdateSystemIntakeReviewDatesInput {
  grbDate?: Time | null;
  grtDate?: Time | null;
  id: UUID;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
