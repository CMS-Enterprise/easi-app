export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Time values are represented as strings using RFC3339 format, for example 2019-10-12T07:20:50.52Z */
  Time: any;
  /** UUIDs are represented using 36 ASCII characters, for example B0511859-ADE6-4A67-8969-16EC280C0E1A */
  UUID: any;
};


/**
 * An accessibility request represents a system that needs to go through
 * the 508 process.
 */
export type AccessibilityRequest = {
  __typename?: 'AccessibilityRequest';
  documents: Array<AccessibilityRequestDocument>;
  id: Scalars['UUID'];
  name: Scalars['String'];
  relevantTestDate?: Maybe<TestDate>;
  submittedAt: Scalars['Time'];
  system: System;
  testDates: Array<TestDate>;
};

/** A document that belongs to an accessibility request */
export type AccessibilityRequestDocument = {
  __typename?: 'AccessibilityRequestDocument';
  documentType: AccessibilityRequestDocumentType;
  id: Scalars['UUID'];
  mimeType: Scalars['String'];
  name: Scalars['String'];
  requestID: Scalars['UUID'];
  size: Scalars['Int'];
  status: AccessibilityRequestDocumentStatus;
  uploadedAt: Scalars['Time'];
  url: Scalars['String'];
};

/** Common document type of an Accessibility Request document */
export enum AccessibilityRequestDocumentCommonType {
  /** Awarded VPAT */
  AwardedVpat = 'AWARDED_VPAT',
  /** Other document */
  Other = 'OTHER',
  /** Remediation Plan */
  RemediationPlan = 'REMEDIATION_PLAN',
  /** Testing VPAT */
  TestingVpat = 'TESTING_VPAT',
  /** Test Plan */
  TestPlan = 'TEST_PLAN',
  /** Test Results */
  TestResults = 'TEST_RESULTS'
}

/** Represents the availability of a document */
export enum AccessibilityRequestDocumentStatus {
  /** Passed security screen */
  Available = 'AVAILABLE',
  /** Just uploaded */
  Pending = 'PENDING',
  /** Failed security screen */
  Unavailable = 'UNAVAILABLE'
}

/** Document type of an Accessibility Request document */
export type AccessibilityRequestDocumentType = {
  __typename?: 'AccessibilityRequestDocumentType';
  commonType: AccessibilityRequestDocumentCommonType;
  otherTypeDescription?: Maybe<Scalars['String']>;
};

/** An edge of an AccessibilityRequestConnection */
export type AccessibilityRequestEdge = {
  __typename?: 'AccessibilityRequestEdge';
  cursor: Scalars['String'];
  node: AccessibilityRequest;
};

/** A collection of AccessibilityRequests */
export type AccessibilityRequestsConnection = {
  __typename?: 'AccessibilityRequestsConnection';
  edges: Array<AccessibilityRequestEdge>;
  totalCount: Scalars['Int'];
};

/** Input for adding GRT Feedback */
export type AddGrtFeedbackInput = {
  emailBody: Scalars['String'];
  feedback: Scalars['String'];
  intakeID: Scalars['UUID'];
};

/** Response for adding GRT Feedback */
export type AddGrtFeedbackPayload = {
  __typename?: 'AddGRTFeedbackPayload';
  id?: Maybe<Scalars['UUID']>;
};

/** Parameters for actions without additional fields */
export type BasicActionInput = {
  feedback: Scalars['String'];
  intakeId: Scalars['UUID'];
};

