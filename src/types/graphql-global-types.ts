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
  UNKNOWN = "UNKNOWN",
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
 * The possible answers to the "application development" input on the TRB "Subject Areas" page
 */
export enum TRBApplicationDevelopmentOption {
  ACCESSIBILITY_COMPLIANCE = "ACCESSIBILITY_COMPLIANCE",
  APPLICATION_DEVELOPMENT = "APPLICATION_DEVELOPMENT",
  BUSINESS_INTELLIGENCE = "BUSINESS_INTELLIGENCE",
  CONFIGURATION_MANAGEMENT = "CONFIGURATION_MANAGEMENT",
  CONTAINERS_AND_MICROSERVICES = "CONTAINERS_AND_MICROSERVICES",
  EMAIL_INTEGRATION = "EMAIL_INTEGRATION",
  GENERAL_APPLICATION_DEVELOPMENT_SERVICES_INFORMATION = "GENERAL_APPLICATION_DEVELOPMENT_SERVICES_INFORMATION",
  OPEN_SOURCE_SOFTWARE = "OPEN_SOURCE_SOFTWARE",
  OTHER = "OTHER",
  PORTAL_INTEGRATION = "PORTAL_INTEGRATION",
  ROBOTIC_PROCESS_AUTOMATION = "ROBOTIC_PROCESS_AUTOMATION",
  SYSTEM_ARCHITECTURE_REVIEW = "SYSTEM_ARCHITECTURE_REVIEW",
  WEB_BASED_UI_SERVICES = "WEB_BASED_UI_SERVICES",
  WEB_SERVICES_AND_WEB_APIS = "WEB_SERVICES_AND_WEB_APIS",
}

/**
 * The possible answers to the "cloud and infrastructure" input on the TRB "Subject Areas" page
 */
