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
 * The possible types of assignees for CedarRoles
 */
export enum CedarAssigneeType {
  ORGANIZATION = "ORGANIZATION",
  PERSON = "PERSON",
}

/**
 * Indicates who the source is of feedback on a system request
 */
export enum GRTFeedbackType {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  GRB = "GRB",
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
  COMPLETED = "COMPLETED",
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_NEEDED = "NOT_NEEDED",
  READY = "READY",
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
  CLOUD_NAVIGATOR = "CLOUD_NAVIGATOR",
  CONTRACT_OFFICE_RSREPRESENTATIVE = "CONTRACT_OFFICE_RSREPRESENTATIVE",
  CRA = "CRA",
  OTHER = "OTHER",
  PRIVACY_ADVISOR = "PRIVACY_ADVISOR",
  PRODUCT_OWNER = "PRODUCT_OWNER",
  SYSTEM_MAINTAINER = "SYSTEM_MAINTAINER",
  SYSTEM_OWNER = "SYSTEM_OWNER",
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
  DRAFT_ICGE = "DRAFT_ICGE",
  OTHER = "OTHER",
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
 * The status of a system's IT governence request
 * Note - pre-IT Gov v2 only - for IT Gov v2, use SystemIntakeStatusRequester/SystemIntakeStatusAdmin
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
 * 508/accessibility request
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
  notificationRecipients?: EmailNotificationRecipients | null;
}

/**
 * Input to add feedback to a system request
 */
export interface BasicActionInput {
  feedback: string;
  intakeId: UUID;
  notificationRecipients?: EmailNotificationRecipients | null;
}

/**
 * The input needed to close a TRB request
 */
export interface CloseTRBRequestInput {
  id: UUID;
  reasonClosed: string;
  copyTrbMailbox: boolean;
  notifyEuaIds: string[];
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
  intakeID?: UUID | null;
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
  notificationRecipients?: EmailNotificationRecipients | null;
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
  otherTypeDescription?: string | null;
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
 * The data needed to create a TRB admin note
 */
export interface CreateTRBAdminNoteInput {
  trbRequestId: UUID;
  category: TRBAdminNoteCategory;
  noteText: string;
}

/**
 * The input required to add a recommendation & links to a TRB advice letter
 */
export interface CreateTRBAdviceLetterRecommendationInput {
  trbRequestId: UUID;
  title: string;
  recommendation: string;
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
  feedbackMessage: string;
  copyTrbMailbox: boolean;
  notifyEuaIds: string[];
  action: TRBFeedbackAction;
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
 * The data needed to delete a system intake contact
 */
export interface DeleteSystemIntakeContactInput {
  id: UUID;
}

export interface DeleteTRBRequestFundingSourcesInput {
  trbRequestId: UUID;
  fundingNumber: string;
}

/**
 * The input required to delete a test date/score
 */
export interface DeleteTestDateInput {
  id: UUID;
}

export interface EmailNotificationRecipients {
  regularRecipientEmails: EmailAddress[];
  shouldNotifyITGovernance: boolean;
  shouldNotifyITInvestment: boolean;
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
  notificationRecipients?: EmailNotificationRecipients | null;
}

/**
 * Input data for rejection of a system's IT governance request
 */
export interface RejectIntakeInput {
  feedback: string;
  intakeId: UUID;
  nextSteps?: string | null;
  reason: string;
  notificationRecipients?: EmailNotificationRecipients | null;
}

/**
 * The data needed to reopen a TRB request
 */
export interface ReopenTRBRequestInput {
  trbRequestId: UUID;
  reasonReopened: string;
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
  plannedYearOneSpending?: string | null;
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
  number?: string | null;
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
 * Parameters for updating a 508/accessibility request's associated CEDAR system
 */
export interface UpdateAccessibilityRequestCedarSystemInput {
  id: UUID;
  cedarSystemId: string;
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

/**
 * Input data for updating an IT governance admin note
 */
export interface UpdateSystemIntakeNoteInput {
  content: string;
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
  meetingSummary?: string | null;
  nextSteps?: string | null;
  isFollowupRecommended?: boolean | null;
  followupPoint?: string | null;
}

/**
 * The input required to update a recommendation to a TRB advice letter
 */
export interface UpdateTRBAdviceLetterRecommendationInput {
  id: UUID;
  title?: string | null;
  recommendation?: string | null;
  links?: string[] | null;
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