/** A Business Case instance */
export type BusinessCase = {
  __typename?: 'BusinessCase';
  alternativeASolution?: Maybe<BusinessCaseSolution>;
  alternativeBSolution?: Maybe<BusinessCaseSolution>;
  asIsSolution?: Maybe<BusinessCaseAsIsSolution>;
  businessNeed?: Maybe<Scalars['String']>;
  businessOwner?: Maybe<Scalars['String']>;
  cmsBenefit?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  euaUserId: Scalars['String'];
  id: Scalars['UUID'];
  initialSubmittedAt?: Maybe<Scalars['Time']>;
  lastSubmittedAt?: Maybe<Scalars['Time']>;
  lifecycleCostLines?: Maybe<Array<EstimatedLifecycleCost>>;
  preferredSolution?: Maybe<BusinessCaseSolution>;
  priorityAlignment?: Maybe<Scalars['String']>;
  projectName?: Maybe<Scalars['String']>;
  requester?: Maybe<Scalars['String']>;
  requesterPhoneNumber?: Maybe<Scalars['String']>;
  status: BusinessCaseStatus;
  submittedAt?: Maybe<Scalars['Time']>;
  successIndicators?: Maybe<Scalars['String']>;
  systemIntake: SystemIntake;
  updatedAt: Scalars['Time'];
};

