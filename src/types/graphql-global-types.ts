/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Represents the possible forms on a governance request that can receive feedback
 */
export enum GovernanceRequestFeedbackTargetForm {
  DRAFT_BUSINESS_CASE = "DRAFT_BUSINESS_CASE",
  FINAL_BUSINESS_CASE = "FINAL_BUSINESS_CASE",
  INTAKE_REQUEST = "INTAKE_REQUEST",
  NO_TARGET_PROVIDED = "NO_TARGET_PROVIDED",
}

/**
 * Represents the possible types of feedback on governance requests, based on who it's directed to
 */
export enum GovernanceRequestFeedbackType {
  GRB = "GRB",
  REQUESTER = "REQUESTER",
}

/**
 * The requester view of the IT gov Decision step status
 */
export enum ITGovDecisionStatus {
  CANT_START = "CANT_START",
  COMPLETED = "COMPLETED",
  IN_REVIEW = "IN_REVIEW",
}

/**
 * The requester view of the IT gov draft Business Case step status
 */
export enum ITGovDraftBusinessCaseStatus {
  CANT_START = "CANT_START",
  DONE = "DONE",
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_NEEDED = "NOT_NEEDED",
  READY = "READY",
  SUBMITTED = "SUBMITTED",
}

/**
 * The requester view of the IT gov feedback step status
 */
export enum ITGovFeedbackStatus {
  CANT_START = "CANT_START",
  COMPLETED = "COMPLETED",
  IN_REVIEW = "IN_REVIEW",
}

/**
 * The requester view of the IT Gov Final Business Case step status
 */
export enum ITGovFinalBusinessCaseStatus {
  CANT_START = "CANT_START",
  DONE = "DONE",
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_NEEDED = "NOT_NEEDED",
  READY = "READY",
  SUBMITTED = "SUBMITTED",
}

/**
 * The requester view of the IT Gov GRB step status
 */
export enum ITGovGRBStatus {
  AWAITING_DECISION = "AWAITING_DECISION",
  CANT_START = "CANT_START",
  COMPLETED = "COMPLETED",
  NOT_NEEDED = "NOT_NEEDED",
  READY_TO_SCHEDULE = "READY_TO_SCHEDULE",
  SCHEDULED = "SCHEDULED",
}

/**
 * The requester view of the IT Gov GRT step status
 */
export enum ITGovGRTStatus {
  AWAITING_DECISION = "AWAITING_DECISION",
  CANT_START = "CANT_START",
  COMPLETED = "COMPLETED",
  NOT_NEEDED = "NOT_NEEDED",
  READY_TO_SCHEDULE = "READY_TO_SCHEDULE",
  SCHEDULED = "SCHEDULED",
}

/**
 * The requester view of the IT gov intake step status
 */
export enum ITGovIntakeFormStatus {
  COMPLETED = "COMPLETED",
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
}

export enum RequestRelationType {
  EXISTING_SERVICE = "EXISTING_SERVICE",
  EXISTING_SYSTEM = "EXISTING_SYSTEM",
  NEW_SYSTEM = "NEW_SYSTEM",
}

/**
 * Represents the type of an action that is being done to a system request
 */