export enum TRBCloudAndInfrastructureOption {
  CLOUD_IAAS_AND_PAAS_INFRASTRUCTURE = "CLOUD_IAAS_AND_PAAS_INFRASTRUCTURE",
  CLOUD_MIGRATION = "CLOUD_MIGRATION",
  DATA_STORAGE_SERVICES = "DATA_STORAGE_SERVICES",
  DISASTER_RECOVERY = "DISASTER_RECOVERY",
  FILE_TRANSFER = "FILE_TRANSFER",
  GENERAL_CLOUD_AND_INFRASTRUCTURE_SERVICES_INFORMATION = "GENERAL_CLOUD_AND_INFRASTRUCTURE_SERVICES_INFORMATION",
  IT_PERFORMANCE_MANAGEMENT = "IT_PERFORMANCE_MANAGEMENT",
  KEYS_AND_SECRETS_MANAGEMENT = "KEYS_AND_SECRETS_MANAGEMENT",
  MOBILE_DEVICES_AND_APPLICATIONS = "MOBILE_DEVICES_AND_APPLICATIONS",
  OTHER = "OTHER",
  SOFTWARE_AS_A_SERVICE = "SOFTWARE_AS_A_SERVICE",
  VIRTUALIZATION = "VIRTUALIZATION",
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
 * The possible answers to the "data and data management" input on the TRB "Subject Areas" page
 */
export enum TRBDataAndDataManagementOption {
  ANALYTIC_SANDBOXES = "ANALYTIC_SANDBOXES",
  APIS_AND_DATA_EXCHANGES = "APIS_AND_DATA_EXCHANGES",
  DATA_MART = "DATA_MART",
  DATA_WAREHOUSING = "DATA_WAREHOUSING",
  ENTERPRISE_DATA_ENVIRONMENT_REVIEW = "ENTERPRISE_DATA_ENVIRONMENT_REVIEW",
  FHIR = "FHIR",
  GENERAL_DATA_AND_DATA_MANAGEMENT_INFORMATION = "GENERAL_DATA_AND_DATA_MANAGEMENT_INFORMATION",
  OTHER = "OTHER",
}

/**
 * The possible answers to the "government processes and policies" input on the TRB "Subject Areas" page
 */
export enum TRBGovernmentProcessesAndPoliciesOption {
  CONTRACTING_AND_PROCUREMENT = "CONTRACTING_AND_PROCUREMENT",
  GENERAL_INFORMATION_ABOUT_CMS_PROCESSES_AND_POLICIES = "GENERAL_INFORMATION_ABOUT_CMS_PROCESSES_AND_POLICIES",
  INFRASTRUCTURE_AS_A_SERVICE = "INFRASTRUCTURE_AS_A_SERVICE",
  INVESTMENT_AND_BUDGET_PLANNING = "INVESTMENT_AND_BUDGET_PLANNING",
  LIFECYCLE_IDS = "LIFECYCLE_IDS",
  OTHER = "OTHER",
  OTHER_AVAILABLE_TRB_SERVICES = "OTHER_AVAILABLE_TRB_SERVICES",
  SECTION_508_AND_ACCESSIBILITY_TESTING = "SECTION_508_AND_ACCESSIBILITY_TESTING",
  SECURITY_ASSESSMENTS = "SECURITY_ASSESSMENTS",
  SYSTEM_DISPOSITION_PLANNING = "SYSTEM_DISPOSITION_PLANNING",
  TARGET_LIFE_CYCLE = "TARGET_LIFE_CYCLE",
}

/**
 * The possible answers to the "network and security" input on the TRB "Subject Areas" page
 */
export enum TRBNetworkAndSecurityOption {
  ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT = "ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT",
  CMS_CYBERSECURITY_INTEGRATION_CENTER_INTEGRATION = "CMS_CYBERSECURITY_INTEGRATION_CENTER_INTEGRATION",
  DOMAIN_NAME_SYSTEM_SERVICES = "DOMAIN_NAME_SYSTEM_SERVICES",
  GENERAL_NETWORK_AND_SECURITY_SERVICES_INFORMATION = "GENERAL_NETWORK_AND_SECURITY_SERVICES_INFORMATION",
  OTHER = "OTHER",
  SECURITY_SERVICES = "SECURITY_SERVICES",
  WIDE_AREA_NETWORK_SERVICES = "WIDE_AREA_NETWORK_SERVICES",
}

/**
 * The possible answers to the "other technical topics" input on the TRB "Subject Areas" page
 */
export enum TRBOtherTechnicalTopicsOption {
  ARTIFICIAL_INTELLIGENCE = "ARTIFICIAL_INTELLIGENCE",
  ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT = "ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT",
  MACHINE_LEARNING = "MACHINE_LEARNING",
  OTHER = "OTHER",
}

export enum TRBRequestStatus {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export enum TRBRequestType {
  BRAINSTORM = "BRAINSTORM",
  FOLLOWUP = "FOLLOWUP",
  FORMAL_REVIEW = "FORMAL_REVIEW",
  NEED_HELP = "NEED_HELP",
}

/**
 * The possible answers to the "technical reference architecture" input on the TRB "Subject Areas" page
 */
export enum TRBTechnicalReferenceArchitectureOption {
  ABOUT_THE_TRB = "ABOUT_THE_TRB",
  ARCHITECTURE_CHANGE_REQUEST_PROCESS_FOR_THE_TRA = "ARCHITECTURE_CHANGE_REQUEST_PROCESS_FOR_THE_TRA",
  CMS_PROCESSING_ENVIRONMENTS = "CMS_PROCESSING_ENVIRONMENTS",
  CMS_TRA_BUSINESS_RULES = "CMS_TRA_BUSINESS_RULES",
  CMS_TRA_MULTI_ZONE_ARCHITECTURE = "CMS_TRA_MULTI_ZONE_ARCHITECTURE",
  GENERAL_TRA_INFORMATION = "GENERAL_TRA_INFORMATION",
  OTHER = "OTHER",
  TRA_GUIDING_PRINCIPLES = "TRA_GUIDING_PRINCIPLES",
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
  shouldSendEmail: boolean;
  notificationRecipients?: EmailNotificationRecipients | null;
}

/**
 * Input to add feedback to a system request
 */
export interface BasicActionInput {
  feedback: string;
  intakeId: UUID;
  shouldSendEmail: boolean;
  notificationRecipients?: EmailNotificationRecipients | null;
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
  shouldSendEmail: boolean;
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
 * The data needed add a TRB request attendee to a TRB request
 */
export interface CreateTRBRequestAttendeeInput {
  euaUserId: string;
  trbRequestId: UUID;
  component: string;
  role: PersonRole;
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
  shouldSendEmail: boolean;
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
  shouldSendEmail: boolean;
  notificationRecipients?: EmailNotificationRecipients | null;
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
  number?: string | null;
}

/**
 * Input data for estimated system cost increases associated with a system request
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
  status?: TRBRequestStatus | null;
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
  currentStage?: string | null;
  cedarSystemId?: string | null;
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
 * Represents an EUA user who is included as an attendee for a TRB request
 */
export interface UpdateTRBRequestAttendeeInput {
  id: UUID;
  component: string;
  role: PersonRole;
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
  subjectAreaTechnicalReferenceArchitecture?: TRBTechnicalReferenceArchitectureOption[] | null;
  subjectAreaNetworkAndSecurity?: TRBNetworkAndSecurityOption[] | null;
  subjectAreaCloudAndInfrastructure?: TRBCloudAndInfrastructureOption[] | null;
  subjectAreaApplicationDevelopment?: TRBApplicationDevelopmentOption[] | null;
  subjectAreaDataAndDataManagement?: TRBDataAndDataManagementOption[] | null;
  subjectAreaGovernmentProcessesAndPolicies?: TRBGovernmentProcessesAndPoliciesOption[] | null;
  subjectAreaOtherTechnicalTopics?: TRBOtherTechnicalTopicsOption[] | null;
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
