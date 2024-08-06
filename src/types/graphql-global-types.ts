/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * The possible types of assignees for CedarRoles
 */
export enum CedarAssigneeType {
  ORGANIZATION = "ORGANIZATION",
  PERSON = "PERSON",
}

export enum ExchangeDirection {
  RECEIVER = "RECEIVER",
  SENDER = "SENDER",
}

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
 * The requester view of the IT gov draft business case step status
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

/**
 * PersonRole is an enumeration of values for a person's role
 */
export enum PersonRole {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  CLOUD_NAVIGATOR = "CLOUD_NAVIGATOR",
  CONTRACT_OFFICE_RSREPRESENTATIVE = "CONTRACT_OFFICE_RSREPRESENTATIVE",
  CRA = "CRA",
  INFORMATION_SYSTEM_SECURITY_ADVISOR = "INFORMATION_SYSTEM_SECURITY_ADVISOR",
  OTHER = "OTHER",
  PRIVACY_ADVISOR = "PRIVACY_ADVISOR",
  PRODUCT_OWNER = "PRODUCT_OWNER",
  SYSTEM_MAINTAINER = "SYSTEM_MAINTAINER",
  SYSTEM_OWNER = "SYSTEM_OWNER",
}

export enum RequestRelationType {
  EXISTING_SERVICE = "EXISTING_SERVICE",
  EXISTING_SYSTEM = "EXISTING_SYSTEM",
  NEW_SYSTEM = "NEW_SYSTEM",
}

/**
 * Indicates the type of a request being made with the EASi system
 */