export enum SystemIntakeActionType {
  BIZ_CASE_NEEDS_CHANGES = "BIZ_CASE_NEEDS_CHANGES",
  CHANGE_LCID_RETIREMENT_DATE = "CHANGE_LCID_RETIREMENT_DATE",
  CLOSE_REQUEST = "CLOSE_REQUEST",
  CONFIRM_LCID = "CONFIRM_LCID",
  CREATE_BIZ_CASE = "CREATE_BIZ_CASE",
  EXPIRE_LCID = "EXPIRE_LCID",
  EXTEND_LCID = "EXTEND_LCID",
  GUIDE_RECEIVED_CLOSE = "GUIDE_RECEIVED_CLOSE",
  ISSUE_LCID = "ISSUE_LCID",
  NEED_BIZ_CASE = "NEED_BIZ_CASE",
  NOT_GOVERNANCE = "NOT_GOVERNANCE",
  NOT_IT_REQUEST = "NOT_IT_REQUEST",
  NOT_RESPONDING_CLOSE = "NOT_RESPONDING_CLOSE",
  NO_GOVERNANCE_NEEDED = "NO_GOVERNANCE_NEEDED",
  PROGRESS_TO_NEW_STEP = "PROGRESS_TO_NEW_STEP",
  PROVIDE_FEEDBACK_NEED_BIZ_CASE = "PROVIDE_FEEDBACK_NEED_BIZ_CASE",
  PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT = "PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT",
  PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL = "PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL",
  READY_FOR_GRB = "READY_FOR_GRB",
  READY_FOR_GRT = "READY_FOR_GRT",
  REJECT = "REJECT",
  REOPEN_REQUEST = "REOPEN_REQUEST",
  REQUEST_EDITS = "REQUEST_EDITS",
  RETIRE_LCID = "RETIRE_LCID",
  SEND_EMAIL = "SEND_EMAIL",
  SUBMIT_BIZ_CASE = "SUBMIT_BIZ_CASE",
  SUBMIT_FINAL_BIZ_CASE = "SUBMIT_FINAL_BIZ_CASE",
  SUBMIT_INTAKE = "SUBMIT_INTAKE",
  UNRETIRE_LCID = "UNRETIRE_LCID",
  UPDATE_LCID = "UPDATE_LCID",
}

/**
 * This represents the possible System Intake Decision States
 */
export enum SystemIntakeDecisionState {
  LCID_ISSUED = "LCID_ISSUED",
  NOT_APPROVED = "NOT_APPROVED",
  NOT_GOVERNANCE = "NOT_GOVERNANCE",
  NO_DECISION = "NO_DECISION",
}

/**
 * Represents the common options for document type that is attached to a
 * System Intake document
 */
export enum SystemIntakeDocumentCommonType {
  ACQUISITION_PLAN_OR_STRATEGY = "ACQUISITION_PLAN_OR_STRATEGY",
  DRAFT_IGCE = "DRAFT_IGCE",
  MEETING_MINUTES = "MEETING_MINUTES",
  OTHER = "OTHER",
  REQUEST_FOR_ADDITIONAL_FUNDING = "REQUEST_FOR_ADDITIONAL_FUNDING",
  SOFTWARE_BILL_OF_MATERIALS = "SOFTWARE_BILL_OF_MATERIALS",
  SOO_SOW = "SOO_SOW",
}

/**
 * Enumeration of the possible statuses of documents uploaded in the System Intake
 */
export enum SystemIntakeDocumentStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

/**
 * Represents the version options for a document that is attached to a
 * System Intake document
 */
export enum SystemIntakeDocumentVersion {
  CURRENT = "CURRENT",
  HISTORICAL = "HISTORICAL",
}

/**
 * This represents the possible state any system intake form can take
 */
export enum SystemIntakeFormState {
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_STARTED = "NOT_STARTED",
  SUBMITTED = "SUBMITTED",
}

/**
 * SystemIntakeRequestEditsOptions represents the current step in the intake process
 */
export enum SystemIntakeFormStep {
  DRAFT_BUSINESS_CASE = "DRAFT_BUSINESS_CASE",
  FINAL_BUSINESS_CASE = "FINAL_BUSINESS_CASE",
  INITIAL_REQUEST_FORM = "INITIAL_REQUEST_FORM",
}

/**
 * The possible statuses that an issued LCID can be in
 */
