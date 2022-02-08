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
 * Indicates who the source is of feedback on a system request
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

/**
 * Represents the type of an action that is being done to a system request
 */
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
 * The type of an IT governance (system) request
 */
export enum SystemIntakeRequestType {
  MAJOR_CHANGES = "MAJOR_CHANGES",
  NEW = "NEW",
  RECOMPETE = "RECOMPETE",
  SHUTDOWN = "SHUTDOWN",
}

/**
 * The status of a system's IT governence request
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
 * Feedback intended for a business owner before they proceed to writing a
 * business case for a system request
 */
export interface AddGRTFeedbackInput {
  emailBody: string;
  feedback: string;
  intakeID: UUID;
}

/**
 * Input to add feedback to a system request
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
  cedarSystemId?: string | null;
}

/**
 * The data used when adding a note to a 508/accessibility request
 */
export interface CreateAccessibilityRequestNoteInput {
  requestID: UUID;
  note: string;
  shouldSendEmail: boolean;
}

/**
 * The data needed to bookmark a cedar system
 */
export interface CreateCedarSystemBookmarkInput {
  cedarSystemId: string;
}

/**
 * Input data for extending a system request's lifecycle ID
 */
export interface CreateSystemIntakeActionExtendLifecycleIdInput {
  id: UUID;
  expirationDate?: Time | null;
  nextSteps?: string | null;
  scope: string;
  costBaseline?: string | null;
}

/**
 * The input data used to initialize an IT governance request for a system
 */
export interface CreateSystemIntakeInput {
  requestType: SystemIntakeRequestType;
  requester: SystemIntakeRequesterInput;
}

/**
 * Input data for adding a note to a system request
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
 * Input associated with a document to be uploaded to a 508/accessibility request
 */
export interface GeneratePresignedUploadURLInput {
  fileName: string;
  mimeType: string;
  size: number;
}

/**
 * The input data required to issue a lifecycle ID for a system's IT governance
 * request
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
 * Input data for rejection of a system's IT governance request
 */
export interface RejectIntakeInput {
  feedback: string;
  intakeId: UUID;
  nextSteps?: string | null;
  reason: string;
}

/**
 * Input to submit an intake for review 
 */
export interface SubmitIntakeInput {
  id: UUID;
}

/**
 * The input data used to set the CMS business owner of a system
 */
export interface SystemIntakeBusinessOwnerInput {
  name: string;
  component: string;
}

/**
 * The input data used to add an OIT collaborator for a system request
 */
export interface SystemIntakeCollaboratorInput {
  collaborator: string;
  name: string;
  key: string;
}

/**
 * Input data containing information about a contract related to a system request
 */
export interface SystemIntakeContractInput {
  contractor?: string | null;
  endDate?: Time | null;
  hasContract?: string | null;
  startDate?: Time | null;
  vehicle?: string | null;
}

/**
 * Input data for estimated system cost increases associated with a system request
 */
export interface SystemIntakeCostsInput {
  expectedIncreaseAmount?: string | null;
  isExpectingIncrease?: string | null;
}

/**
 * Input data detailing how a system is funded
 */
export interface SystemIntakeFundingSourceInput {
  fundingNumber?: string | null;
  isFunded?: boolean | null;
  source?: string | null;
}

/**
 * The input data used to set the list of OIT collaborators for a system request
 */
export interface SystemIntakeGovernanceTeamInput {
  isPresent?: boolean | null;
  teams?: (SystemIntakeCollaboratorInput | null)[] | null;
}

/**
 * The input data used to set the ISSO associated with a system request, if any
 */
export interface SystemIntakeISSOInput {
  isPresent?: boolean | null;
  name?: string | null;
}

/**
 * The input data used to set the CMS product manager/lead of a system
 */
export interface SystemIntakeProductManagerInput {
  name: string;
  component: string;
}

/**
 * The input data used to set the requester of a system request
 */
export interface SystemIntakeRequesterInput {
  name: string;
}

/**
 * The input data used to set the requester for a system request along with the
 * requester's business component
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
 * Input data used to update the admin lead assigned to a system IT governance
 * request
 */
export interface UpdateSystemIntakeAdminLeadInput {
  adminLead: string;
  id: UUID;
}

/**
 * The input data used to update the contact details of the people associated with
 * a system request
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
 * Input data for updating contract details related to a system request
 */
export interface UpdateSystemIntakeContractDetailsInput {
  id: UUID;
  currentStage?: string | null;
  fundingSource?: SystemIntakeFundingSourceInput | null;
  costs?: SystemIntakeCostsInput | null;
  contract?: SystemIntakeContractInput | null;
}

/**
 * Input to update some fields on a system request
 */
export interface UpdateSystemIntakeRequestDetailsInput {
  id: UUID;
  requestName?: string | null;
  businessNeed?: string | null;
  businessSolution?: string | null;
  needsEaSupport?: boolean | null;
}

/**
 * Input data used to update GRT and GRB dates for a system request
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