export enum RequestType {
  GOVERNANCE_REQUEST = "GOVERNANCE_REQUEST",
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

export enum SystemIntakeGRBReviewerRole {
  ACA_3021_REP = "ACA_3021_REP",
  CCIIO_REP = "CCIIO_REP",
  CMCS_REP = "CMCS_REP",
  CO_CHAIR_CFO = "CO_CHAIR_CFO",
  CO_CHAIR_CIO = "CO_CHAIR_CIO",
  CO_CHAIR_HCA = "CO_CHAIR_HCA",
  FED_ADMIN_BDG_CHAIR = "FED_ADMIN_BDG_CHAIR",
  OTHER = "OTHER",
  PROGRAM_INTEGRITY_BDG_CHAIR = "PROGRAM_INTEGRITY_BDG_CHAIR",
  PROGRAM_OPERATIONS_BDG_CHAIR = "PROGRAM_OPERATIONS_BDG_CHAIR",
  QIO_REP = "QIO_REP",
  SUBJECT_MATTER_EXPERT = "SUBJECT_MATTER_EXPERT",
}

export enum SystemIntakeGRBReviewerVotingRole {
  ALTERNATE = "ALTERNATE",
  NON_VOTING = "NON_VOTING",
  VOTING = "VOTING",
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
 * SystemIntakeState represents whether the intake is open or closed
 */
export enum SystemIntakeState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

/**
 * This represents the statuses that and admin would see as a representation of a system intake. Note, there is no status for a brand new request, because and Admin doesn't see the request until it is in progress.
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
 * This represents the (calculated) statuses that a requester view of a system intake request can show as part of the IT Gov v2 workflow
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
 * Represents the category of a single TRB admin note
 */
export enum TRBAdminNoteCategory {
  ADVICE_LETTER = "ADVICE_LETTER",
  CONSULT_SESSION = "CONSULT_SESSION",
  GENERAL_REQUEST = "GENERAL_REQUEST",
  INITIAL_REQUEST_FORM = "INITIAL_REQUEST_FORM",
  SUPPORTING_DOCUMENTS = "SUPPORTING_DOCUMENTS",
}

/**
 * Represents the status of the TRB advice letter step
 */
export enum TRBAdviceLetterStatus {
  CANNOT_START_YET = "CANNOT_START_YET",
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  READY_FOR_REVIEW = "READY_FOR_REVIEW",
  READY_TO_START = "READY_TO_START",
}

/**
 * Represents the status of the TRB advice letter step
 */
export enum TRBAdviceLetterStatusTaskList {
  CANNOT_START_YET = "CANNOT_START_YET",
  COMPLETED = "COMPLETED",
  IN_REVIEW = "IN_REVIEW",
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
 * Enumeration of the possible statuses of documents uploaded in the TRB workflow
 */
export enum TRBRequestDocumentStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  UNAVAILABLE = "UNAVAILABLE",
}

export enum TRBRequestState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export enum TRBRequestStatus {
  ADVICE_LETTER_IN_REVIEW = "ADVICE_LETTER_IN_REVIEW",
  ADVICE_LETTER_SENT = "ADVICE_LETTER_SENT",
  CONSULT_COMPLETE = "CONSULT_COMPLETE",
  CONSULT_SCHEDULED = "CONSULT_SCHEDULED",
  DRAFT_ADVICE_LETTER = "DRAFT_ADVICE_LETTER",
  DRAFT_REQUEST_FORM = "DRAFT_REQUEST_FORM",
  FOLLOW_UP_REQUESTED = "FOLLOW_UP_REQUESTED",
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
 * The input needed to close a TRB request
 */
export interface CloseTRBRequestInput {
  id: UUID;
  reasonClosed: HTML;
  copyTrbMailbox: boolean;
  notifyEuaIds: string[];
}

/**
 * The data needed to bookmark a cedar system
 */
export interface CreateCedarSystemBookmarkInput {
  cedarSystemId: string;
}

/**
 * The data needed to associate a contact with a system intake
 */
export interface CreateSystemIntakeContactInput {
  euaUserId: string;
  systemIntakeId: UUID;
  component: string;
  role: string;
}

/**
 * The data needed to upload a System Intake document and attach it to a request with metadata
 */
export interface CreateSystemIntakeDocumentInput {
  requestID: UUID;
  fileData: Upload;
  documentType: SystemIntakeDocumentCommonType;
  version: SystemIntakeDocumentVersion;
  otherTypeDescription?: string | null;
}

export interface CreateSystemIntakeGRBReviewerInput {
  systemIntakeID: UUID;
  euaUserId: string;
  votingRole: SystemIntakeGRBReviewerVotingRole;
  grbRole: SystemIntakeGRBReviewerRole;
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
  content: HTML;
  authorName: string;
  intakeId: UUID;
}

/**
 * The data needed to create a TRB admin note with the Advice Letter category
 */
export interface CreateTRBAdminNoteAdviceLetterInput {
  trbRequestId: UUID;
  noteText: HTML;
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  recommendationIDs: UUID[];
}

/**
 * The data needed to create a TRB admin note with the Consult Session category
 */
export interface CreateTRBAdminNoteConsultSessionInput {
  trbRequestId: UUID;
  noteText: HTML;
}

/**
 * The data needed to create a TRB admin note with the General Request category
 */
export interface CreateTRBAdminNoteGeneralRequestInput {
  trbRequestId: UUID;
  noteText: HTML;
}

/**
 * The data needed to create a TRB admin note with the Initial Request Form category
 */
export interface CreateTRBAdminNoteInitialRequestFormInput {
  trbRequestId: UUID;
  noteText: HTML;
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

/**
 * The data needed to create a TRB admin note with the Supporting Documents category
 */
export interface CreateTRBAdminNoteSupportingDocumentsInput {
  trbRequestId: UUID;
  noteText: HTML;
  documentIDs: UUID[];
}

/**
 * The input required to add a recommendation & links to a TRB advice letter
 */
export interface CreateTRBAdviceLetterRecommendationInput {
  trbRequestId: UUID;
  title: string;
  recommendation: HTML;
  links: string[];
}

/**
 * The data needed add a TRB request attendee to a TRB request
 */
export interface CreateTRBRequestAttendeeInput {
  euaUserId: string;
  trbRequestId: UUID;
  component: string;
  role: PersonRole;
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

/**
 * The data needed to delete a system intake contact
 */
export interface DeleteSystemIntakeContactInput {
  id: UUID;
}

export interface DeleteSystemIntakeGRBReviewerInput {
  reviewerID: UUID;
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
 * The data needed to reopen a TRB request
 */
export interface ReopenTRBRequestInput {
  trbRequestId: UUID;
  reasonReopened: HTML;
  copyTrbMailbox: boolean;
  notifyEuaIds: string[];
}

/**
 * The inputs to the user feedback form
 */
export interface SendFeedbackEmailInput {
  isAnonymous: boolean;
  canBeContacted: boolean;
  easiServicesUsed: string[];
  cmsRole: string;
  systemEasyToUse: string;
  didntNeedHelpAnswering: string;
  questionsWereRelevant: string;
  hadAccessToInformation: string;
  howSatisfied: string;
  howCanWeImprove: string;
}

export interface SendReportAProblemEmailInput {
  isAnonymous: boolean;
  canBeContacted: boolean;
  easiService: string;
  whatWereYouDoing: string;
  whatWentWrong: string;
  howSevereWasTheProblem: string;
}

/**
 * The data needed to send a TRB advice letter, including who to notify
 */
export interface SendTRBAdviceLetterInput {
  id: UUID;
  copyTrbMailbox: boolean;
  notifyEuaIds: string[];
}

export interface SetRolesForUserOnSystemInput {
  cedarSystemID: string;
  euaUserId: string;
  desiredRoleTypeIDs: string[];
}

export interface SetSystemIntakeRelationExistingServiceInput {
  systemIntakeID: UUID;
  contractName: string;
  contractNumbers: string[];
}

export interface SetSystemIntakeRelationExistingSystemInput {
  systemIntakeID: UUID;
  cedarSystemIDs: string[];
  contractNumbers: string[];
}

export interface SetSystemIntakeRelationNewSystemInput {
  systemIntakeID: UUID;
  contractNumbers: string[];
}

export interface SetTRBRequestRelationExistingServiceInput {
  trbRequestID: UUID;
  contractName: string;
  contractNumbers: string[];
}

export interface SetTRBRequestRelationExistingSystemInput {
  trbRequestID: UUID;
  cedarSystemIDs: string[];
  contractNumbers: string[];
}

export interface SetTRBRequestRelationNewSystemInput {
  trbRequestID: UUID;
  contractNumbers: string[];
}

/**
 * Input to submit an intake for review
 */
export interface SubmitIntakeInput {
  id: UUID;
}

/**
 * Input data for current and planned year one annual costs associated with a system request
 */
export interface SystemIntakeAnnualSpendingInput {
  currentAnnualSpending?: string | null;
  currentAnnualSpendingITPortion?: string | null;
  plannedYearOneSpending?: string | null;
  plannedYearOneSpendingITPortion?: string | null;
}

/**
 * The input data used to set the CMS business owner of a system
 */
export interface SystemIntakeBusinessOwnerInput {
  name: string;
  component: string;
}

/**
 * Input for changing an intake's LCID retirement date in IT Gov v2
 */
export interface SystemIntakeChangeLCIDRetirementDateInput {
  systemIntakeID: UUID;
  retiresAt: Time;
  additionalInfo?: HTML | null;
  notificationRecipients?: EmailNotificationRecipients | null;
  adminNote?: HTML | null;
}

/**
 * Input for creating a Close Request Action in Admin Actions v2
 */
export interface SystemIntakeCloseRequestInput {
  systemIntakeID: UUID;
  notificationRecipients?: EmailNotificationRecipients | null;
  reason?: HTML | null;
  additionalInfo?: HTML | null;
  adminNote?: HTML | null;
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
 * Input for confirming an intake's decision to issue an LCID in IT Gov v2
 */
export interface SystemIntakeConfirmLCIDInput {
  systemIntakeID: UUID;
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
 * Input data containing information about a contract related to a system request
 */
export interface SystemIntakeContractInput {
  contractor?: string | null;
  endDate?: Time | null;
  hasContract?: string | null;
  startDate?: Time | null;
  numbers: string[];
}

/**
 * Input data for estimated system cost increases associated with a system request
 * 
 * NOTE: This field is no longer in intake form but data/query is preserved for existing intakes (EASI-2076)
 */
export interface SystemIntakeCostsInput {
  expectedIncreaseAmount?: string | null;
  isExpectingIncrease?: string | null;
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
 * Represents the source of funding for a system
 */
export interface SystemIntakeFundingSourceInput {
  fundingNumber?: string | null;
  source?: string | null;
}

/**
 * The input required to specify the funding source(s) for a system intake
 */
export interface SystemIntakeFundingSourcesInput {
  existingFunding?: boolean | null;
  fundingSources: SystemIntakeFundingSourceInput[];
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
 * The input data used to set the CMS product manager/lead of a system
 */
export interface SystemIntakeProductManagerInput {
  name: string;
  component: string;
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

/**
 * TRBRequestChanges represents the possible changes you can make to a TRB request when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface TRBRequestChanges {
  name?: string | null;
  archived?: boolean | null;
  type?: TRBRequestType | null;
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
 * The data needed to update a contact associated with a system intake
 */
export interface UpdateSystemIntakeContactInput {
  id: UUID;
  euaUserId: string;
  systemIntakeId: UUID;
  component: string;
  role: string;
}

/**
 * Input data for updating contract details related to a system request
 */
export interface UpdateSystemIntakeContractDetailsInput {
  id: UUID;
  fundingSources?: SystemIntakeFundingSourcesInput | null;
  costs?: SystemIntakeCostsInput | null;
  annualSpending?: SystemIntakeAnnualSpendingInput | null;
  contract?: SystemIntakeContractInput | null;
}

export interface UpdateSystemIntakeGRBReviewerInput {
  reviewerID: UUID;
  votingRole: SystemIntakeGRBReviewerVotingRole;
  grbRole: SystemIntakeGRBReviewerRole;
}

/**
 * Input data for updating an IT governance admin note
 */
export interface UpdateSystemIntakeNoteInput {
  content: HTML;
  isArchived: boolean;
  id: UUID;
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
  currentStage?: string | null;
  cedarSystemId?: string | null;
  hasUiChanges?: boolean | null;
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
 * The data needed to update a TRB advice letter
 */
export interface UpdateTRBAdviceLetterInput {
  trbRequestId: UUID;
  meetingSummary?: HTML | null;
  nextSteps?: HTML | null;
  isFollowupRecommended?: boolean | null;
  followupPoint?: string | null;
}

/**
 * The input required to update a recommendation to a TRB advice letter
 */
export interface UpdateTRBAdviceLetterRecommendationInput {
  id: UUID;
  title?: string | null;
  recommendation?: HTML | null;
  links?: string[] | null;
}

export interface UpdateTRBAdviceLetterRecommendationOrderInput {
  trbRequestId: UUID;
  newOrder: UUID[];
}

/**
 * Represents an EUA user who is included as an attendee for a TRB request
 */
export interface UpdateTRBRequestAttendeeInput {
  id: UUID;
  component: string;
  role: PersonRole;
}

/**
 * The data needed schedule a TRB consult meeting time
 */
export interface UpdateTRBRequestConsultMeetingTimeInput {
  trbRequestId: UUID;
  consultMeetingTime: Time;
  copyTrbMailbox: boolean;
  notifyEuaIds: string[];
  notes: string;
}

/**
 * Represents an EUA user who is included as an form for a TRB request
 */
export interface UpdateTRBRequestFormInput {
  trbRequestId: UUID;
  isSubmitted?: boolean | null;
  component?: string | null;
  needsAssistanceWith?: string | null;
  hasSolutionInMind?: boolean | null;
  proposedSolution?: string | null;
  whereInProcess?: TRBWhereInProcessOption | null;
  whereInProcessOther?: string | null;
  hasExpectedStartEndDates?: boolean | null;
  expectedStartDate?: Time | null;
  expectedEndDate?: Time | null;
  collabGroups?: TRBCollabGroupOption[] | null;
  collabDateSecurity?: string | null;
  collabDateEnterpriseArchitecture?: string | null;
  collabDateCloud?: string | null;
  collabDatePrivacyAdvisor?: string | null;
  collabDateGovernanceReviewBoard?: string | null;
  collabDateOther?: string | null;
  collabGroupOther?: string | null;
  collabGRBConsultRequested?: boolean | null;
  systemIntakes?: UUID[] | null;
  subjectAreaOptions?: TRBSubjectAreaOption[] | null;
  subjectAreaOptionOther?: string | null;
}

export interface UpdateTRBRequestFundingSourcesInput {
  trbRequestId: UUID;
  fundingNumber: string;
  sources: string[];
}

/**
 * The data needed assign a TRB lead to a TRB request
 */
export interface UpdateTRBRequestTRBLeadInput {
  trbRequestId: UUID;
  trbLead: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