export enum SystemIntakeLCIDStatus {
  EXPIRED = "EXPIRED",
  ISSUED = "ISSUED",
  RETIRED = "RETIRED",
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
 * SystemIntakeSoftwareAcquisitionMethods represents the different methods requesters can select in a system intake
 */
export enum SystemIntakeSoftwareAcquisitionMethods {
  CONTRACTOR_FURNISHED = "CONTRACTOR_FURNISHED",
  ELA_OR_INTERNAL = "ELA_OR_INTERNAL",
  FED_FURNISHED = "FED_FURNISHED",
  NOT_YET_DETERMINED = "NOT_YET_DETERMINED",
  OTHER = "OTHER",
}

/**
 * SystemIntakeState represents whether the intake is open or closed
 */
export enum SystemIntakeState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

/**
 * This represents the statuses that an admin would see as a representation of a system intake. Note, there is no status for a brand new request, because an Admin doesn't see the request until it is in progress.
 */
export enum SystemIntakeStatusAdmin {
  CLOSED = "CLOSED",
  DRAFT_BUSINESS_CASE_IN_PROGRESS = "DRAFT_BUSINESS_CASE_IN_PROGRESS",
  DRAFT_BUSINESS_CASE_SUBMITTED = "DRAFT_BUSINESS_CASE_SUBMITTED",
  FINAL_BUSINESS_CASE_IN_PROGRESS = "FINAL_BUSINESS_CASE_IN_PROGRESS",
  FINAL_BUSINESS_CASE_SUBMITTED = "FINAL_BUSINESS_CASE_SUBMITTED",
  GRB_MEETING_COMPLETE = "GRB_MEETING_COMPLETE",
  GRB_MEETING_READY = "GRB_MEETING_READY",
  GRT_MEETING_COMPLETE = "GRT_MEETING_COMPLETE",
  GRT_MEETING_READY = "GRT_MEETING_READY",
  INITIAL_REQUEST_FORM_IN_PROGRESS = "INITIAL_REQUEST_FORM_IN_PROGRESS",
  INITIAL_REQUEST_FORM_SUBMITTED = "INITIAL_REQUEST_FORM_SUBMITTED",
  LCID_EXPIRED = "LCID_EXPIRED",
  LCID_ISSUED = "LCID_ISSUED",
  LCID_RETIRED = "LCID_RETIRED",
  NOT_APPROVED = "NOT_APPROVED",
  NOT_GOVERNANCE = "NOT_GOVERNANCE",
}

/**
 * This represents the (calculated) statuses that a requester view of a system Intake Request can show as part of the IT Gov v2 workflow
 */
export enum SystemIntakeStatusRequester {
  CLOSED = "CLOSED",
  DRAFT_BUSINESS_CASE_EDITS_REQUESTED = "DRAFT_BUSINESS_CASE_EDITS_REQUESTED",
  DRAFT_BUSINESS_CASE_IN_PROGRESS = "DRAFT_BUSINESS_CASE_IN_PROGRESS",
  DRAFT_BUSINESS_CASE_SUBMITTED = "DRAFT_BUSINESS_CASE_SUBMITTED",
  FINAL_BUSINESS_CASE_EDITS_REQUESTED = "FINAL_BUSINESS_CASE_EDITS_REQUESTED",
  FINAL_BUSINESS_CASE_IN_PROGRESS = "FINAL_BUSINESS_CASE_IN_PROGRESS",
  FINAL_BUSINESS_CASE_SUBMITTED = "FINAL_BUSINESS_CASE_SUBMITTED",
  GRB_MEETING_AWAITING_DECISION = "GRB_MEETING_AWAITING_DECISION",
  GRB_MEETING_READY = "GRB_MEETING_READY",
  GRT_MEETING_AWAITING_DECISION = "GRT_MEETING_AWAITING_DECISION",
  GRT_MEETING_READY = "GRT_MEETING_READY",
  INITIAL_REQUEST_FORM_EDITS_REQUESTED = "INITIAL_REQUEST_FORM_EDITS_REQUESTED",
  INITIAL_REQUEST_FORM_IN_PROGRESS = "INITIAL_REQUEST_FORM_IN_PROGRESS",
  INITIAL_REQUEST_FORM_NEW = "INITIAL_REQUEST_FORM_NEW",
  INITIAL_REQUEST_FORM_SUBMITTED = "INITIAL_REQUEST_FORM_SUBMITTED",
  LCID_EXPIRED = "LCID_EXPIRED",
  LCID_ISSUED = "LCID_ISSUED",
  LCID_RETIRED = "LCID_RETIRED",
  NOT_APPROVED = "NOT_APPROVED",
  NOT_GOVERNANCE = "NOT_GOVERNANCE",
}

/**
 * SystemIntakeStep represents the current step in the intake process
 */
export enum SystemIntakeStep {
  DECISION_AND_NEXT_STEPS = "DECISION_AND_NEXT_STEPS",
  DRAFT_BUSINESS_CASE = "DRAFT_BUSINESS_CASE",
  FINAL_BUSINESS_CASE = "FINAL_BUSINESS_CASE",
  GRB_MEETING = "GRB_MEETING",
  GRT_MEETING = "GRT_MEETING",
  INITIAL_REQUEST_FORM = "INITIAL_REQUEST_FORM",
}

/**
 * Steps in the system intake process that a Progress to New Step action can progress to
 */
export enum SystemIntakeStepToProgressTo {
  DRAFT_BUSINESS_CASE = "DRAFT_BUSINESS_CASE",
  FINAL_BUSINESS_CASE = "FINAL_BUSINESS_CASE",
  GRB_MEETING = "GRB_MEETING",
  GRT_MEETING = "GRT_MEETING",
}

/**
 * Different options for whether the Governance team believes a requester's team should consult with the TRB
 */
export enum SystemIntakeTRBFollowUp {
  NOT_RECOMMENDED = "NOT_RECOMMENDED",
  RECOMMENDED_BUT_NOT_CRITICAL = "RECOMMENDED_BUT_NOT_CRITICAL",
  STRONGLY_RECOMMENDED = "STRONGLY_RECOMMENDED",
}

/**
 * Represents the status of the TRB consult attendance step
 */
export enum TRBAttendConsultStatus {
  CANNOT_START_YET = "CANNOT_START_YET",
  COMPLETED = "COMPLETED",
  READY_TO_SCHEDULE = "READY_TO_SCHEDULE",
  SCHEDULED = "SCHEDULED",
}

/**
 * Represents an option selected for collaboration groups in the TRB request form
 */
export enum TRBCollabGroupOption {
  CLOUD = "CLOUD",
  ENTERPRISE_ARCHITECTURE = "ENTERPRISE_ARCHITECTURE",
  GOVERNANCE_REVIEW_BOARD = "GOVERNANCE_REVIEW_BOARD",
  OTHER = "OTHER",
  PRIVACY_ADVISOR = "PRIVACY_ADVISOR",
  SECURITY = "SECURITY",
}

/**
 * Represents the status of the TRB consult step
 */
export enum TRBConsultPrepStatus {
  CANNOT_START_YET = "CANNOT_START_YET",
  COMPLETED = "COMPLETED",
  READY_TO_START = "READY_TO_START",
}

/**
 * Represents the common options for document type that is attached to a
 * TRB Request
 */
export enum TRBDocumentCommonType {
  ARCHITECTURE_DIAGRAM = "ARCHITECTURE_DIAGRAM",
  BUSINESS_CASE = "BUSINESS_CASE",
  OTHER = "OTHER",
  PRESENTATION_SLIDE_DECK = "PRESENTATION_SLIDE_DECK",
}

/**
 * Represents the action an admin is taking on a TRB request when leaving feedback
 */
export enum TRBFeedbackAction {
  READY_FOR_CONSULT = "READY_FOR_CONSULT",
  REQUEST_EDITS = "REQUEST_EDITS",
}

/**
 * Represents the status of the TRB feedback step
 */
export enum TRBFeedbackStatus {
  CANNOT_START_YET = "CANNOT_START_YET",
  COMPLETED = "COMPLETED",
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_REVIEW = "IN_REVIEW",
  READY_TO_START = "READY_TO_START",
}

/**
 * Represents the status of a TRB request form
 */
export enum TRBFormStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  READY_TO_START = "READY_TO_START",
}

