/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AccessibilityRequestDeletionReason {
  INCORRECT_APPLICATION_AND_LIFECYCLE_ID = "INCORRECT_APPLICATION_AND_LIFECYCLE_ID",
  NO_TESTING_NEEDED = "NO_TESTING_NEEDED",
  OTHER = "OTHER",
}

export enum AccessibilityRequestDocumentCommonType {
  AWARDED_VPAT = "AWARDED_VPAT",
  OTHER = "OTHER",
  REMEDIATION_PLAN = "REMEDIATION_PLAN",
  TESTING_VPAT = "TESTING_VPAT",
  TEST_PLAN = "TEST_PLAN",
  TEST_RESULTS = "TEST_RESULTS",
}

export enum AccessibilityRequestDocumentStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

export enum AccessibilityRequestStatus {
  CLOSED = "CLOSED",
  IN_REMEDIATION = "IN_REMEDIATION",
  OPEN = "OPEN",
}

export enum GRTFeedbackType {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  GRB = "GRB",
}

export enum RequestType {
  ACCESSIBILITY_REQUEST = "ACCESSIBILITY_REQUEST",
  GOVERNANCE_REQUEST = "GOVERNANCE_REQUEST",
}

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

export enum SystemIntakeRequestType {
  MAJOR_CHANGES = "MAJOR_CHANGES",
  NEW = "NEW",
  RECOMPETE = "RECOMPETE",
  SHUTDOWN = "SHUTDOWN",
}

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

export enum TestDateTestType {
  INITIAL = "INITIAL",
  REMEDIATION = "REMEDIATION",
}

export interface AddGRTFeedbackInput {
  emailBody: string;
  feedback: string;
  intakeID: UUID;
}

export interface BasicActionInput {
  feedback: string;
  intakeId: UUID;
}

export interface CreateAccessibilityRequestDocumentInput {
  commonDocumentType: AccessibilityRequestDocumentCommonType;
  mimeType: string;
  name: string;
  otherDocumentTypeDescription?: string | null;
  requestID: UUID;
  size: number;
  url: string;
}

export interface CreateAccessibilityRequestInput {
  intakeID: UUID;
  name: string;
}

export interface CreateAccessibilityRequestNoteInput {
  requestID: UUID;
  note: string;
  shouldSendEmail: boolean;
}

export interface CreateSystemIntakeInput {
  requestType: SystemIntakeRequestType;
  requester: SystemIntakeRequesterInput;
}

export interface CreateSystemIntakeNoteInput {
  content: string;
  authorName: string;
  intakeId: UUID;
}

export interface CreateTestDateInput {
  date: Time;
  requestID: UUID;
  score?: number | null;
  testType: TestDateTestType;
}

export interface DeleteAccessibilityRequestDocumentInput {
  id: UUID;
}

export interface DeleteAccessibilityRequestInput {
  id: UUID;
  reason: AccessibilityRequestDeletionReason;
}

export interface DeleteTestDateInput {
  id: UUID;
}

export interface GeneratePresignedUploadURLInput {
  fileName: string;
  mimeType: string;
  size: number;
}

export interface IssueLifecycleIdInput {
  expiresAt: Time;
  feedback: string;
  intakeId: UUID;
  lcid?: string | null;
  nextSteps?: string | null;
  scope: string;
}

export interface RejectIntakeInput {
  feedback: string;
  intakeId: UUID;
  nextSteps?: string | null;
  reason: string;
}

export interface SystemIntakeRequesterInput {
  name: string;
}

/**
 * Parameters for updating a 508/accessibility request's status
 */
export interface UpdateAccessibilityRequestStatus {
  requestID: UUID;
  status: AccessibilityRequestStatus;
}

export interface UpdateSystemIntakeAdminLeadInput {
  adminLead: string;
  id: UUID;
}

export interface UpdateSystemIntakeReviewDatesInput {
  grbDate?: Time | null;
  grtDate?: Time | null;
  id: UUID;
}

export interface UpdateTestDateInput {
  date: Time;
  id: UUID;
  score?: number | null;
  testType: TestDateTestType;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
