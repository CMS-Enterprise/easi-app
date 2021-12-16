/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Denotes the reason a 508/accessibility request was deleted
 */
export enum AccessibilityRequestDeletionReason {
  INCORRECT_APPLICATION_AND_LIFECYCLE_ID = "INCORRECT_APPLICATION_AND_LIFECYCLE_ID",
  NO_TESTING_NEEDED = "NO_TESTING_NEEDED",
  OTHER = "OTHER",
}

/**
 * Represents the common options for document type that is attached to a
 * 508/accessibility request
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
 * Indicates the status of a document that has been attached to 508/accessibility
 * request, which will be scanned for viruses before it is made available
 */
export enum AccessibilityRequestDocumentStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

/**
 * Indicates the status of a 508/accessibility request
 */
export enum AccessibilityRequestStatus {
  CLOSED = "CLOSED",
  DELETED = "DELETED",
  IN_REMEDIATION = "IN_REMEDIATION",
  OPEN = "OPEN",
}

/**
 * TODO
 */
export enum GRTFeedbackType {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  GRB = "GRB",
}

/**
 * Indicates the type of a request being made with the EASi system
 */
export enum RequestType {
  ACCESSIBILITY_REQUEST = "ACCESSIBILITY_REQUEST",
  GOVERNANCE_REQUEST = "GOVERNANCE_REQUEST",
}