/**
 * Represents the status of the TRB guidance letter step
 */
export enum TRBGuidanceLetterStatus {
  CANNOT_START_YET = "CANNOT_START_YET",
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  READY_FOR_REVIEW = "READY_FOR_REVIEW",
  READY_TO_START = "READY_TO_START",
}

export enum TRBRequestState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export enum TRBRequestStatus {
  CONSULT_COMPLETE = "CONSULT_COMPLETE",
  CONSULT_SCHEDULED = "CONSULT_SCHEDULED",
  DRAFT_GUIDANCE_LETTER = "DRAFT_GUIDANCE_LETTER",
  DRAFT_REQUEST_FORM = "DRAFT_REQUEST_FORM",
  FOLLOW_UP_REQUESTED = "FOLLOW_UP_REQUESTED",
  GUIDANCE_LETTER_IN_REVIEW = "GUIDANCE_LETTER_IN_REVIEW",
  GUIDANCE_LETTER_SENT = "GUIDANCE_LETTER_SENT",
  NEW = "NEW",
  READY_FOR_CONSULT = "READY_FOR_CONSULT",
  REQUEST_FORM_COMPLETE = "REQUEST_FORM_COMPLETE",
}

export enum TRBRequestType {
  BRAINSTORM = "BRAINSTORM",
  FOLLOWUP = "FOLLOWUP",
  FORMAL_REVIEW = "FORMAL_REVIEW",
  NEED_HELP = "NEED_HELP",
  OTHER = "OTHER",
}