/** The shape of a solution for a business case */
export type BusinessCaseAsIsSolution = {
  __typename?: 'BusinessCaseAsIsSolution';
  cons?: Maybe<Scalars['String']>;
  costSavings?: Maybe<Scalars['String']>;
  pros?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** The shape of a solution for a business case */
export type BusinessCaseSolution = {
  __typename?: 'BusinessCaseSolution';
  acquisitionApproach?: Maybe<Scalars['String']>;
  cons?: Maybe<Scalars['String']>;
  costSavings?: Maybe<Scalars['String']>;
  hasUi?: Maybe<Scalars['String']>;
  hostingCloudServiceType?: Maybe<Scalars['String']>;
  hostingLocation?: Maybe<Scalars['String']>;
  hostingType?: Maybe<Scalars['String']>;
  pros?: Maybe<Scalars['String']>;
  securityIsApproved?: Maybe<Scalars['Boolean']>;
  securityIsBeingReviewed?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** Business Case status options */
export enum BusinessCaseStatus {
  /** closed */
  Closed = 'CLOSED',
  /** open */
  Open = 'OPEN'
}

/** A business owner is the person at CMS responsible for a system */
export type BusinessOwner = {
  __typename?: 'BusinessOwner';
  component: Scalars['String'];
  name: Scalars['String'];
};

/** A date for a contract */
export type ContractDate = {
  __typename?: 'ContractDate';
  day?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
};

/** Parameters for createAccessibilityRequestDocument */
export type CreateAccessibilityRequestDocumentInput = {
  commonDocumentType: AccessibilityRequestDocumentCommonType;
  mimeType: Scalars['String'];
  name: Scalars['String'];
  otherDocumentTypeDescription?: Maybe<Scalars['String']>;
  requestID: Scalars['UUID'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

/** Result of createAccessibilityRequestDocument */
export type CreateAccessibilityRequestDocumentPayload = {
  __typename?: 'CreateAccessibilityRequestDocumentPayload';
  accessibilityRequestDocument?: Maybe<AccessibilityRequestDocument>;
  userErrors?: Maybe<Array<UserError>>;
};

/** Parameters required to create an AccessibilityRequest */
export type CreateAccessibilityRequestInput = {
  intakeID: Scalars['UUID'];
  name: Scalars['String'];
};

/** Result of CreateAccessibilityRequest */
export type CreateAccessibilityRequestPayload = {
  __typename?: 'CreateAccessibilityRequestPayload';
  accessibilityRequest?: Maybe<AccessibilityRequest>;
  userErrors?: Maybe<Array<UserError>>;
};

/** Parameters required to create a note for an intake */
export type CreateSystemIntakeNoteInput = {
  content: Scalars['String'];
  authorName: Scalars['String'];
  intakeId: Scalars['UUID'];
};

/** Parameters for creating a test date */
export type CreateTestDateInput = {
  date: Scalars['Time'];
  requestID: Scalars['UUID'];
  score?: Maybe<Scalars['Int']>;
  testType: TestDateTestType;
};

/** Result of createTestDate */
export type CreateTestDatePayload = {
  __typename?: 'CreateTestDatePayload';
  testDate?: Maybe<TestDate>;
  userErrors?: Maybe<Array<UserError>>;
};

/** The shape of an estimated lifecycle cost row */
export type EstimatedLifecycleCost = {
  __typename?: 'EstimatedLifecycleCost';
  businessCaseId: Scalars['UUID'];
  cost?: Maybe<Scalars['Int']>;
  id: Scalars['UUID'];
  phase?: Maybe<LifecycleCostPhase>;
  solution?: Maybe<LifecycleCostSolution>;
  year?: Maybe<LifecycleCostYear>;
};

/** Feedback from the GRT to a business owner or GRB */
export type GrtFeedback = {
  __typename?: 'GRTFeedback';
  id?: Maybe<Scalars['UUID']>;
  createdAt?: Maybe<Scalars['Time']>;
  feedback?: Maybe<Scalars['String']>;
  feedbackType?: Maybe<GrtFeedbackType>;
};

/** Type or recipient of GRT Feedback */
export enum GrtFeedbackType {
  /** Feedback for the business owner */
  BusinessOwner = 'BUSINESS_OWNER',
  /** Recommendations to the GRB */
  Grb = 'GRB'
}

/** Parameters required to generate a presigned upload URL */
export type GeneratePresignedUploadUrlInput = {
  fileName: Scalars['String'];
  mimeType: Scalars['String'];
  size: Scalars['Int'];
};

/** Result of CreateAccessibilityRequest */
export type GeneratePresignedUploadUrlPayload = {
  __typename?: 'GeneratePresignedUploadURLPayload';
  url?: Maybe<Scalars['String']>;
  userErrors?: Maybe<Array<UserError>>;
};

/** Input for issuing a lifecycle id */
export type IssueLifecycleIdInput = {
  expiresAt: Scalars['Time'];
  feedback: Scalars['String'];
  intakeId: Scalars['UUID'];
  lcid?: Maybe<Scalars['String']>;
  nextSteps?: Maybe<Scalars['String']>;
  scope: Scalars['String'];
};

/** enum */
export enum LifecycleCostPhase {
  /** development */
  Development = 'DEVELOPMENT',
  /** Operations and Maintenance */
  OperationsAndMaintenance = 'OPERATIONS_AND_MAINTENANCE',
  /** Other */
  Other = 'OTHER'
}

/** enum */
export enum LifecycleCostSolution {
  /** A */
  A = 'A',
  /** As is */
  AsIs = 'AS_IS',
  /** B */
  B = 'B',
  /** Preferred */
  Preferred = 'PREFERRED'
}

/** enum */
export enum LifecycleCostYear {
  /** 1 */
  LifecycleCostYear_1 = 'LIFECYCLE_COST_YEAR_1',
  /** 2 */
  LifecycleCostYear_2 = 'LIFECYCLE_COST_YEAR_2',
  /** 3 */
  LifecycleCostYear_3 = 'LIFECYCLE_COST_YEAR_3',
  /** 4 */
  LifecycleCostYear_4 = 'LIFECYCLE_COST_YEAR_4',
  /** 5 */
  LifecycleCostYear_5 = 'LIFECYCLE_COST_YEAR_5'
}

/** The root mutation */
export type Mutation = {
  __typename?: 'Mutation';
  addGRTFeedbackAndKeepBusinessCaseInDraft?: Maybe<AddGrtFeedbackPayload>;
  addGRTFeedbackAndProgressToFinalBusinessCase?: Maybe<AddGrtFeedbackPayload>;
  addGRTFeedbackAndRequestBusinessCase?: Maybe<AddGrtFeedbackPayload>;
  createAccessibilityRequest?: Maybe<CreateAccessibilityRequestPayload>;
  createAccessibilityRequestDocument?: Maybe<CreateAccessibilityRequestDocumentPayload>;
  createSystemIntakeActionBusinessCaseNeeded?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionBusinessCaseNeedsChanges?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionGuideReceievedClose?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionNoGovernanceNeeded?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionNotItRequest?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionNotRespondingClose?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionReadyForGRT?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionSendEmail?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeNote?: Maybe<SystemIntakeNote>;
  createTestDate?: Maybe<CreateTestDatePayload>;
  generatePresignedUploadURL?: Maybe<GeneratePresignedUploadUrlPayload>;
  issueLifecycleId?: Maybe<UpdateSystemIntakePayload>;
  markSystemIntakeReadyForGRB?: Maybe<AddGrtFeedbackPayload>;
  rejectIntake?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeAdminLead?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeReviewDates?: Maybe<UpdateSystemIntakePayload>;
  updateTestDate?: Maybe<UpdateTestDatePayload>;
};


/** The root mutation */
export type MutationAddGrtFeedbackAndKeepBusinessCaseInDraftArgs = {
  input: AddGrtFeedbackInput;
};


/** The root mutation */
export type MutationAddGrtFeedbackAndProgressToFinalBusinessCaseArgs = {
  input: AddGrtFeedbackInput;
};


/** The root mutation */
export type MutationAddGrtFeedbackAndRequestBusinessCaseArgs = {
  input: AddGrtFeedbackInput;
};


/** The root mutation */
export type MutationCreateAccessibilityRequestArgs = {
  input: CreateAccessibilityRequestInput;
};


/** The root mutation */
export type MutationCreateAccessibilityRequestDocumentArgs = {
  input: CreateAccessibilityRequestDocumentInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeActionBusinessCaseNeededArgs = {
  input: BasicActionInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeActionBusinessCaseNeedsChangesArgs = {
  input: BasicActionInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeActionGuideReceievedCloseArgs = {
  input: BasicActionInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeActionNoGovernanceNeededArgs = {
  input: BasicActionInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeActionNotItRequestArgs = {
  input: BasicActionInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeActionNotRespondingCloseArgs = {
  input: BasicActionInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeActionReadyForGrtArgs = {
  input: BasicActionInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeActionSendEmailArgs = {
  input: BasicActionInput;
};


/** The root mutation */
export type MutationCreateSystemIntakeNoteArgs = {
  input: CreateSystemIntakeNoteInput;
};


/** The root mutation */
export type MutationCreateTestDateArgs = {
  input: CreateTestDateInput;
};


/** The root mutation */
export type MutationGeneratePresignedUploadUrlArgs = {
  input: GeneratePresignedUploadUrlInput;
};


/** The root mutation */
export type MutationIssueLifecycleIdArgs = {
  input: IssueLifecycleIdInput;
};


/** The root mutation */
export type MutationMarkSystemIntakeReadyForGrbArgs = {
  input: AddGrtFeedbackInput;
};


/** The root mutation */
export type MutationRejectIntakeArgs = {
  input: RejectIntakeInput;
};


/** The root mutation */
export type MutationUpdateSystemIntakeAdminLeadArgs = {
  input: UpdateSystemIntakeAdminLeadInput;
};


/** The root mutation */
export type MutationUpdateSystemIntakeReviewDatesArgs = {
  input: UpdateSystemIntakeReviewDatesInput;
};


/** The root mutation */
export type MutationUpdateTestDateArgs = {
  input: UpdateTestDateInput;
};

/** The root query */
export type Query = {
  __typename?: 'Query';
  accessibilityRequest?: Maybe<AccessibilityRequest>;
  accessibilityRequests?: Maybe<AccessibilityRequestsConnection>;
  systemIntake?: Maybe<SystemIntake>;
  systems?: Maybe<SystemConnection>;
};


/** The root query */
export type QueryAccessibilityRequestArgs = {
  id: Scalars['UUID'];
};


/** The root query */
export type QueryAccessibilityRequestsArgs = {
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
};


/** The root query */
export type QuerySystemIntakeArgs = {
  id: Scalars['UUID'];
};


/** The root query */
export type QuerySystemsArgs = {
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
};

/** Input for rejecting an intake */
export type RejectIntakeInput = {
  feedback: Scalars['String'];
  intakeId: Scalars['UUID'];
  nextSteps?: Maybe<Scalars['String']>;
  reason: Scalars['String'];
};

/** A user role associated with a job code */
export enum Role {
  /** A 508 Tester */
  Easi_508Tester = 'EASI_508_TESTER',
  /** A 508 request owner */
  Easi_508User = 'EASI_508_USER',
  /** A member of the GRT */
  EasiGovteam = 'EASI_GOVTEAM',
  /** A generic EASi user */
  EasiUser = 'EASI_USER'
}

/** A system is derived from a system intake and represents a computer system managed by CMS */
export type System = {
  __typename?: 'System';
  businessOwner: BusinessOwner;
  id: Scalars['UUID'];
  lcid: Scalars['String'];
  name: Scalars['String'];
};

/** A collection of Systems */
export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges: Array<SystemEdge>;
  totalCount: Scalars['Int'];
};

/** An edge of an SystemConnection */
export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor: Scalars['String'];
  node: System;
};

/** A SystemIntake instance */
export type SystemIntake = {
  __typename?: 'SystemIntake';
  actions: Array<SystemIntakeAction>;
  adminLead?: Maybe<Scalars['String']>;
  archivedAt?: Maybe<Scalars['Time']>;
  businessCase?: Maybe<BusinessCase>;
  businessNeed?: Maybe<Scalars['String']>;
  businessOwner?: Maybe<SystemIntakeBusinessOwner>;
  businessSolution?: Maybe<Scalars['String']>;
  contract?: Maybe<SystemIntakeContract>;
  costs?: Maybe<SystemIntakeCosts>;
  createdAt: Scalars['Time'];
  currentStage?: Maybe<Scalars['String']>;
  decisionNextSteps?: Maybe<Scalars['String']>;
  eaCollaborator?: Maybe<Scalars['String']>;
  eaCollaboratorName?: Maybe<Scalars['String']>;
  euaUserId: Scalars['String'];
  fundingSource?: Maybe<SystemIntakeFundingSource>;
  governanceTeams?: Maybe<SystemIntakeGovernanceTeam>;
  grbDate?: Maybe<Scalars['Time']>;
  grtDate?: Maybe<Scalars['Time']>;
  grtFeedbacks: Array<GrtFeedback>;
  id: Scalars['UUID'];
  isso?: Maybe<SystemIntakeIsso>;
  lcid?: Maybe<Scalars['String']>;
  lcidExpiresAt?: Maybe<Scalars['Time']>;
  lcidScope?: Maybe<Scalars['String']>;
  needsEaSupport?: Maybe<Scalars['Boolean']>;
  notes: Array<SystemIntakeNote>;
  oitSecurityCollaborator?: Maybe<Scalars['String']>;
  oitSecurityCollaboratorName?: Maybe<Scalars['String']>;
  productManager?: Maybe<SystemIntakeProductManager>;
  projectAcronym?: Maybe<Scalars['String']>;
  rejectionReason?: Maybe<Scalars['String']>;
  requestName?: Maybe<Scalars['String']>;
  requestType: SystemIntakeRequestType;
  requester: SystemIntakeRequester;
  status: SystemIntakeStatus;
  submittedAt?: Maybe<Scalars['Time']>;
  trbCollaborator?: Maybe<Scalars['String']>;
  trbCollaboratorName?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
};

/** An action taken on a system intake, often resulting in a change in status. */
export type SystemIntakeAction = {
  __typename?: 'SystemIntakeAction';
  id: Scalars['UUID'];
  systemIntake: SystemIntake;
  type: SystemIntakeActionType;
  actor: SystemIntakeActionActor;
  feedback?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
};

/** A person performing an action on a system intake */
export type SystemIntakeActionActor = {
  __typename?: 'SystemIntakeActionActor';
  name: Scalars['String'];
  email: Scalars['String'];
};

/** Indicates which action should be taken */
export enum SystemIntakeActionType {
  BizCaseNeedsChanges = 'BIZ_CASE_NEEDS_CHANGES',
  CreateBizCase = 'CREATE_BIZ_CASE',
  GuideReceivedClose = 'GUIDE_RECEIVED_CLOSE',
  IssueLcid = 'ISSUE_LCID',
  NeedBizCase = 'NEED_BIZ_CASE',
  NoGovernanceNeeded = 'NO_GOVERNANCE_NEEDED',
  NotItRequest = 'NOT_IT_REQUEST',
  NotRespondingClose = 'NOT_RESPONDING_CLOSE',
  ProvideFeedbackNeedBizCase = 'PROVIDE_FEEDBACK_NEED_BIZ_CASE',
  ProvideGrtFeedbackBizCaseDraft = 'PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT',
  ProvideGrtFeedbackBizCaseFinal = 'PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL',
  ReadyForGrb = 'READY_FOR_GRB',
  ReadyForGrt = 'READY_FOR_GRT',
  Reject = 'REJECT',
  SendEmail = 'SEND_EMAIL',
  SubmitBizCase = 'SUBMIT_BIZ_CASE',
  SubmitFinalBizCase = 'SUBMIT_FINAL_BIZ_CASE',
  SubmitIntake = 'SUBMIT_INTAKE'
}

/** A business owner for a system intake */
export type SystemIntakeBusinessOwner = {
  __typename?: 'SystemIntakeBusinessOwner';
  component?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** A collaborator for an intake */
export type SystemIntakeCollaborator = {
  __typename?: 'SystemIntakeCollaborator';
  acronym?: Maybe<Scalars['String']>;
  collaborator?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** A contract for a system intake */
export type SystemIntakeContract = {
  __typename?: 'SystemIntakeContract';
  contractor?: Maybe<Scalars['String']>;
  endDate?: Maybe<ContractDate>;
  hasContract?: Maybe<Scalars['String']>;
  startDate?: Maybe<ContractDate>;
  vehicle?: Maybe<Scalars['String']>;
};

/** costs for a system intake */
export type SystemIntakeCosts = {
  __typename?: 'SystemIntakeCosts';
  expectedIncreaseAmount?: Maybe<Scalars['String']>;
  isExpectingIncrease?: Maybe<Scalars['String']>;
};

/** A funding source for a system intake */
export type SystemIntakeFundingSource = {
  __typename?: 'SystemIntakeFundingSource';
  fundingNumber?: Maybe<Scalars['String']>;
  isFunded?: Maybe<Scalars['Boolean']>;
  source?: Maybe<Scalars['String']>;
};

/** governanceTeam for an intake */
export type SystemIntakeGovernanceTeam = {
  __typename?: 'SystemIntakeGovernanceTeam';
  isPresent?: Maybe<Scalars['Boolean']>;
  teams?: Maybe<Array<SystemIntakeCollaborator>>;
};

/** An isso for a system intake */
export type SystemIntakeIsso = {
  __typename?: 'SystemIntakeISSO';
  isPresent?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
};

/** A note on a system intake */
export type SystemIntakeNote = {
  __typename?: 'SystemIntakeNote';
  author: SystemIntakeNoteAuthor;
  content: Scalars['String'];
  createdAt: Scalars['Time'];
  id: Scalars['UUID'];
};

/** The author of a system intake note */
export type SystemIntakeNoteAuthor = {
  __typename?: 'SystemIntakeNoteAuthor';
  eua: Scalars['String'];
  name: Scalars['String'];
};

/** A product manager for a system intake */
export type SystemIntakeProductManager = {
  __typename?: 'SystemIntakeProductManager';
  component?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** The request types for a system intake */
export enum SystemIntakeRequestType {
  /** Request is for major changes to an existing system */
  MajorChanges = 'MAJOR_CHANGES',
  /** Request is for a new system */
  New = 'NEW',
  /** Request is for re-competing an existing system */
  Recompete = 'RECOMPETE',
  /** Request is to shut down an existing system */
  Shutdown = 'SHUTDOWN'
}

/** A requester for a system intake */
export type SystemIntakeRequester = {
  __typename?: 'SystemIntakeRequester';
  component?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

/** The statuses for a system intake */
export enum SystemIntakeStatus {
  /** Accepted */
  Accepted = 'ACCEPTED',
  /** Business case needs changes */
  BizCaseChangesNeeded = 'BIZ_CASE_CHANGES_NEEDED',
  /** Busness case draft */
  BizCaseDraft = 'BIZ_CASE_DRAFT',
  /** Business case draft submitted */
  BizCaseDraftSubmitted = 'BIZ_CASE_DRAFT_SUBMITTED',
  /** Business case final needed */
  BizCaseFinalNeeded = 'BIZ_CASE_FINAL_NEEDED',
  /** Business case final submitted */
  BizCaseFinalSubmitted = 'BIZ_CASE_FINAL_SUBMITTED',
  /** Intake is in draft */
  IntakeDraft = 'INTAKE_DRAFT',
  /** Intake is submitted */
  IntakeSubmitted = 'INTAKE_SUBMITTED',
  /** Lifecycle ID issued */
  LcidIssued = 'LCID_ISSUED',
  /** Need business case */
  NeedBizCase = 'NEED_BIZ_CASE',
  /** Request not approved */
  NotApproved = 'NOT_APPROVED',
  /** Request is not an IT request */
  NotItRequest = 'NOT_IT_REQUEST',
  /** Request requires no further governance */
  NoGovernance = 'NO_GOVERNANCE',
  /** Request is ready for Governance Review Board meeting */
  ReadyForGrb = 'READY_FOR_GRB',
  /** Request is ready for Governance Review Team meeting */
  ReadyForGrt = 'READY_FOR_GRT',
  /** Request for shutdown of existing system is complete */
  ShutdownComplete = 'SHUTDOWN_COMPLETE',
  /** Request for shutdown of existing system is in progress */
  ShutdownInProgress = 'SHUTDOWN_IN_PROGRESS',
  /** Request was withdrawn by business owner */
  Withdrawn = 'WITHDRAWN'
}

/** A 508 test instance */
export type TestDate = {
  __typename?: 'TestDate';
  date: Scalars['Time'];
  id: Scalars['UUID'];
  score?: Maybe<Scalars['Int']>;
  testType: TestDateTestType;
};

/** The variety of a 508 test */
export enum TestDateTestType {
  /** Represents an initial 508 test */
  Initial = 'INITIAL',
  /** Represents a remediation test */
  Remediation = 'REMEDIATION'
}



/** Parameters required to update the admin lead for an intake */
export type UpdateSystemIntakeAdminLeadInput = {
  adminLead: Scalars['String'];
  id: Scalars['UUID'];
};

/** Result of UpdateSystemIntake mutations */
export type UpdateSystemIntakePayload = {
  __typename?: 'UpdateSystemIntakePayload';
  systemIntake?: Maybe<SystemIntake>;
  userErrors?: Maybe<Array<UserError>>;
};

/** Parameters required to update the grt and grb dates for an intake */
export type UpdateSystemIntakeReviewDatesInput = {
  grbDate?: Maybe<Scalars['Time']>;
  grtDate?: Maybe<Scalars['Time']>;
  id: Scalars['UUID'];
};

/** Parameters for editing a test date */
export type UpdateTestDateInput = {
  date: Scalars['Time'];
  id: Scalars['UUID'];
  score?: Maybe<Scalars['Int']>;
  testType: TestDateTestType;
};

/** Result of editTestDate */
export type UpdateTestDatePayload = {
  __typename?: 'UpdateTestDatePayload';
  testDate?: Maybe<TestDate>;
  userErrors?: Maybe<Array<UserError>>;
};

/**
 * UserError represents application-level errors that are the result of
 * either user or application developer error.
 */
export type UserError = {
  __typename?: 'UserError';
  message: Scalars['String'];
  path: Array<Scalars['String']>;
};