export enum SystemIntakeActionType {
  BIZ_CASE_NEEDS_CHANGES = "BIZ_CASE_NEEDS_CHANGES",
  CREATE_BIZ_CASE = "CREATE_BIZ_CASE",
  EXTEND_LCID = "EXTEND_LCID",
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
 * TODO
 */
export enum SystemIntakeRequestType {
  MAJOR_CHANGES = "MAJOR_CHANGES",
  NEW = "NEW",
  RECOMPETE = "RECOMPETE",
  SHUTDOWN = "SHUTDOWN",
}

/**
 * TODO
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
 * The type of test added to a 508/accessibility request
 */
export enum TestDateTestType {
  INITIAL = "INITIAL",
  REMEDIATION = "REMEDIATION",
}

/**
 * TODO
 */
export interface AddGRTFeedbackInput {
  emailBody: string;
  feedback: string;
  intakeID: UUID;
}

/**
 * TODO
 */
export interface BasicActionInput {
  feedback: string;
  intakeId: UUID;
}

/**
 * The input data used for adding a document to a 508/accessibility request
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
 * The data needed to initialize a 508/accessibility request
 */
export interface CreateAccessibilityRequestInput {
  intakeID: UUID;
  name: string;
}

/**
 * The data used when adding a note to a 508/accessibiiity request
 */
export interface CreateAccessibilityRequestNoteInput {
  requestID: UUID;
  note: string;
  shouldSendEmail: boolean;
}

/**
 * TODO
 */
export interface CreateSystemIntakeActionExtendLifecycleIdInput {
  id: UUID;
  expirationDate?: Time | null;
}

/**
 * TODO
 */
export interface CreateSystemIntakeInput {
  requestType: SystemIntakeRequestType;
  requester: SystemIntakeRequesterInput;
}

/**
 * TODO
 */
export interface CreateSystemIntakeNoteInput {
  content: string;
  authorName: string;
  intakeId: UUID;
}

/**
 * The input required to add a test date/score to a 508/accessibility request
 */
export interface CreateTestDateInput {
  date: Time;
  requestID: UUID;
  score?: number | null;
  testType: TestDateTestType;
}

/**
 * The input used to delete a document from a 508/accessibility request
 */
export interface DeleteAccessibilityRequestDocumentInput {
  id: UUID;
}

/**
 * The input data needed to delete a 508/accessibility request
 */
export interface DeleteAccessibilityRequestInput {
  id: UUID;
  reason: AccessibilityRequestDeletionReason;
}

/**
 * The input required to delete a test date/score
 */
export interface DeleteTestDateInput {
  id: UUID;
}

/**
 * TODO
 */
export interface GeneratePresignedUploadURLInput {
  fileName: string;
  mimeType: string;
  size: number;
}

/**
 * TODO
 */
export interface IssueLifecycleIdInput {
  expiresAt: Time;
  feedback: string;
  intakeId: UUID;
  lcid?: string | null;
  nextSteps?: string | null;
  scope: string;
  costBaseline?: string | null;
}

/**
 * TODO
 */
export interface RejectIntakeInput {
  feedback: string;
  intakeId: UUID;
  nextSteps?: string | null;
  reason: string;
}

/**
 * TODO
 */
export interface SubmitIntakeInput {
  id: UUID;
}

/**
 * TODO
 */
export interface SystemIntakeBusinessOwnerInput {
  name: string;
  component: string;
}

/**
 * TODO
 */
export interface SystemIntakeCollaboratorInput {
  collaborator: string;
  name: string;
  key: string;
}

/**
 * TODO
 */
export interface SystemIntakeContractInput {
  contractor?: string | null;
  endDate?: Time | null;
  hasContract?: string | null;
  startDate?: Time | null;
  vehicle?: string | null;
}

/**
 * TODO
 */
export interface SystemIntakeCostsInput {
  expectedIncreaseAmount?: string | null;
  isExpectingIncrease?: string | null;
}

/**
 * TODO
 */
export interface SystemIntakeFundingSourceInput {
  fundingNumber?: string | null;
  isFunded?: boolean | null;
  source?: string | null;
}

/**
 * TODO
 */
export interface SystemIntakeGovernanceTeamInput {
  isPresent?: boolean | null;
  teams?: (SystemIntakeCollaboratorInput | null)[] | null;
}

/**
 * TODO
 */
export interface SystemIntakeISSOInput {
  isPresent?: boolean | null;
  name?: string | null;
}

/**
 * TODO
 */
export interface SystemIntakeProductManagerInput {
  name: string;
  component: string;
}

/**
 * TODO
 */
export interface SystemIntakeRequesterInput {
  name: string;
}

/**
 * TODO
 */
export interface SystemIntakeRequesterWithComponentInput {
  name: string;
  component: string;
}

/**
 * Parameters for updating a 508/accessibility request's status
 */
export interface UpdateAccessibilityRequestStatus {
  requestID: UUID;
  status: AccessibilityRequestStatus;
}

/**
 * TODO
 */
export interface UpdateSystemIntakeAdminLeadInput {
  adminLead: string;
  id: UUID;
}

/**
 * TODO
 */
export interface UpdateSystemIntakeContactDetailsInput {
  id: UUID;
  requester: SystemIntakeRequesterWithComponentInput;
  businessOwner: SystemIntakeBusinessOwnerInput;
  productManager: SystemIntakeProductManagerInput;
  isso: SystemIntakeISSOInput;
  governanceTeams: SystemIntakeGovernanceTeamInput;
}

/**
 * TODO
 */
export interface UpdateSystemIntakeContractDetailsInput {
  id: UUID;
  currentStage?: string | null;
  fundingSource?: SystemIntakeFundingSourceInput | null;
  costs?: SystemIntakeCostsInput | null;
  contract?: SystemIntakeContractInput | null;
}

/**
 * TODO
 */
export interface UpdateSystemIntakeRequestDetailsInput {
  id: UUID;
  requestName?: string | null;
  businessNeed?: string | null;
  businessSolution?: string | null;
  needsEaSupport?: boolean | null;
}

/**
 * TODO
 */
export interface UpdateSystemIntakeReviewDatesInput {
  grbDate?: Time | null;
  grtDate?: Time | null;
  id: UUID;
}

/**
 * The input required to update a test date/score
 */
export interface UpdateTestDateInput {
  date: Time;
  id: UUID;
  score?: number | null;
  testType: TestDateTestType;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