/**
 * The possible options on the TRB "Subject Areas" page
 */
export enum TRBSubjectAreaOption {
  ACCESSIBILITY_COMPLIANCE = "ACCESSIBILITY_COMPLIANCE",
  ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT = "ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT",
  ARTIFICIAL_INTELLIGENCE = "ARTIFICIAL_INTELLIGENCE",
  ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT = "ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT",
  BUSINESS_INTELLIGENCE = "BUSINESS_INTELLIGENCE",
  CLOUD_MIGRATION = "CLOUD_MIGRATION",
  CONTAINERS_AND_MICROSERVICES = "CONTAINERS_AND_MICROSERVICES",
  DISASTER_RECOVERY = "DISASTER_RECOVERY",
  EMAIL_INTEGRATION = "EMAIL_INTEGRATION",
  ENTERPRISE_DATA_LAKE_INTEGRATION = "ENTERPRISE_DATA_LAKE_INTEGRATION",
  FRAMEWORK_OR_TOOL_ALTERNATIVES = "FRAMEWORK_OR_TOOL_ALTERNATIVES",
  OPEN_SOURCE_SOFTWARE = "OPEN_SOURCE_SOFTWARE",
  PORTAL_INTEGRATION = "PORTAL_INTEGRATION",
  SYSTEM_ARCHITECTURE_REVIEW = "SYSTEM_ARCHITECTURE_REVIEW",
  SYSTEM_DISPOSITION_PLANNING = "SYSTEM_DISPOSITION_PLANNING",
  TECHNICAL_REFERENCE_ARCHITECTURE = "TECHNICAL_REFERENCE_ARCHITECTURE",
  WEB_BASED_UI_SERVICES = "WEB_BASED_UI_SERVICES",
  WEB_SERVICES_AND_APIS = "WEB_SERVICES_AND_APIS",
}

/**
 * Represents an option selected to the "where are you in the process?" TRB request form
 */
export enum TRBWhereInProcessOption {
  CONTRACTING_WORK_HAS_STARTED = "CONTRACTING_WORK_HAS_STARTED",
  DEVELOPMENT_HAS_RECENTLY_STARTED = "DEVELOPMENT_HAS_RECENTLY_STARTED",
  DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY = "DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY",
  I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM = "I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM",
  OTHER = "OTHER",
  THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE = "THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE",
}

/**
 * The data needed to bookmark a cedar system
 */
export interface CreateCedarSystemBookmarkInput {
  cedarSystemId: string;
}

/**
 * Input data for adding a note to a system request
 */
export interface CreateSystemIntakeNoteInput {
  content: HTML;
  authorName: string;
  intakeId: UUID;
}

/**
 * The data needed to upload a TRB document and attach it to a request with metadata
 */
export interface CreateTRBRequestDocumentInput {
  requestID: UUID;
  fileData: Upload;
  documentType: TRBDocumentCommonType;
  otherTypeDescription?: string | null;
}

/**
 * The data needed to add feedback to a TRB request
 */
export interface CreateTRBRequestFeedbackInput {
  trbRequestId: UUID;
  feedbackMessage: HTML;
  copyTrbMailbox: boolean;
  notifyEuaIds: string[];
  action: TRBFeedbackAction;
}

export interface DeleteTRBRequestFundingSourcesInput {
  trbRequestId: UUID;
  fundingNumber: string;
}

export interface EmailNotificationRecipients {
  regularRecipientEmails: EmailAddress[];
  shouldNotifyITGovernance: boolean;
  shouldNotifyITInvestment: boolean;
}

/**
 * Input for expiring an intake's LCID in IT Gov v2
 */
export interface SystemIntakeExpireLCIDInput {
  systemIntakeID: UUID;
  reason: HTML;
  nextSteps?: HTML | null;
  notificationRecipients?: EmailNotificationRecipients | null;
  additionalInfo?: HTML | null;
  adminNote?: HTML | null;
}

/**
 * Input for setting an intake's decision to issuing an LCID in IT Gov v2
 */
export interface SystemIntakeIssueLCIDInput {
  systemIntakeID: UUID;
  lcid?: string | null;
  expiresAt: Time;
  scope: HTML;
  nextSteps: HTML;
  trbFollowUp: SystemIntakeTRBFollowUp;
  costBaseline?: string | null;
  additionalInfo?: HTML | null;
  notificationRecipients?: EmailNotificationRecipients | null;
  adminNote?: HTML | null;
}

/**
 * Input for creating a Not an IT Governance Request Action in Admin Actions v2
 */
export interface SystemIntakeNotITGovReqInput {
  systemIntakeID: UUID;
  notificationRecipients?: EmailNotificationRecipients | null;
  reason?: HTML | null;
  additionalInfo?: HTML | null;
  adminNote?: HTML | null;
}

/**
 * Input for submitting a Progress to New Step action in IT Gov v2
 */
export interface SystemIntakeProgressToNewStepsInput {
  systemIntakeID: UUID;
  newStep: SystemIntakeStepToProgressTo;
  meetingDate?: Time | null;
  notificationRecipients?: EmailNotificationRecipients | null;
  feedback?: HTML | null;
  grbRecommendations?: HTML | null;
  additionalInfo?: HTML | null;
  adminNote?: HTML | null;
}

/**
 * Input for setting an intake's decision to Not Approved by GRB in IT Gov v2
 */
export interface SystemIntakeRejectIntakeInput {
  systemIntakeID: UUID;
  reason: HTML;
  nextSteps: HTML;
  trbFollowUp: SystemIntakeTRBFollowUp;
  additionalInfo?: HTML | null;
  notificationRecipients?: EmailNotificationRecipients | null;
  adminNote?: HTML | null;
}

/**
 * Input for creating a Reopen Request Action in Admin Actions v2
 */
export interface SystemIntakeReopenRequestInput {
  systemIntakeID: UUID;
  notificationRecipients?: EmailNotificationRecipients | null;
  reason?: HTML | null;
  additionalInfo?: HTML | null;
  adminNote?: HTML | null;
}

/**
 * Input for creating a Request Edits Action in Admin Actions v2
 */
export interface SystemIntakeRequestEditsInput {
  systemIntakeID: UUID;
  intakeFormStep: SystemIntakeFormStep;
  notificationRecipients?: EmailNotificationRecipients | null;
  emailFeedback: HTML;
  additionalInfo?: HTML | null;
  adminNote?: HTML | null;
}

/**
 * Input for retiring an intake's LCID in IT Gov v2
 */
export interface SystemIntakeRetireLCIDInput {
  systemIntakeID: UUID;
  retiresAt: Time;
  reason?: HTML | null;
  additionalInfo?: HTML | null;
  notificationRecipients?: EmailNotificationRecipients | null;
  adminNote?: HTML | null;
}

/**
 * Input for "unretiring" (i.e. removing retirement date) an LCID in IT Gov v2
 */
export interface SystemIntakeUnretireLCIDInput {
  systemIntakeID: UUID;
  additionalInfo?: HTML | null;
  notificationRecipients?: EmailNotificationRecipients | null;
  adminNote?: HTML | null;
}

/**
 * Input for updating an intake's LCID in IT Gov v2
 */
export interface SystemIntakeUpdateLCIDInput {
  systemIntakeID: UUID;
  expiresAt?: Time | null;
  scope?: HTML | null;
  nextSteps?: HTML | null;
  costBaseline?: string | null;
  reason?: HTML | null;
  additionalInfo?: HTML | null;
  notificationRecipients?: EmailNotificationRecipients | null;
  adminNote?: HTML | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
