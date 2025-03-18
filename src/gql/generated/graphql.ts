import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Email addresses are represented as strings */
  EmailAddress: { input: EmailAddress; output: EmailAddress; }
  /** HTML are represented using as strings,  <p><strong>Notification email</strong></p> */
  HTML: { input: HTML; output: HTML; }
  /** TaggedHTML is represented using strings but can contain Tags (ex: @User) and possibly other richer elements than HTML */
  TaggedHTML: { input: any; output: any; }
  /** Time values are represented as strings using RFC3339 format, for example 2019-10-12T07:20:50.52Z */
  Time: { input: Time; output: Time; }
  /** UUIDs are represented using 36 ASCII characters, for example B0511859-ADE6-4A67-8969-16EC280C0E1A */
  UUID: { input: UUID; output: UUID; }
  /**
   * https://gqlgen.com/reference/file-upload/
   * Represents a multipart file upload
   */
  Upload: { input: Upload; output: Upload; }
};

/** Represents a contact associated with a system intake, including additional fields from CEDAR */
export type AugmentedSystemIntakeContact = {
  __typename: 'AugmentedSystemIntakeContact';
  commonName?: Maybe<Scalars['String']['output']>;
  component: Scalars['String']['output'];
  email?: Maybe<Scalars['EmailAddress']['output']>;
  euaUserId: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  role: Scalars['String']['output'];
  systemIntakeId: Scalars['UUID']['output'];
};

/**
 * A Business Case associated with an system IT governence request; contains
 * equester's justification for their system request
 */
export type BusinessCase = {
  __typename: 'BusinessCase';
  alternativeASolution?: Maybe<BusinessCaseSolution>;
  alternativeBSolution?: Maybe<BusinessCaseSolution>;
  businessNeed?: Maybe<Scalars['String']['output']>;
  businessOwner?: Maybe<Scalars['String']['output']>;
  cmsBenefit?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  currentSolutionSummary?: Maybe<Scalars['String']['output']>;
  euaUserId: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  lifecycleCostLines?: Maybe<Array<EstimatedLifecycleCost>>;
  preferredSolution?: Maybe<BusinessCaseSolution>;
  priorityAlignment?: Maybe<Scalars['String']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  requester?: Maybe<Scalars['String']['output']>;
  requesterPhoneNumber?: Maybe<Scalars['String']['output']>;
  status: BusinessCaseStatus;
  successIndicators?: Maybe<Scalars['String']['output']>;
  systemIntake: SystemIntake;
  updatedAt: Scalars['Time']['output'];
};

/** A solution proposal within a Business Case */
export type BusinessCaseSolution = {
  __typename: 'BusinessCaseSolution';
  acquisitionApproach?: Maybe<Scalars['String']['output']>;
  cons?: Maybe<Scalars['String']['output']>;
  costSavings?: Maybe<Scalars['String']['output']>;
  hasUi?: Maybe<Scalars['String']['output']>;
  hostingCloudServiceType?: Maybe<Scalars['String']['output']>;
  hostingLocation?: Maybe<Scalars['String']['output']>;
  hostingType?: Maybe<Scalars['String']['output']>;
  pros?: Maybe<Scalars['String']['output']>;
  securityIsApproved?: Maybe<Scalars['Boolean']['output']>;
  securityIsBeingReviewed?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** The status of a Business Case associated with an system IT governence request */
export enum BusinessCaseStatus {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN'
}

/** The possible types of assignees for CedarRoles */
export enum CedarAssigneeType {
  ORGANIZATION = 'ORGANIZATION',
  PERSON = 'PERSON'
}

/** CedarAuthorityToOperate represents the response from the /authorityToOperate endpoint from the CEDAR Core API. */
export type CedarAuthorityToOperate = {
  __typename: 'CedarAuthorityToOperate';
  actualDispositionDate?: Maybe<Scalars['Time']['output']>;
  cedarId: Scalars['String']['output'];
  containsPersonallyIdentifiableInformation?: Maybe<Scalars['Boolean']['output']>;
  countOfOpenPoams: Scalars['Int']['output'];
  countOfTotalNonPrivilegedUserPopulation: Scalars['Int']['output'];
  countOfTotalPrivilegedUserPopulation: Scalars['Int']['output'];
  dateAuthorizationMemoExpires?: Maybe<Scalars['Time']['output']>;
  dateAuthorizationMemoSigned?: Maybe<Scalars['Time']['output']>;
  eAuthenticationLevel?: Maybe<Scalars['String']['output']>;
  fips199OverallImpactRating?: Maybe<Scalars['Int']['output']>;
  fismaSystemAcronym?: Maybe<Scalars['String']['output']>;
  fismaSystemName?: Maybe<Scalars['String']['output']>;
  isAccessedByNonOrganizationalUsers?: Maybe<Scalars['Boolean']['output']>;
  isPiiLimitedToUserNameAndPass?: Maybe<Scalars['Boolean']['output']>;
  isProtectedHealthInformation?: Maybe<Scalars['Boolean']['output']>;
  lastActScaDate?: Maybe<Scalars['Time']['output']>;
  lastAssessmentDate?: Maybe<Scalars['Time']['output']>;
  lastContingencyPlanCompletionDate?: Maybe<Scalars['Time']['output']>;
  lastPenTestDate?: Maybe<Scalars['Time']['output']>;
  piaCompletionDate?: Maybe<Scalars['Time']['output']>;
  primaryCyberRiskAdvisor?: Maybe<Scalars['String']['output']>;
  privacySubjectMatterExpert?: Maybe<Scalars['String']['output']>;
  recoveryPointObjective?: Maybe<Scalars['Float']['output']>;
  recoveryTimeObjective?: Maybe<Scalars['Float']['output']>;
  systemOfRecordsNotice: Array<Scalars['String']['output']>;
  tlcPhase?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['String']['output'];
  xlcPhase?: Maybe<Scalars['String']['output']>;
};

/**
 * CedarBudget represents info about the budget associated with a CEDAR object (usually a system); this information is returned from the CEDAR Core API
 * Right now, this does not tie in with any other types defined here, and is a root node until that changes.
 */
export type CedarBudget = {
  __typename: 'CedarBudget';
  fiscalYear?: Maybe<Scalars['String']['output']>;
  funding?: Maybe<Scalars['String']['output']>;
  fundingId?: Maybe<Scalars['String']['output']>;
  fundingSource?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  projectId: Scalars['String']['output'];
  projectTitle?: Maybe<Scalars['String']['output']>;
  systemId?: Maybe<Scalars['String']['output']>;
};

/**
 * CedarBudgetActualCost represents an individual budget actual cost item; this information is returned from the CEDAR Core API
 * as a part of the CedarBudgetSystemCost object
 */
export type CedarBudgetActualCost = {
  __typename: 'CedarBudgetActualCost';
  actualSystemCost?: Maybe<Scalars['String']['output']>;
  fiscalYear?: Maybe<Scalars['String']['output']>;
  systemId?: Maybe<Scalars['String']['output']>;
};

/**
 * CedarBudgetSystemCost represents info about the actual cost associated with a CEDAR object (usually a system); this information is returned from the CEDAR Core API
 * Right now, this does not tie in with any other types defined here, and is a root node until that changes.
 */
export type CedarBudgetSystemCost = {
  __typename: 'CedarBudgetSystemCost';
  budgetActualCost: Array<CedarBudgetActualCost>;
};

/** BusinessOwnerInformation contains information about the Business Owner for a CEDAR system */
export type CedarBusinessOwnerInformation = {
  __typename: 'CedarBusinessOwnerInformation';
  beneficiaryAddressPurpose: Array<Scalars['String']['output']>;
  beneficiaryAddressPurposeOther?: Maybe<Scalars['String']['output']>;
  beneficiaryAddressSource: Array<Scalars['String']['output']>;
  beneficiaryAddressSourceOther?: Maybe<Scalars['String']['output']>;
  beneficiaryInformation: Array<Scalars['String']['output']>;
  costPerYear?: Maybe<Scalars['String']['output']>;
  editBeneficiaryInformation?: Maybe<Scalars['Boolean']['output']>;
  isCmsOwned?: Maybe<Scalars['Boolean']['output']>;
  nr508UserInterface?: Maybe<Scalars['String']['output']>;
  numberOfContractorFte?: Maybe<Scalars['String']['output']>;
  numberOfFederalFte?: Maybe<Scalars['String']['output']>;
  numberOfSupportedUsersPerMonth?: Maybe<Scalars['String']['output']>;
  storesBankingData?: Maybe<Scalars['Boolean']['output']>;
  storesBeneficiaryAddress?: Maybe<Scalars['Boolean']['output']>;
};

export type CedarContract = {
  __typename: 'CedarContract';
  contractName?: Maybe<Scalars['String']['output']>;
  contractNumber?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Time']['output']>;
  isDeliveryOrg?: Maybe<Scalars['Boolean']['output']>;
  orderNumber?: Maybe<Scalars['String']['output']>;
  serviceProvided?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['Time']['output']>;
  systemID?: Maybe<Scalars['String']['output']>;
};

/** CedarDataCenter represents the data center used by a CedarDeployment */
export type CedarDataCenter = {
  __typename: 'CedarDataCenter';
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  addressState?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Time']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['Time']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
  zip?: Maybe<Scalars['String']['output']>;
};

/** CedarDeployment represents a deployment of a system; this information is returned from the CEDAR Core API */
export type CedarDeployment = {
  __typename: 'CedarDeployment';
  contractorName?: Maybe<Scalars['String']['output']>;
  dataCenter?: Maybe<CedarDataCenter>;
  deploymentElementID?: Maybe<Scalars['String']['output']>;
  deploymentType?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Time']['output']>;
  hasProductionData?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isHotSite?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  replicatedSystemElements: Array<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['Time']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  systemID: Scalars['String']['output'];
  systemName?: Maybe<Scalars['String']['output']>;
  systemVersion?: Maybe<Scalars['String']['output']>;
  wanType?: Maybe<Scalars['String']['output']>;
};

/** CedarExchange represents info about how data is exchanged between a CEDAR system and another system */
export type CedarExchange = {
  __typename: 'CedarExchange';
  connectionFrequency: Array<Scalars['String']['output']>;
  containsBankingData?: Maybe<Scalars['Boolean']['output']>;
  containsBeneficiaryAddress?: Maybe<Scalars['Boolean']['output']>;
  containsHealthDisparityData?: Maybe<Scalars['Boolean']['output']>;
  containsPhi?: Maybe<Scalars['Boolean']['output']>;
  containsPii?: Maybe<Scalars['Boolean']['output']>;
  dataExchangeAgreement?: Maybe<Scalars['String']['output']>;
  dataFormat?: Maybe<Scalars['String']['output']>;
  dataFormatOther?: Maybe<Scalars['String']['output']>;
  exchangeDescription?: Maybe<Scalars['String']['output']>;
  exchangeDirection?: Maybe<ExchangeDirection>;
  exchangeEndDate?: Maybe<Scalars['Time']['output']>;
  exchangeId?: Maybe<Scalars['String']['output']>;
  exchangeName?: Maybe<Scalars['String']['output']>;
  exchangeRetiredDate?: Maybe<Scalars['Time']['output']>;
  exchangeStartDate?: Maybe<Scalars['Time']['output']>;
  exchangeState?: Maybe<Scalars['String']['output']>;
  exchangeVersion?: Maybe<Scalars['String']['output']>;
  fromOwnerId?: Maybe<Scalars['String']['output']>;
  fromOwnerName?: Maybe<Scalars['String']['output']>;
  fromOwnerType?: Maybe<Scalars['String']['output']>;
  isBeneficiaryMailingFile?: Maybe<Scalars['Boolean']['output']>;
  numOfRecords?: Maybe<Scalars['String']['output']>;
  sharedViaApi?: Maybe<Scalars['Boolean']['output']>;
  toOwnerId?: Maybe<Scalars['String']['output']>;
  toOwnerName?: Maybe<Scalars['String']['output']>;
  toOwnerType?: Maybe<Scalars['String']['output']>;
  typeOfData: Array<CedarExchangeTypeOfDataItem>;
};

/** CedarExchangeTypeOfDataItem is one item of the TypeofData slice in a CedarExchange */
export type CedarExchangeTypeOfDataItem = {
  __typename: 'CedarExchangeTypeOfDataItem';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** CedarRole represents a role assigned to a person or organization for a system; this information is returned from the CEDAR Core API */
export type CedarRole = {
  __typename: 'CedarRole';
  application: Scalars['String']['output'];
  assigneeDesc?: Maybe<Scalars['String']['output']>;
  assigneeEmail?: Maybe<Scalars['String']['output']>;
  assigneeFirstName?: Maybe<Scalars['String']['output']>;
  assigneeLastName?: Maybe<Scalars['String']['output']>;
  assigneeOrgID?: Maybe<Scalars['String']['output']>;
  assigneeOrgName?: Maybe<Scalars['String']['output']>;
  assigneePhone?: Maybe<Scalars['String']['output']>;
  assigneeType?: Maybe<CedarAssigneeType>;
  assigneeUsername?: Maybe<Scalars['String']['output']>;
  objectID: Scalars['String']['output'];
  objectType?: Maybe<Scalars['String']['output']>;
  roleID?: Maybe<Scalars['String']['output']>;
  roleTypeDesc?: Maybe<Scalars['String']['output']>;
  roleTypeID: Scalars['String']['output'];
  roleTypeName?: Maybe<Scalars['String']['output']>;
};

/** CedarRoleType represents a type of role that a user or organization can hold for some system, i.e. "Business Owner" or "Project Lead" */
export type CedarRoleType = {
  __typename: 'CedarRoleType';
  application: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/**
 * CedarSoftwareProductItem represents an individual software product; this information is returned from the CEDAR Core API
 * as a part of the CedarSoftwareProducts object
 */
export type CedarSoftwareProductItem = {
  __typename: 'CedarSoftwareProductItem';
  apiGatewayUse?: Maybe<Scalars['Boolean']['output']>;
  elaPurchase?: Maybe<Scalars['String']['output']>;
  elaVendorId?: Maybe<Scalars['String']['output']>;
  providesAiCapability?: Maybe<Scalars['Boolean']['output']>;
  refstr?: Maybe<Scalars['String']['output']>;
  softwareCatagoryConnectionGuid?: Maybe<Scalars['String']['output']>;
  softwareCost?: Maybe<Scalars['String']['output']>;
  softwareElaOrganization?: Maybe<Scalars['String']['output']>;
  softwareName?: Maybe<Scalars['String']['output']>;
  softwareVendorConnectionGuid?: Maybe<Scalars['String']['output']>;
  systemSoftwareConnectionGuid?: Maybe<Scalars['String']['output']>;
  technopediaCategory?: Maybe<Scalars['String']['output']>;
  technopediaID?: Maybe<Scalars['String']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
};

/**
 * CedarSoftwareProducts represents the response from the /softwareProducts endpoint from the CEDAR Core API.
 * Right now, this does not tie in with any other types defined here, and is a root node until that changes.
 */
export type CedarSoftwareProducts = {
  __typename: 'CedarSoftwareProducts';
  aiSolnCatg: Array<Maybe<Scalars['String']['output']>>;
  aiSolnCatgOther?: Maybe<Scalars['String']['output']>;
  apiDataArea: Array<Maybe<Scalars['String']['output']>>;
  apiDescPubLocation?: Maybe<Scalars['String']['output']>;
  apiDescPublished?: Maybe<Scalars['String']['output']>;
  apiFHIRUse?: Maybe<Scalars['String']['output']>;
  apiFHIRUseOther?: Maybe<Scalars['String']['output']>;
  apiHasPortal?: Maybe<Scalars['Boolean']['output']>;
  apisAccessibility?: Maybe<Scalars['String']['output']>;
  apisDeveloped?: Maybe<Scalars['String']['output']>;
  developmentStage?: Maybe<Scalars['String']['output']>;
  softwareProducts: Array<CedarSoftwareProductItem>;
  systemHasAPIGateway?: Maybe<Scalars['Boolean']['output']>;
  usesAiTech?: Maybe<Scalars['String']['output']>;
};

/** CedarSubSystem represents the response from the /system/detail */
export type CedarSubSystem = {
  __typename: 'CedarSubSystem';
  acronym?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/**
 * CedarSystem represents the response from the /system/detail endpoint from the CEDAR Core API.
 * Right now, this does not tie in with any other types defined here, and is a root node until that changes.
 */
export type CedarSystem = {
  __typename: 'CedarSystem';
  acronym?: Maybe<Scalars['String']['output']>;
  atoEffectiveDate?: Maybe<Scalars['Time']['output']>;
  atoExpirationDate?: Maybe<Scalars['Time']['output']>;
  businessOwnerOrg?: Maybe<Scalars['String']['output']>;
  businessOwnerOrgComp?: Maybe<Scalars['String']['output']>;
  businessOwnerRoles: Array<CedarRole>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isBookmarked: Scalars['Boolean']['output'];
  linkedSystemIntakes: Array<SystemIntake>;
  linkedTrbRequests: Array<TRBRequest>;
  name: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  systemMaintainerOrg?: Maybe<Scalars['String']['output']>;
  systemMaintainerOrgComp?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
  versionId?: Maybe<Scalars['String']['output']>;
};


/**
 * CedarSystem represents the response from the /system/detail endpoint from the CEDAR Core API.
 * Right now, this does not tie in with any other types defined here, and is a root node until that changes.
 */
export type CedarSystemLinkedSystemIntakesArgs = {
  state?: SystemIntakeState;
};


/**
 * CedarSystem represents the response from the /system/detail endpoint from the CEDAR Core API.
 * Right now, this does not tie in with any other types defined here, and is a root node until that changes.
 */
export type CedarSystemLinkedTrbRequestsArgs = {
  state?: TRBRequestState;
};

/** Represents a user's bookmark of a cedar system */
export type CedarSystemBookmark = {
  __typename: 'CedarSystemBookmark';
  cedarSystemId: Scalars['String']['output'];
  euaUserId: Scalars['String']['output'];
};

/** This is the Representation of Cedar system with additional related information */
export type CedarSystemDetails = {
  __typename: 'CedarSystemDetails';
  atoEffectiveDate?: Maybe<Scalars['Time']['output']>;
  atoExpirationDate?: Maybe<Scalars['Time']['output']>;
  businessOwnerInformation: CedarBusinessOwnerInformation;
  cedarSystem: CedarSystem;
  deployments: Array<CedarDeployment>;
  isMySystem?: Maybe<Scalars['Boolean']['output']>;
  roles: Array<CedarRole>;
  systemMaintainerInformation: CedarSystemMaintainerInformation;
  threats: Array<CedarThreat>;
  urls: Array<CedarURL>;
};

/** SystemMaintainerInformation contains information about the system maintainer of a CEDAR system */
export type CedarSystemMaintainerInformation = {
  __typename: 'CedarSystemMaintainerInformation';
  adHocAgileDeploymentFrequency?: Maybe<Scalars['String']['output']>;
  agileUsed?: Maybe<Scalars['Boolean']['output']>;
  authoritativeDatasource?: Maybe<Scalars['String']['output']>;
  businessArtifactsOnDemand?: Maybe<Scalars['Boolean']['output']>;
  dataAtRestEncryptionKeyManagement?: Maybe<Scalars['String']['output']>;
  deploymentFrequency?: Maybe<Scalars['String']['output']>;
  devCompletionPercent?: Maybe<Scalars['String']['output']>;
  devWorkDescription?: Maybe<Scalars['String']['output']>;
  ecapParticipation?: Maybe<Scalars['Boolean']['output']>;
  frontendAccessType?: Maybe<Scalars['String']['output']>;
  hardCodedIPAddress?: Maybe<Scalars['Boolean']['output']>;
  ip6EnabledAssetPercent?: Maybe<Scalars['String']['output']>;
  ip6TransitionPlan?: Maybe<Scalars['String']['output']>;
  ipEnabledAssetCount?: Maybe<Scalars['Int']['output']>;
  legalHoldCaseName?: Maybe<Scalars['String']['output']>;
  locallyStoredUserInformation?: Maybe<Scalars['Boolean']['output']>;
  majorRefreshDate?: Maybe<Scalars['Time']['output']>;
  multifactorAuthenticationMethod: Array<Scalars['String']['output']>;
  multifactorAuthenticationMethodOther?: Maybe<Scalars['String']['output']>;
  netAccessibility?: Maybe<Scalars['String']['output']>;
  networkTrafficEncryptionKeyManagement?: Maybe<Scalars['String']['output']>;
  noMajorRefresh?: Maybe<Scalars['Boolean']['output']>;
  noPersistentRecordsFlag?: Maybe<Scalars['Boolean']['output']>;
  noPlannedMajorRefresh?: Maybe<Scalars['Boolean']['output']>;
  omDocumentationOnDemand?: Maybe<Scalars['Boolean']['output']>;
  plansToRetireReplace?: Maybe<Scalars['String']['output']>;
  quarterToRetireReplace?: Maybe<Scalars['String']['output']>;
  recordsManagementBucket: Array<Scalars['String']['output']>;
  recordsManagementDisposalLocation?: Maybe<Scalars['String']['output']>;
  recordsManagementDisposalPlan?: Maybe<Scalars['String']['output']>;
  recordsUnderLegalHold?: Maybe<Scalars['Boolean']['output']>;
  sourceCodeOnDemand?: Maybe<Scalars['Boolean']['output']>;
  systemCustomization?: Maybe<Scalars['String']['output']>;
  systemDataLocation: Array<Scalars['String']['output']>;
  systemDataLocationNotes?: Maybe<Scalars['String']['output']>;
  systemDesignOnDemand?: Maybe<Scalars['Boolean']['output']>;
  systemProductionDate?: Maybe<Scalars['Time']['output']>;
  systemRequirementsOnDemand?: Maybe<Scalars['Boolean']['output']>;
  testPlanOnDemand?: Maybe<Scalars['Boolean']['output']>;
  testReportsOnDemand?: Maybe<Scalars['Boolean']['output']>;
  testScriptsOnDemand?: Maybe<Scalars['Boolean']['output']>;
  yearToRetireReplace?: Maybe<Scalars['String']['output']>;
};

/** CedarThreat represents the response from the /threat endpoint from the CEDAR Core API. */
export type CedarThreat = {
  __typename: 'CedarThreat';
  alternativeId?: Maybe<Scalars['String']['output']>;
  controlFamily?: Maybe<Scalars['String']['output']>;
  daysOpen?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  parentId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  weaknessRiskLevel?: Maybe<Scalars['String']['output']>;
};

/** CedarURL represents info about a URL associated with a CEDAR object (usually a system); this information is returned from the CEDAR Core API */
export type CedarURL = {
  __typename: 'CedarURL';
  address?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isAPIEndpoint?: Maybe<Scalars['Boolean']['output']>;
  isBehindWebApplicationFirewall?: Maybe<Scalars['Boolean']['output']>;
  isVersionCodeRepository?: Maybe<Scalars['Boolean']['output']>;
  urlHostingEnv?: Maybe<Scalars['String']['output']>;
};

/** The input needed to close a TRB request */
export type CloseTRBRequestInput = {
  copyTrbMailbox: Scalars['Boolean']['input'];
  id: Scalars['UUID']['input'];
  notifyEuaIds: Array<Scalars['String']['input']>;
  reasonClosed: Scalars['HTML']['input'];
};

/** Represents a date used for start and end dates on a contract */
export type ContractDate = {
  __typename: 'ContractDate';
  day?: Maybe<Scalars['String']['output']>;
  month?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

/** The data needed to bookmark a cedar system */
export type CreateCedarSystemBookmarkInput = {
  cedarSystemId: Scalars['String']['input'];
};

/** The payload when bookmarking a cedar system */
export type CreateCedarSystemBookmarkPayload = {
  __typename: 'CreateCedarSystemBookmarkPayload';
  cedarSystemBookmark?: Maybe<CedarSystemBookmark>;
};

export type CreateGRBReviewerInput = {
  euaUserId: Scalars['String']['input'];
  grbRole: SystemIntakeGRBReviewerRole;
  votingRole: SystemIntakeGRBReviewerVotingRole;
};

/** The data needed to associate a contact with a system intake */
export type CreateSystemIntakeContactInput = {
  component: Scalars['String']['input'];
  euaUserId: Scalars['String']['input'];
  role: Scalars['String']['input'];
  systemIntakeId: Scalars['UUID']['input'];
};

/** The payload when creating a system intake contact */
export type CreateSystemIntakeContactPayload = {
  __typename: 'CreateSystemIntakeContactPayload';
  systemIntakeContact?: Maybe<SystemIntakeContact>;
};

/** The data needed to upload a System Intake document and attach it to a request with metadata */
export type CreateSystemIntakeDocumentInput = {
  documentType: SystemIntakeDocumentCommonType;
  fileData: Scalars['Upload']['input'];
  otherTypeDescription?: InputMaybe<Scalars['String']['input']>;
  requestID: Scalars['UUID']['input'];
  sendNotification?: InputMaybe<Scalars['Boolean']['input']>;
  version: SystemIntakeDocumentVersion;
};

/** Data returned after uploading a document to a System Intake */
export type CreateSystemIntakeDocumentPayload = {
  __typename: 'CreateSystemIntakeDocumentPayload';
  document?: Maybe<SystemIntakeDocument>;
};

export type CreateSystemIntakeGRBReviewersInput = {
  reviewers: Array<CreateGRBReviewerInput>;
  systemIntakeID: Scalars['UUID']['input'];
};

export type CreateSystemIntakeGRBReviewersPayload = {
  __typename: 'CreateSystemIntakeGRBReviewersPayload';
  reviewers: Array<SystemIntakeGRBReviewer>;
};

/** The input data used to initialize an IT governance request for a system */
export type CreateSystemIntakeInput = {
  requestType: SystemIntakeRequestType;
  requester: SystemIntakeRequesterInput;
};

/** Input data for adding a note to a system request */
export type CreateSystemIntakeNoteInput = {
  authorName: Scalars['String']['input'];
  content: Scalars['HTML']['input'];
  intakeId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the Consult Session category */
export type CreateTRBAdminNoteConsultSessionInput = {
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the General Request category */
export type CreateTRBAdminNoteGeneralRequestInput = {
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the Guidance Letter category */
export type CreateTRBAdminNoteGuidanceLetterInput = {
  appliesToMeetingSummary: Scalars['Boolean']['input'];
  appliesToNextSteps: Scalars['Boolean']['input'];
  insightIDs: Array<Scalars['UUID']['input']>;
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the Initial Request Form category */
export type CreateTRBAdminNoteInitialRequestFormInput = {
  appliesToAttendees: Scalars['Boolean']['input'];
  appliesToBasicRequestDetails: Scalars['Boolean']['input'];
  appliesToSubjectAreas: Scalars['Boolean']['input'];
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the Supporting Documents category */
export type CreateTRBAdminNoteSupportingDocumentsInput = {
  documentIDs: Array<Scalars['UUID']['input']>;
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The input required to add an insight & links to a TRB guidance letter */
export type CreateTRBGuidanceLetterInsightInput = {
  category: TRBGuidanceLetterInsightCategory;
  insight: Scalars['HTML']['input'];
  links: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed add a TRB request attendee to a TRB request */
export type CreateTRBRequestAttendeeInput = {
  component: Scalars['String']['input'];
  euaUserId: Scalars['String']['input'];
  role: PersonRole;
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to upload a TRB document and attach it to a request with metadata */
export type CreateTRBRequestDocumentInput = {
  documentType: TRBDocumentCommonType;
  fileData: Scalars['Upload']['input'];
  otherTypeDescription?: InputMaybe<Scalars['String']['input']>;
  requestID: Scalars['UUID']['input'];
};

/** Data returned after uploading a document to a TRB request */
export type CreateTRBRequestDocumentPayload = {
  __typename: 'CreateTRBRequestDocumentPayload';
  document?: Maybe<TRBRequestDocument>;
};

/** The data needed to add feedback to a TRB request */
export type CreateTRBRequestFeedbackInput = {
  action: TRBFeedbackAction;
  copyTrbMailbox: Scalars['Boolean']['input'];
  feedbackMessage: Scalars['HTML']['input'];
  notifyEuaIds: Array<Scalars['String']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** The current user of the application */
export type CurrentUser = {
  __typename: 'CurrentUser';
  launchDarkly: LaunchDarklySettings;
};

/** The payload when deleting a bookmark for a cedar system */
export type DeleteCedarSystemBookmarkPayload = {
  __typename: 'DeleteCedarSystemBookmarkPayload';
  cedarSystemId: Scalars['String']['output'];
};

/** The data needed to delete a system intake contact */
export type DeleteSystemIntakeContactInput = {
  id: Scalars['UUID']['input'];
};

/** The payload when deleting a system intake contact */
export type DeleteSystemIntakeContactPayload = {
  __typename: 'DeleteSystemIntakeContactPayload';
  systemIntakeContact?: Maybe<SystemIntakeContact>;
};

/** Data returned after deleting a document attached to a System Intake */
export type DeleteSystemIntakeDocumentPayload = {
  __typename: 'DeleteSystemIntakeDocumentPayload';
  document?: Maybe<SystemIntakeDocument>;
};

export type DeleteSystemIntakeGRBPresentationLinksInput = {
  systemIntakeID: Scalars['UUID']['input'];
};

export type DeleteSystemIntakeGRBReviewerInput = {
  reviewerID: Scalars['UUID']['input'];
};

/** Data returned after deleting a document attached to a TRB request */
export type DeleteTRBRequestDocumentPayload = {
  __typename: 'DeleteTRBRequestDocumentPayload';
  document?: Maybe<TRBRequestDocument>;
};

export type DeleteTRBRequestFundingSourcesInput = {
  fundingNumber: Scalars['String']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

export type EmailNotificationRecipients = {
  regularRecipientEmails: Array<Scalars['EmailAddress']['input']>;
  shouldNotifyITGovernance: Scalars['Boolean']['input'];
  shouldNotifyITInvestment: Scalars['Boolean']['input'];
};

/**
 * Information related to the estimated costs over one lifecycle phase for a
 * system with a given solution
 */
export type EstimatedLifecycleCost = {
  __typename: 'EstimatedLifecycleCost';
  businessCaseId: Scalars['UUID']['output'];
  cost?: Maybe<Scalars['Int']['output']>;
  id: Scalars['UUID']['output'];
  phase?: Maybe<LifecycleCostPhase>;
  solution?: Maybe<LifecycleCostSolution>;
  year?: Maybe<LifecycleCostYear>;
};

export enum ExchangeDirection {
  RECEIVER = 'RECEIVER',
  SENDER = 'SENDER'
}

/**
 * GRBReviewerComparison represents an individual GRB Reviewer within the context of a
 * comparison operation between two system intakes.
 *
 * For this reason, it is similar to a regular "type GRBReviewer", but has an extra
 * field for "isCurrentReviewer", representing whether or not the specific GRB Reviewer
 * is already on the intake being compared against or not.
 */
export type GRBReviewerComparison = {
  __typename: 'GRBReviewerComparison';
  euaUserId: Scalars['String']['output'];
  grbRole: SystemIntakeGRBReviewerRole;
  id: Scalars['UUID']['output'];
  isCurrentReviewer: Scalars['Boolean']['output'];
  userAccount: UserAccount;
  votingRole: SystemIntakeGRBReviewerVotingRole;
};

/**
 * GRBReviewerComparisonIntake represents a response when searching for System Intakes
 * that have GRB reviewers as compared to another Intake.
 *
 * It's effectively a smaller subset of some of the fields on the entire Intake, plus a special
 * "reviewers" field specific to the comparison operation.
 */
export type GRBReviewerComparisonIntake = {
  __typename: 'GRBReviewerComparisonIntake';
  id: Scalars['UUID']['output'];
  intakeCreatedAt?: Maybe<Scalars['Time']['output']>;
  requestName: Scalars['String']['output'];
  reviewers: Array<GRBReviewerComparison>;
};

/** Feedback given to the requester on a governance request */
export type GovernanceRequestFeedback = {
  __typename: 'GovernanceRequestFeedback';
  author?: Maybe<UserInfo>;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  feedback: Scalars['HTML']['output'];
  id: Scalars['UUID']['output'];
  intakeId: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  sourceAction: GovernanceRequestFeedbackSourceAction;
  targetForm: GovernanceRequestFeedbackTargetForm;
  type: GovernanceRequestFeedbackType;
};

/** Represents the possible actions that can provide feedback on a governance request */
export enum GovernanceRequestFeedbackSourceAction {
  PROGRESS_TO_NEW_STEP = 'PROGRESS_TO_NEW_STEP',
  REQUEST_EDITS = 'REQUEST_EDITS'
}

/** Represents the possible forms on a governance request that can receive feedback */
export enum GovernanceRequestFeedbackTargetForm {
  DRAFT_BUSINESS_CASE = 'DRAFT_BUSINESS_CASE',
  FINAL_BUSINESS_CASE = 'FINAL_BUSINESS_CASE',
  INTAKE_REQUEST = 'INTAKE_REQUEST',
  NO_TARGET_PROVIDED = 'NO_TARGET_PROVIDED'
}

/** Represents the possible types of feedback on governance requests, based on who it's directed to */
export enum GovernanceRequestFeedbackType {
  GRB = 'GRB',
  REQUESTER = 'REQUESTER'
}

/** The requester view of the IT gov Decision step status */
export enum ITGovDecisionStatus {
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The step is completed */
  COMPLETED = 'COMPLETED',
  /** This step is in review */
  IN_REVIEW = 'IN_REVIEW'
}

/** The requester view of the IT gov draft Business Case step status */
export enum ITGovDraftBusinessCaseStatus {
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The draft Business Case has been completed and the intake is on a further step */
  DONE = 'DONE',
  /** This draft Business Case has edits requested */
  EDITS_REQUESTED = 'EDITS_REQUESTED',
  /** The form has started to be filled out */
  IN_PROGRESS = 'IN_PROGRESS',
  /** This step is no longer needed */
  NOT_NEEDED = 'NOT_NEEDED',
  /** Ready to begin filling out */
  READY = 'READY',
  /** The draft Business Case has been submitted and it is waiting for feedback from the governance team */
  SUBMITTED = 'SUBMITTED'
}

/** The requester view of the IT gov feedback step status */
export enum ITGovFeedbackStatus {
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The step is completed */
  COMPLETED = 'COMPLETED',
  /** This step is in review */
  IN_REVIEW = 'IN_REVIEW'
}

/** The requester view of the IT Gov Final Business Case step status */
export enum ITGovFinalBusinessCaseStatus {
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The Business Case has been completed and the intake is on a further step */
  DONE = 'DONE',
  /** This Business Case has edits requested */
  EDITS_REQUESTED = 'EDITS_REQUESTED',
  /** The form has started to be filled out */
  IN_PROGRESS = 'IN_PROGRESS',
  /** This step is not needed and has been skipped */
  NOT_NEEDED = 'NOT_NEEDED',
  /** Ready to begin filling out */
  READY = 'READY',
  /** The Business Case has been submitted and it is waiting for feedback from the governance team */
  SUBMITTED = 'SUBMITTED'
}

/** The requester view of the IT Gov GRB step status */
export enum ITGovGRBStatus {
  /** The GRT meeting has already happened, and an outcome hasn't been noted yet */
  AWAITING_DECISION = 'AWAITING_DECISION',
  /** The GRB meeting is waiting for review */
  AWAITING_GRB_REVIEW = 'AWAITING_GRB_REVIEW',
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The step is completed */
  COMPLETED = 'COMPLETED',
  /** This step is not needed and has been skipped */
  NOT_NEEDED = 'NOT_NEEDED',
  /** The GRB meeting is waiting to be scheduled */
  READY_TO_SCHEDULE = 'READY_TO_SCHEDULE',
  /** The GRB review is currently in progress */
  REVIEW_IN_PROGRESS = 'REVIEW_IN_PROGRESS',
  /** The GRB meeting has been scheduled */
  SCHEDULED = 'SCHEDULED'
}

/** The requester view of the IT Gov GRT step status */
export enum ITGovGRTStatus {
  /** The GRT meeting has already happened, and an outcome hasn't been noted yet */
  AWAITING_DECISION = 'AWAITING_DECISION',
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The step is completed */
  COMPLETED = 'COMPLETED',
  /** This step is not needed and has been skipped */
  NOT_NEEDED = 'NOT_NEEDED',
  /** The GRT meeting is waiting to be scheduled */
  READY_TO_SCHEDULE = 'READY_TO_SCHEDULE',
  /** The GRT meeting has been scheduled */
  SCHEDULED = 'SCHEDULED'
}

/** The requester view of the IT gov intake step status */
export enum ITGovIntakeFormStatus {
  /** The Form is completed */
  COMPLETED = 'COMPLETED',
  /** The form has edits requested */
  EDITS_REQUESTED = 'EDITS_REQUESTED',
  /** The form has started to be filled out */
  IN_PROGRESS = 'IN_PROGRESS',
  /** Ready to begin filling out */
  READY = 'READY'
}

/** The statuses of the different steps in the IT Gov v2 workflow */
export type ITGovTaskStatuses = {
  __typename: 'ITGovTaskStatuses';
  bizCaseDraftStatus: ITGovDraftBusinessCaseStatus;
  bizCaseFinalStatus: ITGovFinalBusinessCaseStatus;
  decisionAndNextStepsStatus: ITGovDecisionStatus;
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus;
  grbMeetingStatus: ITGovGRBStatus;
  grtMeetingStatus: ITGovGRTStatus;
  intakeFormStatus: ITGovIntakeFormStatus;
};

/** The current user's Launch Darkly key */
export type LaunchDarklySettings = {
  __typename: 'LaunchDarklySettings';
  signedHash: Scalars['String']['output'];
  userKey: Scalars['String']['output'];
};

/** The cost phase of a */
export enum LifecycleCostPhase {
  DEVELOPMENT = 'DEVELOPMENT',
  OPERATIONS_AND_MAINTENANCE = 'OPERATIONS_AND_MAINTENANCE',
  OTHER = 'OTHER'
}

/** The type of a lifecycle cost solution, part of a Business Case */
export enum LifecycleCostSolution {
  A = 'A',
  B = 'B',
  PREFERRED = 'PREFERRED'
}

/** Represents a lifecycle cost phase */
export enum LifecycleCostYear {
  LIFECYCLE_COST_YEAR_1 = 'LIFECYCLE_COST_YEAR_1',
  LIFECYCLE_COST_YEAR_2 = 'LIFECYCLE_COST_YEAR_2',
  LIFECYCLE_COST_YEAR_3 = 'LIFECYCLE_COST_YEAR_3',
  LIFECYCLE_COST_YEAR_4 = 'LIFECYCLE_COST_YEAR_4',
  LIFECYCLE_COST_YEAR_5 = 'LIFECYCLE_COST_YEAR_5'
}

/** Defines the mutations for the schema */
export type Mutation = {
  __typename: 'Mutation';
  archiveSystemIntake: SystemIntake;
  closeTRBRequest: TRBRequest;
  createCedarSystemBookmark?: Maybe<CreateCedarSystemBookmarkPayload>;
  createSystemIntake?: Maybe<SystemIntake>;
  createSystemIntakeActionChangeLCIDRetirementDate?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionCloseRequest?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionConfirmLCID?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionExpireLCID?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionIssueLCID?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionNotITGovRequest?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionProgressToNewStep?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionRejectIntake?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionReopenRequest?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionRequestEdits?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionRetireLCID?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionUnretireLCID?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeActionUpdateLCID?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeContact?: Maybe<CreateSystemIntakeContactPayload>;
  createSystemIntakeDocument?: Maybe<CreateSystemIntakeDocumentPayload>;
  createSystemIntakeGRBDiscussionPost?: Maybe<SystemIntakeGRBReviewDiscussionPost>;
  createSystemIntakeGRBDiscussionReply?: Maybe<SystemIntakeGRBReviewDiscussionPost>;
  createSystemIntakeGRBReviewers?: Maybe<CreateSystemIntakeGRBReviewersPayload>;
  createSystemIntakeNote?: Maybe<SystemIntakeNote>;
  createTRBAdminNoteConsultSession: TRBAdminNote;
  createTRBAdminNoteGeneralRequest: TRBAdminNote;
  createTRBAdminNoteGuidanceLetter: TRBAdminNote;
  createTRBAdminNoteInitialRequestForm: TRBAdminNote;
  createTRBAdminNoteSupportingDocuments: TRBAdminNote;
  createTRBGuidanceLetter: TRBGuidanceLetter;
  createTRBGuidanceLetterInsight: TRBGuidanceLetterInsight;
  createTRBRequest: TRBRequest;
  createTRBRequestAttendee: TRBRequestAttendee;
  createTRBRequestDocument?: Maybe<CreateTRBRequestDocumentPayload>;
  createTRBRequestFeedback: TRBRequestFeedback;
  createTrbLeadOption: UserInfo;
  deleteCedarSystemBookmark?: Maybe<DeleteCedarSystemBookmarkPayload>;
  deleteSystemIntakeContact?: Maybe<DeleteSystemIntakeContactPayload>;
  deleteSystemIntakeDocument?: Maybe<DeleteSystemIntakeDocumentPayload>;
  deleteSystemIntakeGRBPresentationLinks: Scalars['UUID']['output'];
  deleteSystemIntakeGRBReviewer: Scalars['UUID']['output'];
  deleteTRBGuidanceLetterInsight: TRBGuidanceLetterInsight;
  deleteTRBRequestAttendee: TRBRequestAttendee;
  deleteTRBRequestDocument?: Maybe<DeleteTRBRequestDocumentPayload>;
  deleteTRBRequestFundingSources: Array<TRBFundingSource>;
  deleteTrbLeadOption: Scalars['Boolean']['output'];
  reopenTrbRequest: TRBRequest;
  requestReviewForTRBGuidanceLetter: TRBGuidanceLetter;
  sendCantFindSomethingEmail?: Maybe<Scalars['String']['output']>;
  sendFeedbackEmail?: Maybe<Scalars['String']['output']>;
  sendGRBReviewPresentationDeckReminderEmail: Scalars['Boolean']['output'];
  sendReportAProblemEmail?: Maybe<Scalars['String']['output']>;
  sendTRBGuidanceLetter: TRBGuidanceLetter;
  setRolesForUserOnSystem?: Maybe<Scalars['String']['output']>;
  setSystemIntakeGRBPresentationLinks?: Maybe<SystemIntakeGRBPresentationLinks>;
  setSystemIntakeRelationExistingService?: Maybe<UpdateSystemIntakePayload>;
  setSystemIntakeRelationExistingSystem?: Maybe<UpdateSystemIntakePayload>;
  setSystemIntakeRelationNewSystem?: Maybe<UpdateSystemIntakePayload>;
  setTRBAdminNoteArchived: TRBAdminNote;
  setTRBRequestRelationExistingService?: Maybe<TRBRequest>;
  setTRBRequestRelationExistingSystem?: Maybe<TRBRequest>;
  setTRBRequestRelationNewSystem?: Maybe<TRBRequest>;
  startGRBReview?: Maybe<Scalars['String']['output']>;
  submitIntake?: Maybe<UpdateSystemIntakePayload>;
  unlinkSystemIntakeRelation?: Maybe<UpdateSystemIntakePayload>;
  unlinkTRBRequestRelation?: Maybe<TRBRequest>;
  updateSystemIntakeAdminLead?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeContact?: Maybe<CreateSystemIntakeContactPayload>;
  updateSystemIntakeContactDetails?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeContractDetails?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeGRBReviewFormPresentationAsync?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeGRBReviewFormPresentationStandard?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeGRBReviewFormTimeframeAsync?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeGRBReviewType?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeGRBReviewer: SystemIntakeGRBReviewer;
  updateSystemIntakeLinkedCedarSystem?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeNote: SystemIntakeNote;
  updateSystemIntakeRequestDetails?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeRequestType: SystemIntake;
  updateSystemIntakeReviewDates?: Maybe<UpdateSystemIntakePayload>;
  updateTRBGuidanceLetter: TRBGuidanceLetter;
  updateTRBGuidanceLetterInsight: TRBGuidanceLetterInsight;
  updateTRBGuidanceLetterInsightOrder: Array<TRBGuidanceLetterInsight>;
  updateTRBRequest: TRBRequest;
  updateTRBRequestAttendee: TRBRequestAttendee;
  updateTRBRequestConsultMeetingTime: TRBRequest;
  updateTRBRequestForm: TRBRequestForm;
  updateTRBRequestFundingSources: Array<TRBFundingSource>;
  updateTRBRequestTRBLead: TRBRequest;
  uploadSystemIntakeGRBPresentationDeck?: Maybe<SystemIntakeGRBPresentationLinks>;
};


/** Defines the mutations for the schema */
export type MutationArchiveSystemIntakeArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationCloseTRBRequestArgs = {
  input: CloseTRBRequestInput;
};


/** Defines the mutations for the schema */
export type MutationCreateCedarSystemBookmarkArgs = {
  input: CreateCedarSystemBookmarkInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeArgs = {
  input: CreateSystemIntakeInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionChangeLCIDRetirementDateArgs = {
  input: SystemIntakeChangeLCIDRetirementDateInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionCloseRequestArgs = {
  input: SystemIntakeCloseRequestInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionConfirmLCIDArgs = {
  input: SystemIntakeConfirmLCIDInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionExpireLCIDArgs = {
  input: SystemIntakeExpireLCIDInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionIssueLCIDArgs = {
  input: SystemIntakeIssueLCIDInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionNotITGovRequestArgs = {
  input: SystemIntakeNotITGovReqInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionProgressToNewStepArgs = {
  input: SystemIntakeProgressToNewStepsInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionRejectIntakeArgs = {
  input: SystemIntakeRejectIntakeInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionReopenRequestArgs = {
  input: SystemIntakeReopenRequestInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionRequestEditsArgs = {
  input: SystemIntakeRequestEditsInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionRetireLCIDArgs = {
  input: SystemIntakeRetireLCIDInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionUnretireLCIDArgs = {
  input: SystemIntakeUnretireLCIDInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionUpdateLCIDArgs = {
  input: SystemIntakeUpdateLCIDInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeContactArgs = {
  input: CreateSystemIntakeContactInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeDocumentArgs = {
  input: CreateSystemIntakeDocumentInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeGRBDiscussionPostArgs = {
  input: CreateSystemIntakeGRBDiscussionPostInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeGRBDiscussionReplyArgs = {
  input: CreateSystemIntakeGRBDiscussionReplyInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeGRBReviewersArgs = {
  input: CreateSystemIntakeGRBReviewersInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeNoteArgs = {
  input: CreateSystemIntakeNoteInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBAdminNoteConsultSessionArgs = {
  input: CreateTRBAdminNoteConsultSessionInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBAdminNoteGeneralRequestArgs = {
  input: CreateTRBAdminNoteGeneralRequestInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBAdminNoteGuidanceLetterArgs = {
  input: CreateTRBAdminNoteGuidanceLetterInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBAdminNoteInitialRequestFormArgs = {
  input: CreateTRBAdminNoteInitialRequestFormInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBAdminNoteSupportingDocumentsArgs = {
  input: CreateTRBAdminNoteSupportingDocumentsInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBGuidanceLetterArgs = {
  trbRequestId: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationCreateTRBGuidanceLetterInsightArgs = {
  input: CreateTRBGuidanceLetterInsightInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBRequestArgs = {
  requestType: TRBRequestType;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBRequestAttendeeArgs = {
  input: CreateTRBRequestAttendeeInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBRequestDocumentArgs = {
  input: CreateTRBRequestDocumentInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBRequestFeedbackArgs = {
  input: CreateTRBRequestFeedbackInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbLeadOptionArgs = {
  eua: Scalars['String']['input'];
};


/** Defines the mutations for the schema */
export type MutationDeleteCedarSystemBookmarkArgs = {
  input: CreateCedarSystemBookmarkInput;
};


/** Defines the mutations for the schema */
export type MutationDeleteSystemIntakeContactArgs = {
  input: DeleteSystemIntakeContactInput;
};


/** Defines the mutations for the schema */
export type MutationDeleteSystemIntakeDocumentArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationDeleteSystemIntakeGRBPresentationLinksArgs = {
  input: DeleteSystemIntakeGRBPresentationLinksInput;
};


/** Defines the mutations for the schema */
export type MutationDeleteSystemIntakeGRBReviewerArgs = {
  input: DeleteSystemIntakeGRBReviewerInput;
};


/** Defines the mutations for the schema */
export type MutationDeleteTRBGuidanceLetterInsightArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationDeleteTRBRequestAttendeeArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationDeleteTRBRequestDocumentArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationDeleteTRBRequestFundingSourcesArgs = {
  input: DeleteTRBRequestFundingSourcesInput;
};


/** Defines the mutations for the schema */
export type MutationDeleteTrbLeadOptionArgs = {
  eua: Scalars['String']['input'];
};


/** Defines the mutations for the schema */
export type MutationReopenTrbRequestArgs = {
  input: ReopenTRBRequestInput;
};


/** Defines the mutations for the schema */
export type MutationRequestReviewForTRBGuidanceLetterArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationSendCantFindSomethingEmailArgs = {
  input: SendCantFindSomethingEmailInput;
};


/** Defines the mutations for the schema */
export type MutationSendFeedbackEmailArgs = {
  input: SendFeedbackEmailInput;
};


/** Defines the mutations for the schema */
export type MutationSendGRBReviewPresentationDeckReminderEmailArgs = {
  systemIntakeID: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationSendReportAProblemEmailArgs = {
  input: SendReportAProblemEmailInput;
};


/** Defines the mutations for the schema */
export type MutationSendTRBGuidanceLetterArgs = {
  input: SendTRBGuidanceLetterInput;
};


/** Defines the mutations for the schema */
export type MutationSetRolesForUserOnSystemArgs = {
  input: SetRolesForUserOnSystemInput;
};


/** Defines the mutations for the schema */
export type MutationSetSystemIntakeGRBPresentationLinksArgs = {
  input: SystemIntakeGRBPresentationLinksInput;
};


/** Defines the mutations for the schema */
export type MutationSetSystemIntakeRelationExistingServiceArgs = {
  input?: InputMaybe<SetSystemIntakeRelationExistingServiceInput>;
};


/** Defines the mutations for the schema */
export type MutationSetSystemIntakeRelationExistingSystemArgs = {
  input?: InputMaybe<SetSystemIntakeRelationExistingSystemInput>;
};


/** Defines the mutations for the schema */
export type MutationSetSystemIntakeRelationNewSystemArgs = {
  input?: InputMaybe<SetSystemIntakeRelationNewSystemInput>;
};


/** Defines the mutations for the schema */
export type MutationSetTRBAdminNoteArchivedArgs = {
  id: Scalars['UUID']['input'];
  isArchived: Scalars['Boolean']['input'];
};


/** Defines the mutations for the schema */
export type MutationSetTRBRequestRelationExistingServiceArgs = {
  input: SetTRBRequestRelationExistingServiceInput;
};


/** Defines the mutations for the schema */
export type MutationSetTRBRequestRelationExistingSystemArgs = {
  input: SetTRBRequestRelationExistingSystemInput;
};


/** Defines the mutations for the schema */
export type MutationSetTRBRequestRelationNewSystemArgs = {
  input: SetTRBRequestRelationNewSystemInput;
};


/** Defines the mutations for the schema */
export type MutationStartGRBReviewArgs = {
  input: StartGRBReviewInput;
};


/** Defines the mutations for the schema */
export type MutationSubmitIntakeArgs = {
  input: SubmitIntakeInput;
};


/** Defines the mutations for the schema */
export type MutationUnlinkSystemIntakeRelationArgs = {
  intakeID: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationUnlinkTRBRequestRelationArgs = {
  trbRequestID: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeAdminLeadArgs = {
  input: UpdateSystemIntakeAdminLeadInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeContactArgs = {
  input: UpdateSystemIntakeContactInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeContactDetailsArgs = {
  input: UpdateSystemIntakeContactDetailsInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeContractDetailsArgs = {
  input: UpdateSystemIntakeContractDetailsInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeGRBReviewFormPresentationAsyncArgs = {
  input: UpdateSystemIntakeGRBReviewFormInputPresentationAsync;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeGRBReviewFormPresentationStandardArgs = {
  input: UpdateSystemIntakeGRBReviewFormInputPresentationStandard;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeGRBReviewFormTimeframeAsyncArgs = {
  input: UpdateSystemIntakeGRBReviewFormInputTimeframeAsync;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeGRBReviewTypeArgs = {
  input: UpdateSystemIntakeGRBReviewTypeInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeGRBReviewerArgs = {
  input: UpdateSystemIntakeGRBReviewerInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeLinkedCedarSystemArgs = {
  input: UpdateSystemIntakeLinkedCedarSystemInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeNoteArgs = {
  input: UpdateSystemIntakeNoteInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeRequestDetailsArgs = {
  input: UpdateSystemIntakeRequestDetailsInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeRequestTypeArgs = {
  id: Scalars['UUID']['input'];
  newType: SystemIntakeRequestType;
};


/** Defines the mutations for the schema */
export type MutationUpdateSystemIntakeReviewDatesArgs = {
  input: UpdateSystemIntakeReviewDatesInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBGuidanceLetterArgs = {
  input: UpdateTRBGuidanceLetterInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBGuidanceLetterInsightArgs = {
  input: UpdateTRBGuidanceLetterInsightInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBGuidanceLetterInsightOrderArgs = {
  input: UpdateTRBGuidanceLetterInsightOrderInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBRequestArgs = {
  changes?: InputMaybe<TRBRequestChanges>;
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBRequestAttendeeArgs = {
  input: UpdateTRBRequestAttendeeInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBRequestConsultMeetingTimeArgs = {
  input: UpdateTRBRequestConsultMeetingTimeInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBRequestFormArgs = {
  input: UpdateTRBRequestFormInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBRequestFundingSourcesArgs = {
  input: UpdateTRBRequestFundingSourcesInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBRequestTRBLeadArgs = {
  input: UpdateTRBRequestTRBLeadInput;
};


/** Defines the mutations for the schema */
export type MutationUploadSystemIntakeGRBPresentationDeckArgs = {
  input: UploadSystemIntakeGRBPresentationDeckInput;
};

/** PersonRole is an enumeration of values for a person's role */
export enum PersonRole {
  BUSINESS_OWNER = 'BUSINESS_OWNER',
  CLOUD_NAVIGATOR = 'CLOUD_NAVIGATOR',
  CONTRACT_OFFICE_RSREPRESENTATIVE = 'CONTRACT_OFFICE_RSREPRESENTATIVE',
  CRA = 'CRA',
  INFORMATION_SYSTEM_SECURITY_ADVISOR = 'INFORMATION_SYSTEM_SECURITY_ADVISOR',
  OTHER = 'OTHER',
  PRIVACY_ADVISOR = 'PRIVACY_ADVISOR',
  PRODUCT_OWNER = 'PRODUCT_OWNER',
  SYSTEM_MAINTAINER = 'SYSTEM_MAINTAINER',
  SYSTEM_OWNER = 'SYSTEM_OWNER'
}

/** Query definition for the schema */
export type Query = {
  __typename: 'Query';
  cedarAuthorityToOperate: Array<CedarAuthorityToOperate>;
  cedarBudget?: Maybe<Array<CedarBudget>>;
  cedarBudgetSystemCost?: Maybe<CedarBudgetSystemCost>;
  cedarContractsBySystem: Array<CedarContract>;
  cedarPersonsByCommonName: Array<UserInfo>;
  cedarSoftwareProducts?: Maybe<CedarSoftwareProducts>;
  cedarSubSystems: Array<CedarSubSystem>;
  cedarSystem?: Maybe<CedarSystem>;
  cedarSystemBookmarks: Array<CedarSystemBookmark>;
  cedarSystemDetails?: Maybe<CedarSystemDetails>;
  cedarSystems: Array<CedarSystem>;
  cedarThreat: Array<CedarThreat>;
  compareGRBReviewersByIntakeID: Array<GRBReviewerComparisonIntake>;
  currentUser?: Maybe<CurrentUser>;
  deployments: Array<CedarDeployment>;
  exchanges: Array<CedarExchange>;
  myCedarSystems: Array<CedarSystem>;
  mySystemIntakes: Array<SystemIntake>;
  myTrbRequests: Array<TRBRequest>;
  roleTypes: Array<CedarRoleType>;
  roles: Array<CedarRole>;
  /**
   * Requests fetches a requester's own Intake Requests
   * first is currently non-functional and can be removed later
   */
  systemIntake?: Maybe<SystemIntake>;
  systemIntakeContacts: SystemIntakeContactsPayload;
  systemIntakes: Array<SystemIntake>;
  systemIntakesWithLcids: Array<SystemIntake>;
  systemIntakesWithReviewRequested: Array<SystemIntake>;
  trbAdminNote: TRBAdminNote;
  trbLeadOptions: Array<UserInfo>;
  trbRequest: TRBRequest;
  trbRequests: Array<TRBRequest>;
  urls: Array<CedarURL>;
  userAccount?: Maybe<UserAccount>;
};


/** Query definition for the schema */
export type QueryCedarAuthorityToOperateArgs = {
  cedarSystemID: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarBudgetArgs = {
  cedarSystemID: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarBudgetSystemCostArgs = {
  cedarSystemID: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarContractsBySystemArgs = {
  cedarSystemId: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarPersonsByCommonNameArgs = {
  commonName: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarSoftwareProductsArgs = {
  cedarSystemId: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarSubSystemsArgs = {
  cedarSystemId: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarSystemArgs = {
  cedarSystemId: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarSystemDetailsArgs = {
  cedarSystemId: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCedarThreatArgs = {
  cedarSystemId: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCompareGRBReviewersByIntakeIDArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryDeploymentsArgs = {
  cedarSystemId: Scalars['String']['input'];
  deploymentType?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query definition for the schema */
export type QueryExchangesArgs = {
  cedarSystemId: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryMyTrbRequestsArgs = {
  archived?: Scalars['Boolean']['input'];
};


/** Query definition for the schema */
export type QueryRolesArgs = {
  cedarSystemId: Scalars['String']['input'];
  roleTypeID?: InputMaybe<Scalars['String']['input']>;
};


/** Query definition for the schema */
export type QuerySystemIntakeArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QuerySystemIntakeContactsArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QuerySystemIntakesArgs = {
  openRequests: Scalars['Boolean']['input'];
};


/** Query definition for the schema */
export type QueryTrbAdminNoteArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryTrbRequestArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryTrbRequestsArgs = {
  archived?: Scalars['Boolean']['input'];
};


/** Query definition for the schema */
export type QueryUrlsArgs = {
  cedarSystemId: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryUserAccountArgs = {
  username: Scalars['String']['input'];
};

/** The data needed to reopen a TRB request */
export type ReopenTRBRequestInput = {
  copyTrbMailbox: Scalars['Boolean']['input'];
  notifyEuaIds: Array<Scalars['String']['input']>;
  reasonReopened: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

export enum RequestRelationType {
  EXISTING_SERVICE = 'EXISTING_SERVICE',
  EXISTING_SYSTEM = 'EXISTING_SYSTEM',
  NEW_SYSTEM = 'NEW_SYSTEM'
}

/** A user role associated with a job code */
export enum Role {
  /** An admin on the GRT */
  EASI_GOVTEAM = 'EASI_GOVTEAM',
  /** An admin on the TRB */
  EASI_TRB_ADMIN = 'EASI_TRB_ADMIN',
  /** A generic EASi user */
  EASI_USER = 'EASI_USER'
}

export type SendCantFindSomethingEmailInput = {
  body: Scalars['String']['input'];
};

/** The inputs to the user feedback form */
export type SendFeedbackEmailInput = {
  canBeContacted: Scalars['Boolean']['input'];
  cmsRole: Scalars['String']['input'];
  didntNeedHelpAnswering: Scalars['String']['input'];
  easiServicesUsed: Array<Scalars['String']['input']>;
  hadAccessToInformation: Scalars['String']['input'];
  howCanWeImprove: Scalars['String']['input'];
  howSatisfied: Scalars['String']['input'];
  isAnonymous: Scalars['Boolean']['input'];
  questionsWereRelevant: Scalars['String']['input'];
  systemEasyToUse: Scalars['String']['input'];
};

export type SendReportAProblemEmailInput = {
  canBeContacted: Scalars['Boolean']['input'];
  easiService: Scalars['String']['input'];
  howSevereWasTheProblem: Scalars['String']['input'];
  isAnonymous: Scalars['Boolean']['input'];
  whatWentWrong: Scalars['String']['input'];
  whatWereYouDoing: Scalars['String']['input'];
};

/** The data needed to send a TRB guidance letter, including who to notify */
export type SendTRBGuidanceLetterInput = {
  copyTrbMailbox: Scalars['Boolean']['input'];
  id: Scalars['UUID']['input'];
  notifyEuaIds: Array<Scalars['String']['input']>;
};

export type SetRolesForUserOnSystemInput = {
  cedarSystemID: Scalars['String']['input'];
  desiredRoleTypeIDs: Array<Scalars['String']['input']>;
  euaUserId: Scalars['String']['input'];
};

export type SetSystemIntakeRelationExistingServiceInput = {
  contractName: Scalars['String']['input'];
  contractNumbers: Array<Scalars['String']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

export type SetSystemIntakeRelationExistingSystemInput = {
  cedarSystemIDs: Array<Scalars['String']['input']>;
  contractNumbers: Array<Scalars['String']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

export type SetSystemIntakeRelationNewSystemInput = {
  contractNumbers: Array<Scalars['String']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

export type SetTRBRequestRelationExistingServiceInput = {
  contractName: Scalars['String']['input'];
  contractNumbers: Array<Scalars['String']['input']>;
  trbRequestID: Scalars['UUID']['input'];
};

export type SetTRBRequestRelationExistingSystemInput = {
  cedarSystemIDs: Array<Scalars['String']['input']>;
  contractNumbers: Array<Scalars['String']['input']>;
  trbRequestID: Scalars['UUID']['input'];
};

export type SetTRBRequestRelationNewSystemInput = {
  contractNumbers: Array<Scalars['String']['input']>;
  trbRequestID: Scalars['UUID']['input'];
};

/** Input for starting a GRB Review, which notifies reviewers by email */
export type StartGRBReviewInput = {
  systemIntakeID: Scalars['UUID']['input'];
};

/** Input to submit an intake for review */
export type SubmitIntakeInput = {
  id: Scalars['UUID']['input'];
};

/** Represents an IT governance request for a system */
export type SystemIntake = {
  __typename: 'SystemIntake';
  acquisitionMethods: Array<SystemIntakeSoftwareAcquisitionMethods>;
  actions: Array<SystemIntakeAction>;
  adminLead?: Maybe<Scalars['String']['output']>;
  annualSpending?: Maybe<SystemIntakeAnnualSpending>;
  archivedAt?: Maybe<Scalars['Time']['output']>;
  businessCase?: Maybe<BusinessCase>;
  businessCaseId?: Maybe<Scalars['UUID']['output']>;
  businessNeed?: Maybe<Scalars['String']['output']>;
  businessOwner: SystemIntakeBusinessOwner;
  businessSolution?: Maybe<Scalars['String']['output']>;
  cedarSystemId?: Maybe<Scalars['String']['output']>;
  contract: SystemIntakeContract;
  contractName?: Maybe<Scalars['String']['output']>;
  /** Linked contract numbers */
  contractNumbers: Array<SystemIntakeContractNumber>;
  costs?: Maybe<SystemIntakeCosts>;
  createdAt?: Maybe<Scalars['Time']['output']>;
  currentStage?: Maybe<Scalars['String']['output']>;
  decidedAt?: Maybe<Scalars['Time']['output']>;
  decisionNextSteps?: Maybe<Scalars['HTML']['output']>;
  decisionState: SystemIntakeDecisionState;
  documents: Array<SystemIntakeDocument>;
  draftBusinessCaseState: SystemIntakeFormState;
  eaCollaborator?: Maybe<Scalars['String']['output']>;
  eaCollaboratorName?: Maybe<Scalars['String']['output']>;
  euaUserId?: Maybe<Scalars['String']['output']>;
  existingFunding?: Maybe<Scalars['Boolean']['output']>;
  finalBusinessCaseState: SystemIntakeFormState;
  fundingSources: Array<SystemIntakeFundingSource>;
  governanceRequestFeedbacks: Array<GovernanceRequestFeedback>;
  governanceTeams: SystemIntakeGovernanceTeam;
  grbDate?: Maybe<Scalars['Time']['output']>;
  /** GRB Review Discussion Posts/Threads */
  grbDiscussions: Array<SystemIntakeGRBReviewDiscussion>;
  /** This is a calculated state based on if a date exists for the GRB Meeting date */
  grbMeetingState: SystemIntakeMeetingState;
  /** GRB Presentation Deck Metadata */
  grbPresentationDeckRequesterReminderEmailSentTime?: Maybe<Scalars['Time']['output']>;
  /** GRB Presentation Link Data */
  grbPresentationLinks?: Maybe<SystemIntakeGRBPresentationLinks>;
  grbReviewAsyncEndDate?: Maybe<Scalars['Time']['output']>;
  grbReviewAsyncGRBMeetingTime?: Maybe<Scalars['Time']['output']>;
  grbReviewAsyncRecordingTime?: Maybe<Scalars['Time']['output']>;
  grbReviewStartedAt?: Maybe<Scalars['Time']['output']>;
  /** GRB Review Form */
  grbReviewType: SystemIntakeGRBReviewType;
  grbReviewers: Array<SystemIntakeGRBReviewer>;
  grtDate?: Maybe<Scalars['Time']['output']>;
  /** This is a calculated state based on if a date exists for the GRT Meeting date */
  grtMeetingState: SystemIntakeMeetingState;
  grtReviewEmailBody?: Maybe<Scalars['String']['output']>;
  hasUiChanges?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['UUID']['output'];
  isso: SystemIntakeISSO;
  itGovTaskStatuses: ITGovTaskStatuses;
  lastMeetingDate?: Maybe<Scalars['Time']['output']>;
  lcid?: Maybe<Scalars['String']['output']>;
  lcidCostBaseline?: Maybe<Scalars['String']['output']>;
  lcidExpiresAt?: Maybe<Scalars['Time']['output']>;
  lcidIssuedAt?: Maybe<Scalars['Time']['output']>;
  lcidRetiresAt?: Maybe<Scalars['Time']['output']>;
  lcidScope?: Maybe<Scalars['HTML']['output']>;
  /** Intentionally nullable - lcidStatus is null if (and only if) the intake doesn't have an LCID issued */
  lcidStatus?: Maybe<SystemIntakeLCIDStatus>;
  needsEaSupport?: Maybe<Scalars['Boolean']['output']>;
  nextMeetingDate?: Maybe<Scalars['Time']['output']>;
  notes: Array<SystemIntakeNote>;
  oitSecurityCollaborator?: Maybe<Scalars['String']['output']>;
  oitSecurityCollaboratorName?: Maybe<Scalars['String']['output']>;
  productManager: SystemIntakeProductManager;
  projectAcronym?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['HTML']['output']>;
  /** Other System Intakes that share a CEDAR System or Contract Number */
  relatedIntakes: Array<SystemIntake>;
  /** TRB Requests that share a CEDAR System or Contract Number */
  relatedTRBRequests: Array<TRBRequest>;
  relationType?: Maybe<RequestRelationType>;
  requestFormState: SystemIntakeFormState;
  requestName?: Maybe<Scalars['String']['output']>;
  requestType: SystemIntakeRequestType;
  requester: SystemIntakeRequester;
  requesterComponent?: Maybe<Scalars['String']['output']>;
  requesterName?: Maybe<Scalars['String']['output']>;
  state: SystemIntakeState;
  statusAdmin: SystemIntakeStatusAdmin;
  statusRequester: SystemIntakeStatusRequester;
  step: SystemIntakeStep;
  submittedAt?: Maybe<Scalars['Time']['output']>;
  /** Linked systems */
  systems: Array<CedarSystem>;
  trbCollaborator?: Maybe<Scalars['String']['output']>;
  trbCollaboratorName?: Maybe<Scalars['String']['output']>;
  trbFollowUpRecommendation?: Maybe<SystemIntakeTRBFollowUp>;
  updatedAt?: Maybe<Scalars['Time']['output']>;
  usesAiTech?: Maybe<Scalars['Boolean']['output']>;
  usingSoftware?: Maybe<Scalars['String']['output']>;
};

/** An action taken on a system intake, often resulting in a change in status. */
export type SystemIntakeAction = {
  __typename: 'SystemIntakeAction';
  actor: SystemIntakeActionActor;
  createdAt: Scalars['Time']['output'];
  feedback?: Maybe<Scalars['HTML']['output']>;
  id: Scalars['UUID']['output'];
  lcidExpirationChange?: Maybe<SystemIntakeLCIDExpirationChange>;
  newRetirementDate?: Maybe<Scalars['Time']['output']>;
  previousRetirementDate?: Maybe<Scalars['Time']['output']>;
  step?: Maybe<SystemIntakeStep>;
  systemIntake: SystemIntake;
  type: SystemIntakeActionType;
};

/** The contact who is associated with an action being done to a system request */
export type SystemIntakeActionActor = {
  __typename: 'SystemIntakeActionActor';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** Represents the type of an action that is being done to a system request */
export enum SystemIntakeActionType {
  BIZ_CASE_NEEDS_CHANGES = 'BIZ_CASE_NEEDS_CHANGES',
  CHANGE_LCID_RETIREMENT_DATE = 'CHANGE_LCID_RETIREMENT_DATE',
  CLOSE_REQUEST = 'CLOSE_REQUEST',
  CONFIRM_LCID = 'CONFIRM_LCID',
  CREATE_BIZ_CASE = 'CREATE_BIZ_CASE',
  EXPIRE_LCID = 'EXPIRE_LCID',
  EXTEND_LCID = 'EXTEND_LCID',
  GUIDE_RECEIVED_CLOSE = 'GUIDE_RECEIVED_CLOSE',
  ISSUE_LCID = 'ISSUE_LCID',
  NEED_BIZ_CASE = 'NEED_BIZ_CASE',
  NOT_GOVERNANCE = 'NOT_GOVERNANCE',
  NOT_IT_REQUEST = 'NOT_IT_REQUEST',
  NOT_RESPONDING_CLOSE = 'NOT_RESPONDING_CLOSE',
  NO_GOVERNANCE_NEEDED = 'NO_GOVERNANCE_NEEDED',
  PROGRESS_TO_NEW_STEP = 'PROGRESS_TO_NEW_STEP',
  PROVIDE_FEEDBACK_NEED_BIZ_CASE = 'PROVIDE_FEEDBACK_NEED_BIZ_CASE',
  PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT = 'PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT',
  PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL = 'PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL',
  READY_FOR_GRB = 'READY_FOR_GRB',
  READY_FOR_GRT = 'READY_FOR_GRT',
  REJECT = 'REJECT',
  REOPEN_REQUEST = 'REOPEN_REQUEST',
  REQUEST_EDITS = 'REQUEST_EDITS',
  RETIRE_LCID = 'RETIRE_LCID',
  SEND_EMAIL = 'SEND_EMAIL',
  SUBMIT_BIZ_CASE = 'SUBMIT_BIZ_CASE',
  SUBMIT_FINAL_BIZ_CASE = 'SUBMIT_FINAL_BIZ_CASE',
  SUBMIT_INTAKE = 'SUBMIT_INTAKE',
  UNRETIRE_LCID = 'UNRETIRE_LCID',
  UPDATE_LCID = 'UPDATE_LCID'
}

/** Represents current and planned annual costs for a system */
export type SystemIntakeAnnualSpending = {
  __typename: 'SystemIntakeAnnualSpending';
  currentAnnualSpending?: Maybe<Scalars['String']['output']>;
  currentAnnualSpendingITPortion?: Maybe<Scalars['String']['output']>;
  plannedYearOneSpending?: Maybe<Scalars['String']['output']>;
  plannedYearOneSpendingITPortion?: Maybe<Scalars['String']['output']>;
};

/** Input data for current and planned year one annual costs associated with a system request */
export type SystemIntakeAnnualSpendingInput = {
  currentAnnualSpending?: InputMaybe<Scalars['String']['input']>;
  currentAnnualSpendingITPortion?: InputMaybe<Scalars['String']['input']>;
  plannedYearOneSpending?: InputMaybe<Scalars['String']['input']>;
  plannedYearOneSpendingITPortion?: InputMaybe<Scalars['String']['input']>;
};

/** Represents the OIT Business Owner of a system */
export type SystemIntakeBusinessOwner = {
  __typename: 'SystemIntakeBusinessOwner';
  component?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** The input data used to set the CMS Business Owner of a system */
export type SystemIntakeBusinessOwnerInput = {
  component: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

/** Input for changing an intake's LCID retirement date in IT Gov v2 */
export type SystemIntakeChangeLCIDRetirementDateInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  retiresAt: Scalars['Time']['input'];
  systemIntakeID: Scalars['UUID']['input'];
};

/** Input for creating a Close Request Action in Admin Actions v2 */
export type SystemIntakeCloseRequestInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  reason?: InputMaybe<Scalars['HTML']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

/**
 * Represents a contact in OIT who is collaborating with the user
 * creating a system IT governance request
 */
export type SystemIntakeCollaborator = {
  __typename: 'SystemIntakeCollaborator';
  acronym: Scalars['String']['output'];
  collaborator: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** The input data used to add an OIT collaborator for a system request */
export type SystemIntakeCollaboratorInput = {
  collaborator: Scalars['String']['input'];
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

/** Input for confirming an intake's decision to issue an LCID in IT Gov v2 */
export type SystemIntakeConfirmLCIDInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  costBaseline?: InputMaybe<Scalars['String']['input']>;
  expiresAt: Scalars['Time']['input'];
  nextSteps: Scalars['HTML']['input'];
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  scope: Scalars['HTML']['input'];
  systemIntakeID: Scalars['UUID']['input'];
  trbFollowUp: SystemIntakeTRBFollowUp;
};

/** Represents a contact associated with a system intake */
export type SystemIntakeContact = {
  __typename: 'SystemIntakeContact';
  component: Scalars['String']['output'];
  euaUserId: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  role: Scalars['String']['output'];
  systemIntakeId: Scalars['UUID']['output'];
};

/** The payload when retrieving system intake contacts */
export type SystemIntakeContactsPayload = {
  __typename: 'SystemIntakeContactsPayload';
  invalidEUAIDs: Array<Scalars['String']['output']>;
  systemIntakeContacts: Array<AugmentedSystemIntakeContact>;
};

/** Represents a contract for work on a system */
export type SystemIntakeContract = {
  __typename: 'SystemIntakeContract';
  contractor?: Maybe<Scalars['String']['output']>;
  endDate: ContractDate;
  hasContract?: Maybe<Scalars['String']['output']>;
  startDate: ContractDate;
  vehicle?: Maybe<Scalars['String']['output']>;
};

/** Input data containing information about a contract related to a system request */
export type SystemIntakeContractInput = {
  contractor?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Time']['input']>;
  hasContract?: InputMaybe<Scalars['String']['input']>;
  numbers: Array<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Time']['input']>;
};

export type SystemIntakeContractNumber = {
  __typename: 'SystemIntakeContractNumber';
  contractNumber: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  systemIntakeID: Scalars['UUID']['output'];
};

/** Represents expectations about a system's additional costs */
export type SystemIntakeCosts = {
  __typename: 'SystemIntakeCosts';
  expectedIncreaseAmount?: Maybe<Scalars['String']['output']>;
  isExpectingIncrease?: Maybe<Scalars['String']['output']>;
};

/**
 * Input data for estimated system cost increases associated with a system request
 *
 * NOTE: This field is no longer in intake form but data/query is preserved for existing intakes (EASI-2076)
 */
export type SystemIntakeCostsInput = {
  expectedIncreaseAmount?: InputMaybe<Scalars['String']['input']>;
  isExpectingIncrease?: InputMaybe<Scalars['String']['input']>;
};

/** This represents the possible System Intake Decision States */
export enum SystemIntakeDecisionState {
  LCID_ISSUED = 'LCID_ISSUED',
  NOT_APPROVED = 'NOT_APPROVED',
  NOT_GOVERNANCE = 'NOT_GOVERNANCE',
  NO_DECISION = 'NO_DECISION'
}

/** Represents a document attached to a System Intake */
export type SystemIntakeDocument = {
  __typename: 'SystemIntakeDocument';
  canDelete: Scalars['Boolean']['output'];
  canView: Scalars['Boolean']['output'];
  documentType: SystemIntakeDocumentType;
  fileName: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  status: SystemIntakeDocumentStatus;
  systemIntakeId: Scalars['UUID']['output'];
  uploadedAt: Scalars['Time']['output'];
  url?: Maybe<Scalars['String']['output']>;
  version: SystemIntakeDocumentVersion;
};

/**
 * Represents the common options for document type that is attached to a
 * System Intake document
 */
export enum SystemIntakeDocumentCommonType {
  ACQUISITION_PLAN_OR_STRATEGY = 'ACQUISITION_PLAN_OR_STRATEGY',
  DRAFT_IGCE = 'DRAFT_IGCE',
  MEETING_MINUTES = 'MEETING_MINUTES',
  OTHER = 'OTHER',
  REQUEST_FOR_ADDITIONAL_FUNDING = 'REQUEST_FOR_ADDITIONAL_FUNDING',
  SOFTWARE_BILL_OF_MATERIALS = 'SOFTWARE_BILL_OF_MATERIALS',
  SOO_SOW = 'SOO_SOW'
}

/** Enumeration of the possible statuses of documents uploaded in the System Intake */
export enum SystemIntakeDocumentStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  UNAVAILABLE = 'UNAVAILABLE'
}

/**
 * Denotes the type of a document attached to a System Intake,
 * which can be one of a number of common types, or a free-text user-specified type
 */
export type SystemIntakeDocumentType = {
  __typename: 'SystemIntakeDocumentType';
  commonType: SystemIntakeDocumentCommonType;
  otherTypeDescription?: Maybe<Scalars['String']['output']>;
};

/**
 * Represents the version options for a document that is attached to a
 * System Intake document
 */
export enum SystemIntakeDocumentVersion {
  CURRENT = 'CURRENT',
  HISTORICAL = 'HISTORICAL'
}

/** Input for expiring an intake's LCID in IT Gov v2 */
export type SystemIntakeExpireLCIDInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  nextSteps?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  reason: Scalars['HTML']['input'];
  systemIntakeID: Scalars['UUID']['input'];
};

/** This represents the possible state any system intake form can take */
export enum SystemIntakeFormState {
  EDITS_REQUESTED = 'EDITS_REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  SUBMITTED = 'SUBMITTED'
}

/** SystemIntakeRequestEditsOptions represents the current step in the intake process */
export enum SystemIntakeFormStep {
  DRAFT_BUSINESS_CASE = 'DRAFT_BUSINESS_CASE',
  FINAL_BUSINESS_CASE = 'FINAL_BUSINESS_CASE',
  INITIAL_REQUEST_FORM = 'INITIAL_REQUEST_FORM'
}

/** Represents the source of funding for a system */
export type SystemIntakeFundingSource = {
  __typename: 'SystemIntakeFundingSource';
  fundingNumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  source?: Maybe<Scalars['String']['output']>;
};

/** Represents the source of funding for a system */
export type SystemIntakeFundingSourceInput = {
  fundingNumber?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

/** The input required to specify the funding source(s) for a system intake */
export type SystemIntakeFundingSourcesInput = {
  existingFunding?: InputMaybe<Scalars['Boolean']['input']>;
  fundingSources: Array<SystemIntakeFundingSourceInput>;
};

/**
 * Represents a single row of presentation link and document data for a system intake's Async GRB review
 * All data values are optional but there is a constraint to require one data value on insertion
 */
export type SystemIntakeGRBPresentationLinks = {
  __typename: 'SystemIntakeGRBPresentationLinks';
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  presentationDeckFileName?: Maybe<Scalars['String']['output']>;
  presentationDeckFileStatus?: Maybe<SystemIntakeDocumentStatus>;
  presentationDeckFileURL?: Maybe<Scalars['String']['output']>;
  recordingLink?: Maybe<Scalars['String']['output']>;
  recordingPasscode?: Maybe<Scalars['String']['output']>;
  systemIntakeID: Scalars['UUID']['output'];
  transcriptFileName?: Maybe<Scalars['String']['output']>;
  transcriptFileStatus?: Maybe<SystemIntakeDocumentStatus>;
  transcriptFileURL?: Maybe<Scalars['String']['output']>;
  transcriptLink?: Maybe<Scalars['String']['output']>;
};

/**
 * Data needed to add system intake presentation link data
 * One of the optional link/files values is required to pass the database constraint
 */
export type SystemIntakeGRBPresentationLinksInput = {
  presentationDeckFileData?: InputMaybe<Scalars['Upload']['input']>;
  recordingLink?: InputMaybe<Scalars['String']['input']>;
  recordingPasscode?: InputMaybe<Scalars['String']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
  transcriptFileData?: InputMaybe<Scalars['Upload']['input']>;
  transcriptLink?: InputMaybe<Scalars['String']['input']>;
};

export type SystemIntakeGRBReviewDiscussion = {
  __typename: 'SystemIntakeGRBReviewDiscussion';
  initialPost: SystemIntakeGRBReviewDiscussionPost;
  replies: Array<SystemIntakeGRBReviewDiscussionPost>;
};

export type SystemIntakeGRBReviewDiscussionPost = {
  __typename: 'SystemIntakeGRBReviewDiscussionPost';
  content: Scalars['HTML']['output'];
  createdAt: Scalars['Time']['output'];
  createdByUserAccount: UserAccount;
  grbRole?: Maybe<SystemIntakeGRBReviewerRole>;
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  systemIntakeID: Scalars['UUID']['output'];
  votingRole?: Maybe<SystemIntakeGRBReviewerVotingRole>;
};

export enum SystemIntakeGRBReviewType {
  ASYNC = 'ASYNC',
  STANDARD = 'STANDARD'
}

/** GRB Reviewers for a system Intake Request */
export type SystemIntakeGRBReviewer = {
  __typename: 'SystemIntakeGRBReviewer';
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['UUID']['output'];
  grbRole: SystemIntakeGRBReviewerRole;
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  systemIntakeID: Scalars['UUID']['output'];
  userAccount: UserAccount;
  votingRole: SystemIntakeGRBReviewerVotingRole;
};

export enum SystemIntakeGRBReviewerRole {
  ACA_3021_REP = 'ACA_3021_REP',
  CCIIO_REP = 'CCIIO_REP',
  CMCS_REP = 'CMCS_REP',
  CO_CHAIR_CFO = 'CO_CHAIR_CFO',
  CO_CHAIR_CIO = 'CO_CHAIR_CIO',
  CO_CHAIR_HCA = 'CO_CHAIR_HCA',
  FED_ADMIN_BDG_CHAIR = 'FED_ADMIN_BDG_CHAIR',
  OTHER = 'OTHER',
  PROGRAM_INTEGRITY_BDG_CHAIR = 'PROGRAM_INTEGRITY_BDG_CHAIR',
  PROGRAM_OPERATIONS_BDG_CHAIR = 'PROGRAM_OPERATIONS_BDG_CHAIR',
  QIO_REP = 'QIO_REP',
  SUBJECT_MATTER_EXPERT = 'SUBJECT_MATTER_EXPERT'
}

export enum SystemIntakeGRBReviewerVotingRole {
  ALTERNATE = 'ALTERNATE',
  NON_VOTING = 'NON_VOTING',
  VOTING = 'VOTING'
}

/** Contains multiple system request collaborators, if any */
export type SystemIntakeGovernanceTeam = {
  __typename: 'SystemIntakeGovernanceTeam';
  isPresent?: Maybe<Scalars['Boolean']['output']>;
  teams?: Maybe<Array<SystemIntakeCollaborator>>;
};

/** The input data used to set the list of OIT collaborators for a system request */
export type SystemIntakeGovernanceTeamInput = {
  isPresent?: InputMaybe<Scalars['Boolean']['input']>;
  teams?: InputMaybe<Array<InputMaybe<SystemIntakeCollaboratorInput>>>;
};

/**
 * The Information System Security Officer (ISSO) that is
 * assicuated with a system request, if any
 */
export type SystemIntakeISSO = {
  __typename: 'SystemIntakeISSO';
  isPresent?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** The input data used to set the ISSO associated with a system request, if any */
export type SystemIntakeISSOInput = {
  isPresent?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Input for setting an intake's decision to issuing an LCID in IT Gov v2 */
export type SystemIntakeIssueLCIDInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  costBaseline?: InputMaybe<Scalars['String']['input']>;
  expiresAt: Scalars['Time']['input'];
  lcid?: InputMaybe<Scalars['String']['input']>;
  nextSteps: Scalars['HTML']['input'];
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  scope: Scalars['HTML']['input'];
  systemIntakeID: Scalars['UUID']['input'];
  trbFollowUp: SystemIntakeTRBFollowUp;
};

/** Contains the data about a change to the expiration date of a system request's lifecycle ID */
export type SystemIntakeLCIDExpirationChange = {
  __typename: 'SystemIntakeLCIDExpirationChange';
  newCostBaseline?: Maybe<Scalars['String']['output']>;
  newDate: Scalars['Time']['output'];
  newNextSteps?: Maybe<Scalars['HTML']['output']>;
  newScope?: Maybe<Scalars['HTML']['output']>;
  previousCostBaseline?: Maybe<Scalars['String']['output']>;
  previousDate: Scalars['Time']['output'];
  previousNextSteps?: Maybe<Scalars['HTML']['output']>;
  previousScope?: Maybe<Scalars['HTML']['output']>;
};

/** The possible statuses that an issued LCID can be in */
export enum SystemIntakeLCIDStatus {
  EXPIRED = 'EXPIRED',
  ISSUED = 'ISSUED',
  RETIRED = 'RETIRED'
}

/** This represents the possible states any system intake meeting can take. */
export enum SystemIntakeMeetingState {
  NOT_SCHEDULED = 'NOT_SCHEDULED',
  SCHEDULED = 'SCHEDULED'
}

/** Input for creating a Not an IT Governance Request Action in Admin Actions v2 */
export type SystemIntakeNotITGovReqInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  reason?: InputMaybe<Scalars['HTML']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

/** A note added to a system request */
export type SystemIntakeNote = {
  __typename: 'SystemIntakeNote';
  author: SystemIntakeNoteAuthor;
  content: Scalars['HTML']['output'];
  createdAt: Scalars['Time']['output'];
  editor?: Maybe<UserInfo>;
  id: Scalars['UUID']['output'];
  isArchived: Scalars['Boolean']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
};

/** The author of a note added to a system request */
export type SystemIntakeNoteAuthor = {
  __typename: 'SystemIntakeNoteAuthor';
  eua: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** The product manager associated with a system */
export type SystemIntakeProductManager = {
  __typename: 'SystemIntakeProductManager';
  component?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** The input data used to set the CMS product manager/lead of a system */
export type SystemIntakeProductManagerInput = {
  component: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

/** Input for submitting a Progress to New Step action in IT Gov v2 */
export type SystemIntakeProgressToNewStepsInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  feedback?: InputMaybe<Scalars['HTML']['input']>;
  grbRecommendations?: InputMaybe<Scalars['HTML']['input']>;
  grbReviewType?: InputMaybe<SystemIntakeGRBReviewType>;
  meetingDate?: InputMaybe<Scalars['Time']['input']>;
  newStep: SystemIntakeStepToProgressTo;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  systemIntakeID: Scalars['UUID']['input'];
};

/** Input for setting an intake's decision to Not Approved by GRB in IT Gov v2 */
export type SystemIntakeRejectIntakeInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  nextSteps: Scalars['HTML']['input'];
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  reason: Scalars['HTML']['input'];
  systemIntakeID: Scalars['UUID']['input'];
  trbFollowUp: SystemIntakeTRBFollowUp;
};

/** Input for creating a Reopen Request Action in Admin Actions v2 */
export type SystemIntakeReopenRequestInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  reason?: InputMaybe<Scalars['HTML']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

/** Input for creating a Request Edits Action in Admin Actions v2 */
export type SystemIntakeRequestEditsInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  emailFeedback: Scalars['HTML']['input'];
  intakeFormStep: SystemIntakeFormStep;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  systemIntakeID: Scalars['UUID']['input'];
};

/** The type of an IT governance (system) request */
export enum SystemIntakeRequestType {
  MAJOR_CHANGES = 'MAJOR_CHANGES',
  NEW = 'NEW',
  RECOMPETE = 'RECOMPETE',
  SHUTDOWN = 'SHUTDOWN'
}

/** The contact who made an IT governance request for a system */
export type SystemIntakeRequester = {
  __typename: 'SystemIntakeRequester';
  component?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

/** The input data used to set the requester of a system request */
export type SystemIntakeRequesterInput = {
  name: Scalars['String']['input'];
};

/**
 * The input data used to set the requester for a system request along with the
 * requester's business component
 */
export type SystemIntakeRequesterWithComponentInput = {
  component: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

/** Input for retiring an intake's LCID in IT Gov v2 */
export type SystemIntakeRetireLCIDInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  reason?: InputMaybe<Scalars['HTML']['input']>;
  retiresAt: Scalars['Time']['input'];
  systemIntakeID: Scalars['UUID']['input'];
};

/** SystemIntakeSoftwareAcquisitionMethods represents the different methods requesters can select in a system intake */
export enum SystemIntakeSoftwareAcquisitionMethods {
  CONTRACTOR_FURNISHED = 'CONTRACTOR_FURNISHED',
  ELA_OR_INTERNAL = 'ELA_OR_INTERNAL',
  FED_FURNISHED = 'FED_FURNISHED',
  NOT_YET_DETERMINED = 'NOT_YET_DETERMINED',
  OTHER = 'OTHER'
}

/** SystemIntakeState represents whether the intake is open or closed */
export enum SystemIntakeState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN'
}

/** This represents the statuses that an admin would see as a representation of a system intake. Note, there is no status for a brand new request, because an Admin doesn't see the request until it is in progress. */
export enum SystemIntakeStatusAdmin {
  CLOSED = 'CLOSED',
  DRAFT_BUSINESS_CASE_IN_PROGRESS = 'DRAFT_BUSINESS_CASE_IN_PROGRESS',
  DRAFT_BUSINESS_CASE_SUBMITTED = 'DRAFT_BUSINESS_CASE_SUBMITTED',
  FINAL_BUSINESS_CASE_IN_PROGRESS = 'FINAL_BUSINESS_CASE_IN_PROGRESS',
  FINAL_BUSINESS_CASE_SUBMITTED = 'FINAL_BUSINESS_CASE_SUBMITTED',
  GRB_MEETING_COMPLETE = 'GRB_MEETING_COMPLETE',
  GRB_MEETING_READY = 'GRB_MEETING_READY',
  GRB_REVIEW_IN_PROGRESS = 'GRB_REVIEW_IN_PROGRESS',
  GRT_MEETING_COMPLETE = 'GRT_MEETING_COMPLETE',
  GRT_MEETING_READY = 'GRT_MEETING_READY',
  INITIAL_REQUEST_FORM_IN_PROGRESS = 'INITIAL_REQUEST_FORM_IN_PROGRESS',
  INITIAL_REQUEST_FORM_SUBMITTED = 'INITIAL_REQUEST_FORM_SUBMITTED',
  LCID_EXPIRED = 'LCID_EXPIRED',
  LCID_ISSUED = 'LCID_ISSUED',
  LCID_RETIRED = 'LCID_RETIRED',
  NOT_APPROVED = 'NOT_APPROVED',
  NOT_GOVERNANCE = 'NOT_GOVERNANCE'
}

/** This represents the (calculated) statuses that a requester view of a system Intake Request can show as part of the IT Gov v2 workflow */
export enum SystemIntakeStatusRequester {
  CLOSED = 'CLOSED',
  DRAFT_BUSINESS_CASE_EDITS_REQUESTED = 'DRAFT_BUSINESS_CASE_EDITS_REQUESTED',
  DRAFT_BUSINESS_CASE_IN_PROGRESS = 'DRAFT_BUSINESS_CASE_IN_PROGRESS',
  DRAFT_BUSINESS_CASE_SUBMITTED = 'DRAFT_BUSINESS_CASE_SUBMITTED',
  FINAL_BUSINESS_CASE_EDITS_REQUESTED = 'FINAL_BUSINESS_CASE_EDITS_REQUESTED',
  FINAL_BUSINESS_CASE_IN_PROGRESS = 'FINAL_BUSINESS_CASE_IN_PROGRESS',
  FINAL_BUSINESS_CASE_SUBMITTED = 'FINAL_BUSINESS_CASE_SUBMITTED',
  GRB_MEETING_AWAITING_DECISION = 'GRB_MEETING_AWAITING_DECISION',
  GRB_MEETING_READY = 'GRB_MEETING_READY',
  GRB_REVIEW_IN_PROGRESS = 'GRB_REVIEW_IN_PROGRESS',
  GRT_MEETING_AWAITING_DECISION = 'GRT_MEETING_AWAITING_DECISION',
  GRT_MEETING_READY = 'GRT_MEETING_READY',
  INITIAL_REQUEST_FORM_EDITS_REQUESTED = 'INITIAL_REQUEST_FORM_EDITS_REQUESTED',
  INITIAL_REQUEST_FORM_IN_PROGRESS = 'INITIAL_REQUEST_FORM_IN_PROGRESS',
  INITIAL_REQUEST_FORM_NEW = 'INITIAL_REQUEST_FORM_NEW',
  INITIAL_REQUEST_FORM_SUBMITTED = 'INITIAL_REQUEST_FORM_SUBMITTED',
  LCID_EXPIRED = 'LCID_EXPIRED',
  LCID_ISSUED = 'LCID_ISSUED',
  LCID_RETIRED = 'LCID_RETIRED',
  NOT_APPROVED = 'NOT_APPROVED',
  NOT_GOVERNANCE = 'NOT_GOVERNANCE'
}

/** SystemIntakeStep represents the current step in the intake process */
export enum SystemIntakeStep {
  DECISION_AND_NEXT_STEPS = 'DECISION_AND_NEXT_STEPS',
  DRAFT_BUSINESS_CASE = 'DRAFT_BUSINESS_CASE',
  FINAL_BUSINESS_CASE = 'FINAL_BUSINESS_CASE',
  GRB_MEETING = 'GRB_MEETING',
  GRT_MEETING = 'GRT_MEETING',
  INITIAL_REQUEST_FORM = 'INITIAL_REQUEST_FORM'
}

/** Steps in the system intake process that a Progress to New Step action can progress to */
export enum SystemIntakeStepToProgressTo {
  DRAFT_BUSINESS_CASE = 'DRAFT_BUSINESS_CASE',
  FINAL_BUSINESS_CASE = 'FINAL_BUSINESS_CASE',
  GRB_MEETING = 'GRB_MEETING',
  GRT_MEETING = 'GRT_MEETING'
}

/** Different options for whether the Governance team believes a requester's team should consult with the TRB */
export enum SystemIntakeTRBFollowUp {
  NOT_RECOMMENDED = 'NOT_RECOMMENDED',
  RECOMMENDED_BUT_NOT_CRITICAL = 'RECOMMENDED_BUT_NOT_CRITICAL',
  STRONGLY_RECOMMENDED = 'STRONGLY_RECOMMENDED'
}

/** Input for "unretiring" (i.e. removing retirement date) an LCID in IT Gov v2 */
export type SystemIntakeUnretireLCIDInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  systemIntakeID: Scalars['UUID']['input'];
};

/** Input for updating an intake's LCID in IT Gov v2 */
export type SystemIntakeUpdateLCIDInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  costBaseline?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['Time']['input']>;
  nextSteps?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  reason?: InputMaybe<Scalars['HTML']['input']>;
  scope?: InputMaybe<Scalars['HTML']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

/** Represents an admin note attached to a TRB request */
export type TRBAdminNote = {
  __typename: 'TRBAdminNote';
  author: UserInfo;
  category: TRBAdminNoteCategory;
  categorySpecificData: TRBAdminNoteCategorySpecificData;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  isArchived: Scalars['Boolean']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  noteText: Scalars['HTML']['output'];
  trbRequestId: Scalars['UUID']['output'];
};

/** Represents the category of a single TRB admin note */
export enum TRBAdminNoteCategory {
  CONSULT_SESSION = 'CONSULT_SESSION',
  GENERAL_REQUEST = 'GENERAL_REQUEST',
  GUIDANCE_LETTER = 'GUIDANCE_LETTER',
  INITIAL_REQUEST_FORM = 'INITIAL_REQUEST_FORM',
  SUPPORTING_DOCUMENTS = 'SUPPORTING_DOCUMENTS'
}

export type TRBAdminNoteCategorySpecificData = TRBAdminNoteConsultSessionCategoryData | TRBAdminNoteGeneralRequestCategoryData | TRBAdminNoteGuidanceLetterCategoryData | TRBAdminNoteInitialRequestFormCategoryData | TRBAdminNoteSupportingDocumentsCategoryData;

/**
 * Data specific to admin notes in the Consult Session category
 * This type doesn't contain any actual data
 */
export type TRBAdminNoteConsultSessionCategoryData = {
  __typename: 'TRBAdminNoteConsultSessionCategoryData';
  /** Placeholder field so this type is non-empty, always null */
  placeholderField?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Data specific to admin notes in the General Request category
 * This type doesn't contain any actual data
 */
export type TRBAdminNoteGeneralRequestCategoryData = {
  __typename: 'TRBAdminNoteGeneralRequestCategoryData';
  /** Placeholder field so this type is non-empty, always null */
  placeholderField?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Data specific to admin notes in the Guidance Letter category
 * The "insights" property _will_ return deleted insights so that UI can reference the insight title
 */
export type TRBAdminNoteGuidanceLetterCategoryData = {
  __typename: 'TRBAdminNoteGuidanceLetterCategoryData';
  appliesToMeetingSummary: Scalars['Boolean']['output'];
  appliesToNextSteps: Scalars['Boolean']['output'];
  insights: Array<TRBGuidanceLetterInsight>;
};

/** Data specific to admin notes in the Initial Request Form category */
export type TRBAdminNoteInitialRequestFormCategoryData = {
  __typename: 'TRBAdminNoteInitialRequestFormCategoryData';
  appliesToAttendees: Scalars['Boolean']['output'];
  appliesToBasicRequestDetails: Scalars['Boolean']['output'];
  appliesToSubjectAreas: Scalars['Boolean']['output'];
};

/**
 * Data specific to admin notes in the Supporting Documents category
 * The "documents" property _will_ return deleted documents so that UI can reference the document name
 */
export type TRBAdminNoteSupportingDocumentsCategoryData = {
  __typename: 'TRBAdminNoteSupportingDocumentsCategoryData';
  documents: Array<TRBRequestDocument>;
};

/** Represents the status of the TRB consult attendance step */
export enum TRBAttendConsultStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  READY_TO_SCHEDULE = 'READY_TO_SCHEDULE',
  SCHEDULED = 'SCHEDULED'
}

/** Represents an option selected for collaboration groups in the TRB request form */
export enum TRBCollabGroupOption {
  CLOUD = 'CLOUD',
  ENTERPRISE_ARCHITECTURE = 'ENTERPRISE_ARCHITECTURE',
  GOVERNANCE_REVIEW_BOARD = 'GOVERNANCE_REVIEW_BOARD',
  OTHER = 'OTHER',
  PRIVACY_ADVISOR = 'PRIVACY_ADVISOR',
  SECURITY = 'SECURITY'
}

/** Represents the status of the TRB consult step */
export enum TRBConsultPrepStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  READY_TO_START = 'READY_TO_START'
}

/**
 * Represents the common options for document type that is attached to a
 * TRB Request
 */
export enum TRBDocumentCommonType {
  ARCHITECTURE_DIAGRAM = 'ARCHITECTURE_DIAGRAM',
  BUSINESS_CASE = 'BUSINESS_CASE',
  OTHER = 'OTHER',
  PRESENTATION_SLIDE_DECK = 'PRESENTATION_SLIDE_DECK'
}

/** Represents the action an admin is taking on a TRB request when leaving feedback */
export enum TRBFeedbackAction {
  READY_FOR_CONSULT = 'READY_FOR_CONSULT',
  REQUEST_EDITS = 'REQUEST_EDITS'
}

/** Represents the status of the TRB feedback step */
export enum TRBFeedbackStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  EDITS_REQUESTED = 'EDITS_REQUESTED',
  IN_REVIEW = 'IN_REVIEW',
  READY_TO_START = 'READY_TO_START'
}

/** Represents the status of a TRB request form */
export enum TRBFormStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_TO_START = 'READY_TO_START'
}

/** Represents a TRB funding source */
export type TRBFundingSource = {
  __typename: 'TRBFundingSource';
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  fundingNumber: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  trbRequestId: Scalars['UUID']['output'];
};

/** Represents a guidance letter for a TRB request */
export type TRBGuidanceLetter = {
  __typename: 'TRBGuidanceLetter';
  author: UserInfo;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  dateSent?: Maybe<Scalars['Time']['output']>;
  followupPoint?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  /** List of insights in the order specified by users */
  insights: Array<TRBGuidanceLetterInsight>;
  isFollowupRecommended?: Maybe<Scalars['Boolean']['output']>;
  meetingSummary?: Maybe<Scalars['HTML']['output']>;
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  nextSteps?: Maybe<Scalars['HTML']['output']>;
  trbRequestId: Scalars['UUID']['output'];
};

/** Represents an insight and links that have been added to a TRB guidance letter */
export type TRBGuidanceLetterInsight = {
  __typename: 'TRBGuidanceLetterInsight';
  author: UserInfo;
  category?: Maybe<TRBGuidanceLetterInsightCategory>;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['UUID']['output'];
  insight: Scalars['HTML']['output'];
  links: Array<Scalars['String']['output']>;
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  trbRequestId: Scalars['UUID']['output'];
};

export enum TRBGuidanceLetterInsightCategory {
  CONSIDERATION = 'CONSIDERATION',
  RECOMMENDATION = 'RECOMMENDATION',
  REQUIREMENT = 'REQUIREMENT',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

/** Represents the status of the TRB guidance letter step */
export enum TRBGuidanceLetterStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW',
  READY_TO_START = 'READY_TO_START'
}

/** Represents the status of the TRB guidance letter step */
export enum TRBGuidanceLetterStatusTaskList {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  IN_REVIEW = 'IN_REVIEW'
}

/** Represents a request for support from the Technical Review Board (TRB) */
export type TRBRequest = {
  __typename: 'TRBRequest';
  adminNotes: Array<TRBAdminNote>;
  archived: Scalars['Boolean']['output'];
  attendees: Array<TRBRequestAttendee>;
  consultMeetingTime?: Maybe<Scalars['Time']['output']>;
  contractName?: Maybe<Scalars['String']['output']>;
  /** Linked contract numbers */
  contractNumbers: Array<TRBRequestContractNumber>;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  documents: Array<TRBRequestDocument>;
  feedback: Array<TRBRequestFeedback>;
  form: TRBRequestForm;
  guidanceLetter?: Maybe<TRBGuidanceLetter>;
  id: Scalars['UUID']['output'];
  isRecent: Scalars['Boolean']['output'];
  lastMeetingDate?: Maybe<Scalars['Time']['output']>;
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nextMeetingDate?: Maybe<Scalars['Time']['output']>;
  /** System Intakes that share a CEDAR System or Contract Number */
  relatedIntakes: Array<SystemIntake>;
  /** Other TRB Requests that share a CEDAR System or Contract Number */
  relatedTRBRequests: Array<TRBRequest>;
  relationType?: Maybe<RequestRelationType>;
  requesterComponent?: Maybe<Scalars['String']['output']>;
  requesterInfo: UserInfo;
  state: TRBRequestState;
  status: TRBRequestStatus;
  /** Linked systems */
  systems: Array<CedarSystem>;
  taskStatuses: TRBTaskStatuses;
  trbLead?: Maybe<Scalars['String']['output']>;
  trbLeadInfo: UserInfo;
  type: TRBRequestType;
};

/** Represents an EUA user who is included as an attendee for a TRB request */
export type TRBRequestAttendee = {
  __typename: 'TRBRequestAttendee';
  component?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  euaUserId: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  role?: Maybe<PersonRole>;
  trbRequestId: Scalars['UUID']['output'];
  userInfo?: Maybe<UserInfo>;
};

/**
 * TRBRequestChanges represents the possible changes you can make to a TRB request when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type TRBRequestChanges = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TRBRequestType>;
};

export type TRBRequestContractNumber = {
  __typename: 'TRBRequestContractNumber';
  contractNumber: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  trbRequestID: Scalars['UUID']['output'];
};

/** Represents a document attached to a TRB request */
export type TRBRequestDocument = {
  __typename: 'TRBRequestDocument';
  deletedAt?: Maybe<Scalars['Time']['output']>;
  documentType: TRBRequestDocumentType;
  fileName: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  status: TRBRequestDocumentStatus;
  uploadedAt: Scalars['Time']['output'];
  url: Scalars['String']['output'];
};

/** Enumeration of the possible statuses of documents uploaded in the TRB workflow */
export enum TRBRequestDocumentStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  UNAVAILABLE = 'UNAVAILABLE'
}

/**
 * Denotes the type of a document attached to a TRB request,
 * which can be one of a number of common types, or a free-text user-specified type
 */
export type TRBRequestDocumentType = {
  __typename: 'TRBRequestDocumentType';
  commonType: TRBDocumentCommonType;
  otherTypeDescription?: Maybe<Scalars['String']['output']>;
};

/** Represents feedback added to a TRB request */
export type TRBRequestFeedback = {
  __typename: 'TRBRequestFeedback';
  action: TRBFeedbackAction;
  author: UserInfo;
  copyTrbMailbox: Scalars['Boolean']['output'];
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  feedbackMessage: Scalars['HTML']['output'];
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  notifyEuaIds: Array<Scalars['String']['output']>;
  trbRequestId: Scalars['UUID']['output'];
};

/** Represents an EUA user who is included as an form for a TRB request */
export type TRBRequestForm = {
  __typename: 'TRBRequestForm';
  collabDateCloud?: Maybe<Scalars['String']['output']>;
  collabDateEnterpriseArchitecture?: Maybe<Scalars['String']['output']>;
  collabDateGovernanceReviewBoard?: Maybe<Scalars['String']['output']>;
  collabDateOther?: Maybe<Scalars['String']['output']>;
  collabDatePrivacyAdvisor?: Maybe<Scalars['String']['output']>;
  collabDateSecurity?: Maybe<Scalars['String']['output']>;
  collabGRBConsultRequested?: Maybe<Scalars['Boolean']['output']>;
  collabGroupOther?: Maybe<Scalars['String']['output']>;
  collabGroups: Array<TRBCollabGroupOption>;
  component?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  expectedEndDate?: Maybe<Scalars['Time']['output']>;
  expectedStartDate?: Maybe<Scalars['Time']['output']>;
  /** TODO: Make Funding sources non-nullable */
  fundingSources?: Maybe<Array<TRBFundingSource>>;
  hasExpectedStartEndDates?: Maybe<Scalars['Boolean']['output']>;
  hasSolutionInMind?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  needsAssistanceWith?: Maybe<Scalars['String']['output']>;
  proposedSolution?: Maybe<Scalars['String']['output']>;
  status: TRBFormStatus;
  subjectAreaOptionOther?: Maybe<Scalars['String']['output']>;
  subjectAreaOptions?: Maybe<Array<TRBSubjectAreaOption>>;
  submittedAt?: Maybe<Scalars['Time']['output']>;
  systemIntakes: Array<SystemIntake>;
  trbRequestId: Scalars['UUID']['output'];
  whereInProcess?: Maybe<TRBWhereInProcessOption>;
  whereInProcessOther?: Maybe<Scalars['String']['output']>;
};

export enum TRBRequestState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN'
}

export enum TRBRequestStatus {
  CONSULT_COMPLETE = 'CONSULT_COMPLETE',
  CONSULT_SCHEDULED = 'CONSULT_SCHEDULED',
  DRAFT_GUIDANCE_LETTER = 'DRAFT_GUIDANCE_LETTER',
  DRAFT_REQUEST_FORM = 'DRAFT_REQUEST_FORM',
  FOLLOW_UP_REQUESTED = 'FOLLOW_UP_REQUESTED',
  GUIDANCE_LETTER_IN_REVIEW = 'GUIDANCE_LETTER_IN_REVIEW',
  GUIDANCE_LETTER_SENT = 'GUIDANCE_LETTER_SENT',
  NEW = 'NEW',
  READY_FOR_CONSULT = 'READY_FOR_CONSULT',
  REQUEST_FORM_COMPLETE = 'REQUEST_FORM_COMPLETE'
}

export enum TRBRequestType {
  BRAINSTORM = 'BRAINSTORM',
  FOLLOWUP = 'FOLLOWUP',
  FORMAL_REVIEW = 'FORMAL_REVIEW',
  NEED_HELP = 'NEED_HELP',
  OTHER = 'OTHER'
}

/** The possible options on the TRB "Subject Areas" page */
export enum TRBSubjectAreaOption {
  ACCESSIBILITY_COMPLIANCE = 'ACCESSIBILITY_COMPLIANCE',
  ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT = 'ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT',
  ARTIFICIAL_INTELLIGENCE = 'ARTIFICIAL_INTELLIGENCE',
  ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT = 'ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT',
  BUSINESS_INTELLIGENCE = 'BUSINESS_INTELLIGENCE',
  CLOUD_MIGRATION = 'CLOUD_MIGRATION',
  CONTAINERS_AND_MICROSERVICES = 'CONTAINERS_AND_MICROSERVICES',
  DISASTER_RECOVERY = 'DISASTER_RECOVERY',
  EMAIL_INTEGRATION = 'EMAIL_INTEGRATION',
  ENTERPRISE_DATA_LAKE_INTEGRATION = 'ENTERPRISE_DATA_LAKE_INTEGRATION',
  FRAMEWORK_OR_TOOL_ALTERNATIVES = 'FRAMEWORK_OR_TOOL_ALTERNATIVES',
  OPEN_SOURCE_SOFTWARE = 'OPEN_SOURCE_SOFTWARE',
  PORTAL_INTEGRATION = 'PORTAL_INTEGRATION',
  SYSTEM_ARCHITECTURE_REVIEW = 'SYSTEM_ARCHITECTURE_REVIEW',
  SYSTEM_DISPOSITION_PLANNING = 'SYSTEM_DISPOSITION_PLANNING',
  TECHNICAL_REFERENCE_ARCHITECTURE = 'TECHNICAL_REFERENCE_ARCHITECTURE',
  WEB_BASED_UI_SERVICES = 'WEB_BASED_UI_SERVICES',
  WEB_SERVICES_AND_APIS = 'WEB_SERVICES_AND_APIS'
}

/** Wraps all of the various status on the TRB task list into one type */
export type TRBTaskStatuses = {
  __typename: 'TRBTaskStatuses';
  attendConsultStatus: TRBAttendConsultStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  feedbackStatus: TRBFeedbackStatus;
  formStatus: TRBFormStatus;
  guidanceLetterStatus: TRBGuidanceLetterStatus;
  guidanceLetterStatusTaskList: TRBGuidanceLetterStatusTaskList;
};

/** Represents an option selected to the "where are you in the process?" TRB request form */
export enum TRBWhereInProcessOption {
  CONTRACTING_WORK_HAS_STARTED = 'CONTRACTING_WORK_HAS_STARTED',
  DEVELOPMENT_HAS_RECENTLY_STARTED = 'DEVELOPMENT_HAS_RECENTLY_STARTED',
  DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY = 'DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY',
  I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM = 'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
  OTHER = 'OTHER',
  THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE = 'THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE'
}

export enum TagType {
  GROUP_GRB_REVIEWERS = 'GROUP_GRB_REVIEWERS',
  GROUP_IT_GOV = 'GROUP_IT_GOV',
  USER_ACCOUNT = 'USER_ACCOUNT'
}

/**
 * Input data used to update the admin lead assigned to a system IT governance
 * request
 */
export type UpdateSystemIntakeAdminLeadInput = {
  adminLead: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
};

/**
 * The input data used to update the contact details of the people associated with
 * a system request
 */
export type UpdateSystemIntakeContactDetailsInput = {
  businessOwner: SystemIntakeBusinessOwnerInput;
  governanceTeams: SystemIntakeGovernanceTeamInput;
  id: Scalars['UUID']['input'];
  isso: SystemIntakeISSOInput;
  productManager: SystemIntakeProductManagerInput;
  requester: SystemIntakeRequesterWithComponentInput;
};

/** The data needed to update a contact associated with a system intake */
export type UpdateSystemIntakeContactInput = {
  component: Scalars['String']['input'];
  euaUserId: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  role: Scalars['String']['input'];
  systemIntakeId: Scalars['UUID']['input'];
};

/** Input data for updating contract details related to a system request */
export type UpdateSystemIntakeContractDetailsInput = {
  annualSpending?: InputMaybe<SystemIntakeAnnualSpendingInput>;
  contract?: InputMaybe<SystemIntakeContractInput>;
  costs?: InputMaybe<SystemIntakeCostsInput>;
  fundingSources?: InputMaybe<SystemIntakeFundingSourcesInput>;
  id: Scalars['UUID']['input'];
};

export type UpdateSystemIntakeGRBReviewerInput = {
  grbRole: SystemIntakeGRBReviewerRole;
  reviewerID: Scalars['UUID']['input'];
  votingRole: SystemIntakeGRBReviewerVotingRole;
};

/** Input data for updating a system intake's relationship to a CEDAR system */
export type UpdateSystemIntakeLinkedCedarSystemInput = {
  cedarSystemId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** Input data for updating an IT governance admin note */
export type UpdateSystemIntakeNoteInput = {
  content: Scalars['HTML']['input'];
  id: Scalars['UUID']['input'];
  isArchived: Scalars['Boolean']['input'];
};

/** The payload for updating a system's IT governance request */
export type UpdateSystemIntakePayload = {
  __typename: 'UpdateSystemIntakePayload';
  systemIntake?: Maybe<SystemIntake>;
  userErrors?: Maybe<Array<UserError>>;
};

/** Input to update some fields on a system request */
export type UpdateSystemIntakeRequestDetailsInput = {
  acquisitionMethods: Array<SystemIntakeSoftwareAcquisitionMethods>;
  businessNeed?: InputMaybe<Scalars['String']['input']>;
  businessSolution?: InputMaybe<Scalars['String']['input']>;
  cedarSystemId?: InputMaybe<Scalars['String']['input']>;
  currentStage?: InputMaybe<Scalars['String']['input']>;
  hasUiChanges?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['UUID']['input'];
  needsEaSupport?: InputMaybe<Scalars['Boolean']['input']>;
  requestName?: InputMaybe<Scalars['String']['input']>;
  usesAiTech?: InputMaybe<Scalars['Boolean']['input']>;
  usingSoftware?: InputMaybe<Scalars['String']['input']>;
};

/** Input data used to update GRT and GRB dates for a system request */
export type UpdateSystemIntakeReviewDatesInput = {
  grbDate?: InputMaybe<Scalars['Time']['input']>;
  grtDate?: InputMaybe<Scalars['Time']['input']>;
  id: Scalars['UUID']['input'];
};

/** The data needed to update a TRB guidance letter */
export type UpdateTRBGuidanceLetterInput = {
  followupPoint?: InputMaybe<Scalars['String']['input']>;
  isFollowupRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  meetingSummary?: InputMaybe<Scalars['HTML']['input']>;
  nextSteps?: InputMaybe<Scalars['HTML']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** The input required to update an insight to a TRB guidance letter */
export type UpdateTRBGuidanceLetterInsightInput = {
  category?: InputMaybe<TRBGuidanceLetterInsightCategory>;
  id: Scalars['UUID']['input'];
  insight?: InputMaybe<Scalars['HTML']['input']>;
  links?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTRBGuidanceLetterInsightOrderInput = {
  category: TRBGuidanceLetterInsightCategory;
  /** List of the insight IDs in the new order they should be displayed */
  newOrder: Array<Scalars['UUID']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** Represents an EUA user who is included as an attendee for a TRB request */
export type UpdateTRBRequestAttendeeInput = {
  component: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  role: PersonRole;
};

/** The data needed schedule a TRB consult meeting time */
export type UpdateTRBRequestConsultMeetingTimeInput = {
  consultMeetingTime: Scalars['Time']['input'];
  copyTrbMailbox: Scalars['Boolean']['input'];
  notes: Scalars['String']['input'];
  notifyEuaIds: Array<Scalars['String']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** Represents an EUA user who is included as an form for a TRB request */
export type UpdateTRBRequestFormInput = {
  collabDateCloud?: InputMaybe<Scalars['String']['input']>;
  collabDateEnterpriseArchitecture?: InputMaybe<Scalars['String']['input']>;
  collabDateGovernanceReviewBoard?: InputMaybe<Scalars['String']['input']>;
  collabDateOther?: InputMaybe<Scalars['String']['input']>;
  collabDatePrivacyAdvisor?: InputMaybe<Scalars['String']['input']>;
  collabDateSecurity?: InputMaybe<Scalars['String']['input']>;
  collabGRBConsultRequested?: InputMaybe<Scalars['Boolean']['input']>;
  collabGroupOther?: InputMaybe<Scalars['String']['input']>;
  collabGroups?: InputMaybe<Array<TRBCollabGroupOption>>;
  component?: InputMaybe<Scalars['String']['input']>;
  expectedEndDate?: InputMaybe<Scalars['Time']['input']>;
  expectedStartDate?: InputMaybe<Scalars['Time']['input']>;
  hasExpectedStartEndDates?: InputMaybe<Scalars['Boolean']['input']>;
  hasSolutionInMind?: InputMaybe<Scalars['Boolean']['input']>;
  isSubmitted?: InputMaybe<Scalars['Boolean']['input']>;
  needsAssistanceWith?: InputMaybe<Scalars['String']['input']>;
  proposedSolution?: InputMaybe<Scalars['String']['input']>;
  subjectAreaOptionOther?: InputMaybe<Scalars['String']['input']>;
  subjectAreaOptions?: InputMaybe<Array<TRBSubjectAreaOption>>;
  systemIntakes?: InputMaybe<Array<Scalars['UUID']['input']>>;
  trbRequestId: Scalars['UUID']['input'];
  whereInProcess?: InputMaybe<TRBWhereInProcessOption>;
  whereInProcessOther?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTRBRequestFundingSourcesInput = {
  fundingNumber: Scalars['String']['input'];
  sources: Array<Scalars['String']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed assign a TRB lead to a TRB request */
export type UpdateTRBRequestTRBLeadInput = {
  trbLead: Scalars['String']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** Data needed to upload a presentation deck */
export type UploadSystemIntakeGRBPresentationDeckInput = {
  presentationDeckFileData?: InputMaybe<Scalars['Upload']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

/** The representation of a User account in the EASI application */
export type UserAccount = {
  __typename: 'UserAccount';
  /** The Common Name of a user. Typically this is a combination of Given and Family name */
  commonName: Scalars['String']['output'];
  /** The email address associated to this user account */
  email: Scalars['String']['output'];
  /** A users family name */
  familyName: Scalars['String']['output'];
  /** A users given name */
  givenName: Scalars['String']['output'];
  /** Represents if a user has logged in. If the user was added as a result of another action, this will show FALSE. When the user logs in, their account will be updated */
  hasLoggedIn?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['UUID']['output'];
  /** The language localization of a user. */
  locale: Scalars['String']['output'];
  /** The unique username of this user account */
  username: Scalars['String']['output'];
  /** The zone information connected with a user account */
  zoneInfo: Scalars['String']['output'];
};

/**
 * UserError represents application-level errors that are the result of
 * either user or application developer error.
 */
export type UserError = {
  __typename: 'UserError';
  message: Scalars['String']['output'];
  path: Array<Scalars['String']['output']>;
};

/** Represents a person response from Okta */
export type UserInfo = {
  __typename: 'UserInfo';
  commonName: Scalars['String']['output'];
  email: Scalars['EmailAddress']['output'];
  euaUserId: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export type CreateSystemIntakeGRBDiscussionPostInput = {
  content: Scalars['TaggedHTML']['input'];
  systemIntakeID: Scalars['UUID']['input'];
};

export type CreateSystemIntakeGRBDiscussionReplyInput = {
  content: Scalars['TaggedHTML']['input'];
  initialPostID: Scalars['UUID']['input'];
};

/** Input data used to set or update a System Intake's GRB Review Presentation (Async) data */
export type UpdateSystemIntakeGRBReviewFormInputPresentationAsync = {
  grbReviewAsyncRecordingTime?: InputMaybe<Scalars['Time']['input']>;
  systemIntakeID: Scalars['UUID']['input'];
};

/** Input data used to set or update a System Intake's GRB Review Presentation (Standard) data */
export type UpdateSystemIntakeGRBReviewFormInputPresentationStandard = {
  grbDate: Scalars['Time']['input'];
  systemIntakeID: Scalars['UUID']['input'];
};

/** Input data used to set or update a System Intake's GRB Review Timeframe (Async) data */
export type UpdateSystemIntakeGRBReviewFormInputTimeframeAsync = {
  grbReviewAsyncEndDate: Scalars['Time']['input'];
  systemIntakeID: Scalars['UUID']['input'];
};

/** Input data used to set or update a System Intake's GRB Review Type */
export type UpdateSystemIntakeGRBReviewTypeInput = {
  grbReviewType: SystemIntakeGRBReviewType;
  systemIntakeID: Scalars['UUID']['input'];
};

export type CedarRoleFragmentFragment = { __typename: 'CedarRole', application: string, objectID: string, roleTypeID: string, assigneeType?: CedarAssigneeType | null, assigneeUsername?: string | null, assigneeEmail?: string | null, assigneeOrgID?: string | null, assigneeOrgName?: string | null, assigneeFirstName?: string | null, assigneeLastName?: string | null, roleTypeName?: string | null, roleID?: string | null };

export type CedarRoleTypeFragmentFragment = { __typename: 'CedarRoleType', id: string, name: string, description?: string | null };

export type FundingSourceFragmentFragment = { __typename: 'SystemIntakeFundingSource', id: UUID, fundingNumber?: string | null, source?: string | null };

export type GovernanceRequestFeedbackFragmentFragment = { __typename: 'GovernanceRequestFeedback', id: UUID, feedback: HTML, targetForm: GovernanceRequestFeedbackTargetForm, type: GovernanceRequestFeedbackType, createdAt: Time, author?: { __typename: 'UserInfo', commonName: string } | null };

export type SystemIntakeContactFragmentFragment = { __typename: 'AugmentedSystemIntakeContact', systemIntakeId: UUID, id: UUID, euaUserId: string, component: string, role: string, commonName?: string | null, email?: EmailAddress | null };

export type SystemIntakeDocumentFragmentFragment = { __typename: 'SystemIntakeDocument', id: UUID, fileName: string, version: SystemIntakeDocumentVersion, status: SystemIntakeDocumentStatus, uploadedAt: Time, url?: string | null, canView: boolean, canDelete: boolean, systemIntakeId: UUID, documentType: { __typename: 'SystemIntakeDocumentType', commonType: SystemIntakeDocumentCommonType, otherTypeDescription?: string | null } };

export type SystemIntakeFragmentFragment = { __typename: 'SystemIntake', id: UUID, adminLead?: string | null, businessNeed?: string | null, businessSolution?: string | null, currentStage?: string | null, decisionNextSteps?: HTML | null, grbDate?: Time | null, grtDate?: Time | null, existingFunding?: boolean | null, lcid?: string | null, lcidIssuedAt?: Time | null, lcidExpiresAt?: Time | null, lcidRetiresAt?: Time | null, lcidScope?: HTML | null, lcidCostBaseline?: string | null, lcidStatus?: SystemIntakeLCIDStatus | null, needsEaSupport?: boolean | null, rejectionReason?: HTML | null, requestName?: string | null, requestType: SystemIntakeRequestType, statusAdmin: SystemIntakeStatusAdmin, statusRequester: SystemIntakeStatusRequester, grtReviewEmailBody?: string | null, decidedAt?: Time | null, businessCaseId?: UUID | null, submittedAt?: Time | null, updatedAt?: Time | null, createdAt?: Time | null, archivedAt?: Time | null, euaUserId?: string | null, hasUiChanges?: boolean | null, usesAiTech?: boolean | null, usingSoftware?: string | null, acquisitionMethods: Array<SystemIntakeSoftwareAcquisitionMethods>, state: SystemIntakeState, decisionState: SystemIntakeDecisionState, trbFollowUpRecommendation?: SystemIntakeTRBFollowUp | null, requestFormState: SystemIntakeFormState, relationType?: RequestRelationType | null, contractName?: string | null, grbReviewType: SystemIntakeGRBReviewType, businessOwner: { __typename: 'SystemIntakeBusinessOwner', component?: string | null, name?: string | null }, contract: { __typename: 'SystemIntakeContract', contractor?: string | null, hasContract?: string | null, vehicle?: string | null, endDate: { __typename: 'ContractDate', day?: string | null, month?: string | null, year?: string | null }, startDate: { __typename: 'ContractDate', day?: string | null, month?: string | null, year?: string | null } }, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', id: UUID, contractNumber: string }>, costs?: { __typename: 'SystemIntakeCosts', isExpectingIncrease?: string | null, expectedIncreaseAmount?: string | null } | null, annualSpending?: { __typename: 'SystemIntakeAnnualSpending', currentAnnualSpending?: string | null, currentAnnualSpendingITPortion?: string | null, plannedYearOneSpending?: string | null, plannedYearOneSpendingITPortion?: string | null } | null, governanceRequestFeedbacks: Array<{ __typename: 'GovernanceRequestFeedback', id: UUID, feedback: HTML, targetForm: GovernanceRequestFeedbackTargetForm, type: GovernanceRequestFeedbackType, createdAt: Time, author?: { __typename: 'UserInfo', commonName: string } | null }>, governanceTeams: { __typename: 'SystemIntakeGovernanceTeam', isPresent?: boolean | null, teams?: Array<{ __typename: 'SystemIntakeCollaborator', acronym: string, collaborator: string, key: string, label: string, name: string }> | null }, isso: { __typename: 'SystemIntakeISSO', isPresent?: boolean | null, name?: string | null }, fundingSources: Array<{ __typename: 'SystemIntakeFundingSource', id: UUID, fundingNumber?: string | null, source?: string | null }>, productManager: { __typename: 'SystemIntakeProductManager', component?: string | null, name?: string | null }, requester: { __typename: 'SystemIntakeRequester', component?: string | null, email?: string | null, name: string }, documents: Array<{ __typename: 'SystemIntakeDocument', id: UUID, fileName: string, version: SystemIntakeDocumentVersion, status: SystemIntakeDocumentStatus, uploadedAt: Time, url?: string | null, canView: boolean, canDelete: boolean, systemIntakeId: UUID, documentType: { __typename: 'SystemIntakeDocumentType', commonType: SystemIntakeDocumentCommonType, otherTypeDescription?: string | null } }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, description?: string | null, acronym?: string | null, businessOwnerOrg?: string | null, businessOwnerRoles: Array<{ __typename: 'CedarRole', objectID: string, assigneeFirstName?: string | null, assigneeLastName?: string | null }> }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }>, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, decisionState: SystemIntakeDecisionState, submittedAt?: Time | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }>, grbPresentationLinks?: { __typename: 'SystemIntakeGRBPresentationLinks', recordingLink?: string | null, recordingPasscode?: string | null, transcriptFileName?: string | null, transcriptFileStatus?: SystemIntakeDocumentStatus | null, transcriptFileURL?: string | null, transcriptLink?: string | null, presentationDeckFileName?: string | null, presentationDeckFileStatus?: SystemIntakeDocumentStatus | null, presentationDeckFileURL?: string | null } | null };

export type SystemIntakeGRBPresentationLinksFragment = { __typename: 'SystemIntakeGRBPresentationLinks', recordingLink?: string | null, recordingPasscode?: string | null, transcriptFileName?: string | null, transcriptFileStatus?: SystemIntakeDocumentStatus | null, transcriptFileURL?: string | null, transcriptLink?: string | null, presentationDeckFileName?: string | null, presentationDeckFileStatus?: SystemIntakeDocumentStatus | null, presentationDeckFileURL?: string | null };

export type SystemIntakeGRBPresentationLinksFragmentFragment = { __typename: 'SystemIntakeGRBPresentationLinks', recordingLink?: string | null, recordingPasscode?: string | null, transcriptFileName?: string | null, transcriptFileStatus?: SystemIntakeDocumentStatus | null, transcriptFileURL?: string | null, transcriptLink?: string | null, presentationDeckFileName?: string | null, presentationDeckFileStatus?: SystemIntakeDocumentStatus | null, presentationDeckFileURL?: string | null };

export type SystemIntakeGRBReviewFragment = { __typename: 'SystemIntake', id: UUID, grbReviewStartedAt?: Time | null, grbReviewType: SystemIntakeGRBReviewType, grbDate?: Time | null, grbReviewAsyncRecordingTime?: Time | null, grbReviewers: Array<{ __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } }>, grbPresentationLinks?: { __typename: 'SystemIntakeGRBPresentationLinks', recordingLink?: string | null, recordingPasscode?: string | null, transcriptFileName?: string | null, transcriptFileStatus?: SystemIntakeDocumentStatus | null, transcriptFileURL?: string | null, transcriptLink?: string | null, presentationDeckFileName?: string | null, presentationDeckFileStatus?: SystemIntakeDocumentStatus | null, presentationDeckFileURL?: string | null } | null, documents: Array<{ __typename: 'SystemIntakeDocument', id: UUID, fileName: string, version: SystemIntakeDocumentVersion, status: SystemIntakeDocumentStatus, uploadedAt: Time, url?: string | null, canView: boolean, canDelete: boolean, systemIntakeId: UUID, documentType: { __typename: 'SystemIntakeDocumentType', commonType: SystemIntakeDocumentCommonType, otherTypeDescription?: string | null } }> };

export type TRBAttendeeFragmentFragment = { __typename: 'TRBRequestAttendee', id: UUID, trbRequestId: UUID, component?: string | null, role?: PersonRole | null, createdAt: Time, userInfo?: { __typename: 'UserInfo', commonName: string, email: EmailAddress, euaUserId: string } | null };

export type TrbRequestFormFieldsFragmentFragment = { __typename: 'TRBRequest', id: UUID, name?: string | null, type: TRBRequestType, state: TRBRequestState, taskStatuses: { __typename: 'TRBTaskStatuses', formStatus: TRBFormStatus, feedbackStatus: TRBFeedbackStatus, consultPrepStatus: TRBConsultPrepStatus, attendConsultStatus: TRBAttendConsultStatus, guidanceLetterStatus: TRBGuidanceLetterStatus }, form: { __typename: 'TRBRequestForm', id: UUID, component?: string | null, needsAssistanceWith?: string | null, hasSolutionInMind?: boolean | null, proposedSolution?: string | null, whereInProcess?: TRBWhereInProcessOption | null, whereInProcessOther?: string | null, hasExpectedStartEndDates?: boolean | null, expectedStartDate?: Time | null, expectedEndDate?: Time | null, collabGroups: Array<TRBCollabGroupOption>, collabDateSecurity?: string | null, collabDateEnterpriseArchitecture?: string | null, collabDateCloud?: string | null, collabDatePrivacyAdvisor?: string | null, collabDateGovernanceReviewBoard?: string | null, collabDateOther?: string | null, collabGroupOther?: string | null, collabGRBConsultRequested?: boolean | null, subjectAreaOptions?: Array<TRBSubjectAreaOption> | null, subjectAreaOptionOther?: string | null, submittedAt?: Time | null, fundingSources?: Array<{ __typename: 'TRBFundingSource', id: UUID, fundingNumber: string, source: string }> | null, systemIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, lcid?: string | null }> }, feedback: Array<{ __typename: 'TRBRequestFeedback', id: UUID, action: TRBFeedbackAction, feedbackMessage: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string } }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }>, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, decisionState: SystemIntakeDecisionState, submittedAt?: Time | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }> };

export type SendFeedbackEmailMutationVariables = Exact<{
  input: SendFeedbackEmailInput;
}>;


export type SendFeedbackEmailMutation = { __typename: 'Mutation', sendFeedbackEmail?: string | null };

export type SendReportAProblemEmailMutationVariables = Exact<{
  input: SendReportAProblemEmailInput;
}>;


export type SendReportAProblemEmailMutation = { __typename: 'Mutation', sendReportAProblemEmail?: string | null };

export type CreateSystemIntakeActionChangeLCIDRetirementDateMutationVariables = Exact<{
  input: SystemIntakeChangeLCIDRetirementDateInput;
}>;


export type CreateSystemIntakeActionChangeLCIDRetirementDateMutation = { __typename: 'Mutation', createSystemIntakeActionChangeLCIDRetirementDate?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, lcid?: string | null } | null } | null };

export type CreateSystemIntakeActionCloseRequestMutationVariables = Exact<{
  input: SystemIntakeCloseRequestInput;
}>;


export type CreateSystemIntakeActionCloseRequestMutation = { __typename: 'Mutation', createSystemIntakeActionCloseRequest?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type CreateSystemIntakeActionConfirmLCIDMutationVariables = Exact<{
  input: SystemIntakeConfirmLCIDInput;
}>;


export type CreateSystemIntakeActionConfirmLCIDMutation = { __typename: 'Mutation', createSystemIntakeActionConfirmLCID?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, lcid?: string | null } | null } | null };

export type CreateSystemIntakeActionExpireLCIDMutationVariables = Exact<{
  input: SystemIntakeExpireLCIDInput;
}>;


export type CreateSystemIntakeActionExpireLCIDMutation = { __typename: 'Mutation', createSystemIntakeActionExpireLCID?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, lcid?: string | null } | null } | null };

export type CreateSystemIntakeActionIssueLCIDMutationVariables = Exact<{
  input: SystemIntakeIssueLCIDInput;
}>;


export type CreateSystemIntakeActionIssueLCIDMutation = { __typename: 'Mutation', createSystemIntakeActionIssueLCID?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, lcid?: string | null } | null } | null };

export type CreateSystemIntakeActionNotITGovRequestMutationVariables = Exact<{
  input: SystemIntakeNotITGovReqInput;
}>;


export type CreateSystemIntakeActionNotITGovRequestMutation = { __typename: 'Mutation', createSystemIntakeActionNotITGovRequest?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type CreateSystemIntakeActionProgressToNewStepMutationVariables = Exact<{
  input: SystemIntakeProgressToNewStepsInput;
}>;


export type CreateSystemIntakeActionProgressToNewStepMutation = { __typename: 'Mutation', createSystemIntakeActionProgressToNewStep?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type CreateSystemIntakeActionRejectIntakeMutationVariables = Exact<{
  input: SystemIntakeRejectIntakeInput;
}>;


export type CreateSystemIntakeActionRejectIntakeMutation = { __typename: 'Mutation', createSystemIntakeActionRejectIntake?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type CreateSystemIntakeActionReopenRequestMutationVariables = Exact<{
  input: SystemIntakeReopenRequestInput;
}>;


export type CreateSystemIntakeActionReopenRequestMutation = { __typename: 'Mutation', createSystemIntakeActionReopenRequest?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type CreateSystemIntakeActionRequestEditsMutationVariables = Exact<{
  input: SystemIntakeRequestEditsInput;
}>;


export type CreateSystemIntakeActionRequestEditsMutation = { __typename: 'Mutation', createSystemIntakeActionRequestEdits?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type CreateSystemIntakeActionRetireLcidMutationVariables = Exact<{
  input: SystemIntakeRetireLCIDInput;
}>;


export type CreateSystemIntakeActionRetireLcidMutation = { __typename: 'Mutation', createSystemIntakeActionRetireLCID?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, lcid?: string | null } | null } | null };

export type CreateSystemIntakeActionUnretireLCIDMutationVariables = Exact<{
  input: SystemIntakeUnretireLCIDInput;
}>;


export type CreateSystemIntakeActionUnretireLCIDMutation = { __typename: 'Mutation', createSystemIntakeActionUnretireLCID?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, lcid?: string | null } | null } | null };

export type CreateSystemIntakeActionUpdateLCIDMutationVariables = Exact<{
  input: SystemIntakeUpdateLCIDInput;
}>;


export type CreateSystemIntakeActionUpdateLCIDMutation = { __typename: 'Mutation', createSystemIntakeActionUpdateLCID?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, lcid?: string | null } | null } | null };

export type GetAdminNotesAndActionsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAdminNotesAndActionsQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, lcid?: string | null, notes: Array<{ __typename: 'SystemIntakeNote', id: UUID, createdAt: Time, content: HTML, modifiedBy?: string | null, modifiedAt?: Time | null, isArchived: boolean, editor?: { __typename: 'UserInfo', commonName: string } | null, author: { __typename: 'SystemIntakeNoteAuthor', name: string, eua: string } }>, actions: Array<{ __typename: 'SystemIntakeAction', id: UUID, createdAt: Time, feedback?: HTML | null, type: SystemIntakeActionType, lcidExpirationChange?: { __typename: 'SystemIntakeLCIDExpirationChange', previousDate: Time, newDate: Time, previousScope?: HTML | null, newScope?: HTML | null, previousNextSteps?: HTML | null, newNextSteps?: HTML | null, previousCostBaseline?: string | null, newCostBaseline?: string | null } | null, actor: { __typename: 'SystemIntakeActionActor', name: string, email: string } }> } | null };

export type GetSystemIntakeContactsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeContactsQuery = { __typename: 'Query', systemIntakeContacts: { __typename: 'SystemIntakeContactsPayload', systemIntakeContacts: Array<{ __typename: 'AugmentedSystemIntakeContact', systemIntakeId: UUID, id: UUID, euaUserId: string, component: string, role: string, commonName?: string | null, email?: EmailAddress | null }> } };

export type CreateSystemIntakeContactMutationVariables = Exact<{
  input: CreateSystemIntakeContactInput;
}>;


export type CreateSystemIntakeContactMutation = { __typename: 'Mutation', createSystemIntakeContact?: { __typename: 'CreateSystemIntakeContactPayload', systemIntakeContact?: { __typename: 'SystemIntakeContact', id: UUID, euaUserId: string, systemIntakeId: UUID, component: string, role: string } | null } | null };

export type UpdateSystemIntakeContactMutationVariables = Exact<{
  input: UpdateSystemIntakeContactInput;
}>;


export type UpdateSystemIntakeContactMutation = { __typename: 'Mutation', updateSystemIntakeContact?: { __typename: 'CreateSystemIntakeContactPayload', systemIntakeContact?: { __typename: 'SystemIntakeContact', id: UUID, euaUserId: string, systemIntakeId: UUID, component: string, role: string } | null } | null };

export type DeleteSystemIntakeContactMutationVariables = Exact<{
  input: DeleteSystemIntakeContactInput;
}>;


export type DeleteSystemIntakeContactMutation = { __typename: 'Mutation', deleteSystemIntakeContact?: { __typename: 'DeleteSystemIntakeContactPayload', systemIntakeContact?: { __typename: 'SystemIntakeContact', id: UUID, euaUserId: string, systemIntakeId: UUID, component: string, role: string } | null } | null };

export type CreateSystemIntakeDocumentMutationVariables = Exact<{
  input: CreateSystemIntakeDocumentInput;
}>;


export type CreateSystemIntakeDocumentMutation = { __typename: 'Mutation', createSystemIntakeDocument?: { __typename: 'CreateSystemIntakeDocumentPayload', document?: { __typename: 'SystemIntakeDocument', id: UUID, fileName: string, version: SystemIntakeDocumentVersion, status: SystemIntakeDocumentStatus, uploadedAt: Time, url?: string | null, canView: boolean, canDelete: boolean, systemIntakeId: UUID, documentType: { __typename: 'SystemIntakeDocumentType', commonType: SystemIntakeDocumentCommonType, otherTypeDescription?: string | null } } | null } | null };

export type DeleteSystemIntakeDocumentMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteSystemIntakeDocumentMutation = { __typename: 'Mutation', deleteSystemIntakeDocument?: { __typename: 'DeleteSystemIntakeDocumentPayload', document?: { __typename: 'SystemIntakeDocument', id: UUID, fileName: string, version: SystemIntakeDocumentVersion, status: SystemIntakeDocumentStatus, uploadedAt: Time, url?: string | null, canView: boolean, canDelete: boolean, systemIntakeId: UUID, documentType: { __typename: 'SystemIntakeDocumentType', commonType: SystemIntakeDocumentCommonType, otherTypeDescription?: string | null } } | null } | null };

export type GetSystemIntakeDocumentUrlsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeDocumentUrlsQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, documents: Array<{ __typename: 'SystemIntakeDocument', id: UUID, url?: string | null, fileName: string }> } | null };

export type CreateSystemIntakeGRBDiscussionPostMutationVariables = Exact<{
  input: CreateSystemIntakeGRBDiscussionPostInput;
}>;


export type CreateSystemIntakeGRBDiscussionPostMutation = { __typename: 'Mutation', createSystemIntakeGRBDiscussionPost?: { __typename: 'SystemIntakeGRBReviewDiscussionPost', id: UUID, content: HTML, votingRole?: SystemIntakeGRBReviewerVotingRole | null, grbRole?: SystemIntakeGRBReviewerRole | null, systemIntakeID: UUID, createdAt: Time, createdByUserAccount: { __typename: 'UserAccount', id: UUID, commonName: string } } | null };

export type CreateSystemIntakeGRBDiscussionReplyMutationVariables = Exact<{
  input: CreateSystemIntakeGRBDiscussionReplyInput;
}>;


export type CreateSystemIntakeGRBDiscussionReplyMutation = { __typename: 'Mutation', createSystemIntakeGRBDiscussionReply?: { __typename: 'SystemIntakeGRBReviewDiscussionPost', id: UUID, content: HTML, votingRole?: SystemIntakeGRBReviewerVotingRole | null, grbRole?: SystemIntakeGRBReviewerRole | null, systemIntakeID: UUID, createdAt: Time, createdByUserAccount: { __typename: 'UserAccount', id: UUID, commonName: string } } | null };

export type CreateSystemIntakeGRBReviewersMutationVariables = Exact<{
  input: CreateSystemIntakeGRBReviewersInput;
}>;


export type CreateSystemIntakeGRBReviewersMutation = { __typename: 'Mutation', createSystemIntakeGRBReviewers?: { __typename: 'CreateSystemIntakeGRBReviewersPayload', reviewers: Array<{ __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } }> } | null };

export type DeleteSystemIntakeGRBPresentationLinksMutationVariables = Exact<{
  input: DeleteSystemIntakeGRBPresentationLinksInput;
}>;


export type DeleteSystemIntakeGRBPresentationLinksMutation = { __typename: 'Mutation', deleteSystemIntakeGRBPresentationLinks: UUID };

export type DeleteSystemIntakeGRBReviewerMutationVariables = Exact<{
  input: DeleteSystemIntakeGRBReviewerInput;
}>;


export type DeleteSystemIntakeGRBReviewerMutation = { __typename: 'Mutation', deleteSystemIntakeGRBReviewer: UUID };

export type GetGRBReviewersComparisonsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetGRBReviewersComparisonsQuery = { __typename: 'Query', compareGRBReviewersByIntakeID: Array<{ __typename: 'GRBReviewerComparisonIntake', id: UUID, requestName: string, reviewers: Array<{ __typename: 'GRBReviewerComparison', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, isCurrentReviewer: boolean, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } }> }> };

export type GetSystemIntakeGRBDiscussionsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeGRBDiscussionsQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, grbDiscussions: Array<{ __typename: 'SystemIntakeGRBReviewDiscussion', initialPost: { __typename: 'SystemIntakeGRBReviewDiscussionPost', id: UUID, content: HTML, votingRole?: SystemIntakeGRBReviewerVotingRole | null, grbRole?: SystemIntakeGRBReviewerRole | null, systemIntakeID: UUID, createdAt: Time, createdByUserAccount: { __typename: 'UserAccount', id: UUID, commonName: string } }, replies: Array<{ __typename: 'SystemIntakeGRBReviewDiscussionPost', id: UUID, content: HTML, votingRole?: SystemIntakeGRBReviewerVotingRole | null, grbRole?: SystemIntakeGRBReviewerRole | null, systemIntakeID: UUID, createdAt: Time, createdByUserAccount: { __typename: 'UserAccount', id: UUID, commonName: string } }> }> } | null };

export type GetSystemIntakeGRBReviewQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeGRBReviewQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, grbReviewStartedAt?: Time | null, grbReviewType: SystemIntakeGRBReviewType, grbDate?: Time | null, grbReviewAsyncRecordingTime?: Time | null, grbReviewers: Array<{ __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } }>, grbPresentationLinks?: { __typename: 'SystemIntakeGRBPresentationLinks', recordingLink?: string | null, recordingPasscode?: string | null, transcriptFileName?: string | null, transcriptFileStatus?: SystemIntakeDocumentStatus | null, transcriptFileURL?: string | null, transcriptLink?: string | null, presentationDeckFileName?: string | null, presentationDeckFileStatus?: SystemIntakeDocumentStatus | null, presentationDeckFileURL?: string | null } | null, documents: Array<{ __typename: 'SystemIntakeDocument', id: UUID, fileName: string, version: SystemIntakeDocumentVersion, status: SystemIntakeDocumentStatus, uploadedAt: Time, url?: string | null, canView: boolean, canDelete: boolean, systemIntakeId: UUID, documentType: { __typename: 'SystemIntakeDocumentType', commonType: SystemIntakeDocumentCommonType, otherTypeDescription?: string | null } }> } | null };

export type SystemIntakeWithReviewRequestedFragment = { __typename: 'SystemIntake', id: UUID, requestName?: string | null, requesterName?: string | null, requesterComponent?: string | null, grbDate?: Time | null };

export type GetSystemIntakesWithReviewRequestedQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemIntakesWithReviewRequestedQuery = { __typename: 'Query', systemIntakesWithReviewRequested: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, requesterName?: string | null, requesterComponent?: string | null, grbDate?: Time | null }> };

export type SendPresentationDeckReminderMutationVariables = Exact<{
  systemIntakeID: Scalars['UUID']['input'];
}>;


export type SendPresentationDeckReminderMutation = { __typename: 'Mutation', sendGRBReviewPresentationDeckReminderEmail: boolean };

export type SetSystemIntakeGRBPresentationLinksMutationVariables = Exact<{
  input: SystemIntakeGRBPresentationLinksInput;
}>;


export type SetSystemIntakeGRBPresentationLinksMutation = { __typename: 'Mutation', setSystemIntakeGRBPresentationLinks?: { __typename: 'SystemIntakeGRBPresentationLinks', createdAt: Time } | null };

export type StartGRBReviewMutationVariables = Exact<{
  input: StartGRBReviewInput;
}>;


export type StartGRBReviewMutation = { __typename: 'Mutation', startGRBReview?: string | null };

export type SystemIntakeGRBReviewDiscussionPostFragment = { __typename: 'SystemIntakeGRBReviewDiscussionPost', id: UUID, content: HTML, votingRole?: SystemIntakeGRBReviewerVotingRole | null, grbRole?: SystemIntakeGRBReviewerRole | null, systemIntakeID: UUID, createdAt: Time, createdByUserAccount: { __typename: 'UserAccount', id: UUID, commonName: string } };

export type SystemIntakeGRBReviewDiscussionFragment = { __typename: 'SystemIntakeGRBReviewDiscussion', initialPost: { __typename: 'SystemIntakeGRBReviewDiscussionPost', id: UUID, content: HTML, votingRole?: SystemIntakeGRBReviewerVotingRole | null, grbRole?: SystemIntakeGRBReviewerRole | null, systemIntakeID: UUID, createdAt: Time, createdByUserAccount: { __typename: 'UserAccount', id: UUID, commonName: string } }, replies: Array<{ __typename: 'SystemIntakeGRBReviewDiscussionPost', id: UUID, content: HTML, votingRole?: SystemIntakeGRBReviewerVotingRole | null, grbRole?: SystemIntakeGRBReviewerRole | null, systemIntakeID: UUID, createdAt: Time, createdByUserAccount: { __typename: 'UserAccount', id: UUID, commonName: string } }> };

export type SystemIntakeGRBReviewerFragment = { __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } };

export type UpdateSystemIntakeGRBReviewTypeMutationVariables = Exact<{
  input: UpdateSystemIntakeGRBReviewTypeInput;
}>;


export type UpdateSystemIntakeGRBReviewTypeMutation = { __typename: 'Mutation', updateSystemIntakeGRBReviewType?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, grbReviewStartedAt?: Time | null, grbReviewType: SystemIntakeGRBReviewType, grbDate?: Time | null, grbReviewAsyncRecordingTime?: Time | null, grbReviewers: Array<{ __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } }>, grbPresentationLinks?: { __typename: 'SystemIntakeGRBPresentationLinks', recordingLink?: string | null, recordingPasscode?: string | null, transcriptFileName?: string | null, transcriptFileStatus?: SystemIntakeDocumentStatus | null, transcriptFileURL?: string | null, transcriptLink?: string | null, presentationDeckFileName?: string | null, presentationDeckFileStatus?: SystemIntakeDocumentStatus | null, presentationDeckFileURL?: string | null } | null, documents: Array<{ __typename: 'SystemIntakeDocument', id: UUID, fileName: string, version: SystemIntakeDocumentVersion, status: SystemIntakeDocumentStatus, uploadedAt: Time, url?: string | null, canView: boolean, canDelete: boolean, systemIntakeId: UUID, documentType: { __typename: 'SystemIntakeDocumentType', commonType: SystemIntakeDocumentCommonType, otherTypeDescription?: string | null } }> } | null } | null };

export type UpdateSystemIntakeGRBReviewerMutationVariables = Exact<{
  input: UpdateSystemIntakeGRBReviewerInput;
}>;


export type UpdateSystemIntakeGRBReviewerMutation = { __typename: 'Mutation', updateSystemIntakeGRBReviewer: { __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } } };

export type UploadSystemIntakeGRBPresentationDeckMutationVariables = Exact<{
  input: UploadSystemIntakeGRBPresentationDeckInput;
}>;


export type UploadSystemIntakeGRBPresentationDeckMutation = { __typename: 'Mutation', uploadSystemIntakeGRBPresentationDeck?: { __typename: 'SystemIntakeGRBPresentationLinks', createdAt: Time } | null };

export type ArchiveSystemIntakeMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type ArchiveSystemIntakeMutation = { __typename: 'Mutation', archiveSystemIntake: { __typename: 'SystemIntake', id: UUID, archivedAt?: Time | null } };

export type CreateSystemIntakeNoteMutationVariables = Exact<{
  input: CreateSystemIntakeNoteInput;
}>;


export type CreateSystemIntakeNoteMutation = { __typename: 'Mutation', createSystemIntakeNote?: { __typename: 'SystemIntakeNote', id: UUID, createdAt: Time, content: HTML, author: { __typename: 'SystemIntakeNoteAuthor', name: string, eua: string } } | null };

export type GetGovernanceRequestFeedbackQueryVariables = Exact<{
  intakeID: Scalars['UUID']['input'];
}>;


export type GetGovernanceRequestFeedbackQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, requestName?: string | null, governanceRequestFeedbacks: Array<{ __typename: 'GovernanceRequestFeedback', id: UUID, feedback: HTML, targetForm: GovernanceRequestFeedbackTargetForm, type: GovernanceRequestFeedbackType, createdAt: Time, author?: { __typename: 'UserInfo', commonName: string } | null }> } | null };

export type GetGovernanceTaskListQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetGovernanceTaskListQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, requestName?: string | null, submittedAt?: Time | null, updatedAt?: Time | null, grtDate?: Time | null, grbDate?: Time | null, grbReviewType: SystemIntakeGRBReviewType, grbReviewStartedAt?: Time | null, grbReviewAsyncEndDate?: Time | null, grbReviewAsyncGRBMeetingTime?: Time | null, step: SystemIntakeStep, state: SystemIntakeState, decisionState: SystemIntakeDecisionState, relationType?: RequestRelationType | null, contractName?: string | null, itGovTaskStatuses: { __typename: 'ITGovTaskStatuses', intakeFormStatus: ITGovIntakeFormStatus, feedbackFromInitialReviewStatus: ITGovFeedbackStatus, bizCaseDraftStatus: ITGovDraftBusinessCaseStatus, grtMeetingStatus: ITGovGRTStatus, bizCaseFinalStatus: ITGovFinalBusinessCaseStatus, grbMeetingStatus: ITGovGRBStatus, decisionAndNextStepsStatus: ITGovDecisionStatus }, governanceRequestFeedbacks: Array<{ __typename: 'GovernanceRequestFeedback', id: UUID, targetForm: GovernanceRequestFeedbackTargetForm }>, businessCase?: { __typename: 'BusinessCase', id: UUID } | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }>, grbPresentationLinks?: { __typename: 'SystemIntakeGRBPresentationLinks', presentationDeckFileName?: string | null, presentationDeckFileStatus?: SystemIntakeDocumentStatus | null, presentationDeckFileURL?: string | null } | null } | null };

export type GetSystemIntakeQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, adminLead?: string | null, businessNeed?: string | null, businessSolution?: string | null, currentStage?: string | null, decisionNextSteps?: HTML | null, grbDate?: Time | null, grtDate?: Time | null, existingFunding?: boolean | null, lcid?: string | null, lcidIssuedAt?: Time | null, lcidExpiresAt?: Time | null, lcidRetiresAt?: Time | null, lcidScope?: HTML | null, lcidCostBaseline?: string | null, lcidStatus?: SystemIntakeLCIDStatus | null, needsEaSupport?: boolean | null, rejectionReason?: HTML | null, requestName?: string | null, requestType: SystemIntakeRequestType, statusAdmin: SystemIntakeStatusAdmin, statusRequester: SystemIntakeStatusRequester, grtReviewEmailBody?: string | null, decidedAt?: Time | null, businessCaseId?: UUID | null, submittedAt?: Time | null, updatedAt?: Time | null, createdAt?: Time | null, archivedAt?: Time | null, euaUserId?: string | null, hasUiChanges?: boolean | null, usesAiTech?: boolean | null, usingSoftware?: string | null, acquisitionMethods: Array<SystemIntakeSoftwareAcquisitionMethods>, state: SystemIntakeState, decisionState: SystemIntakeDecisionState, trbFollowUpRecommendation?: SystemIntakeTRBFollowUp | null, requestFormState: SystemIntakeFormState, relationType?: RequestRelationType | null, contractName?: string | null, grbReviewType: SystemIntakeGRBReviewType, businessOwner: { __typename: 'SystemIntakeBusinessOwner', component?: string | null, name?: string | null }, contract: { __typename: 'SystemIntakeContract', contractor?: string | null, hasContract?: string | null, vehicle?: string | null, endDate: { __typename: 'ContractDate', day?: string | null, month?: string | null, year?: string | null }, startDate: { __typename: 'ContractDate', day?: string | null, month?: string | null, year?: string | null } }, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', id: UUID, contractNumber: string }>, costs?: { __typename: 'SystemIntakeCosts', isExpectingIncrease?: string | null, expectedIncreaseAmount?: string | null } | null, annualSpending?: { __typename: 'SystemIntakeAnnualSpending', currentAnnualSpending?: string | null, currentAnnualSpendingITPortion?: string | null, plannedYearOneSpending?: string | null, plannedYearOneSpendingITPortion?: string | null } | null, governanceRequestFeedbacks: Array<{ __typename: 'GovernanceRequestFeedback', id: UUID, feedback: HTML, targetForm: GovernanceRequestFeedbackTargetForm, type: GovernanceRequestFeedbackType, createdAt: Time, author?: { __typename: 'UserInfo', commonName: string } | null }>, governanceTeams: { __typename: 'SystemIntakeGovernanceTeam', isPresent?: boolean | null, teams?: Array<{ __typename: 'SystemIntakeCollaborator', acronym: string, collaborator: string, key: string, label: string, name: string }> | null }, isso: { __typename: 'SystemIntakeISSO', isPresent?: boolean | null, name?: string | null }, fundingSources: Array<{ __typename: 'SystemIntakeFundingSource', id: UUID, fundingNumber?: string | null, source?: string | null }>, productManager: { __typename: 'SystemIntakeProductManager', component?: string | null, name?: string | null }, requester: { __typename: 'SystemIntakeRequester', component?: string | null, email?: string | null, name: string }, documents: Array<{ __typename: 'SystemIntakeDocument', id: UUID, fileName: string, version: SystemIntakeDocumentVersion, status: SystemIntakeDocumentStatus, uploadedAt: Time, url?: string | null, canView: boolean, canDelete: boolean, systemIntakeId: UUID, documentType: { __typename: 'SystemIntakeDocumentType', commonType: SystemIntakeDocumentCommonType, otherTypeDescription?: string | null } }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, description?: string | null, acronym?: string | null, businessOwnerOrg?: string | null, businessOwnerRoles: Array<{ __typename: 'CedarRole', objectID: string, assigneeFirstName?: string | null, assigneeLastName?: string | null }> }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }>, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, decisionState: SystemIntakeDecisionState, submittedAt?: Time | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }>, grbPresentationLinks?: { __typename: 'SystemIntakeGRBPresentationLinks', recordingLink?: string | null, recordingPasscode?: string | null, transcriptFileName?: string | null, transcriptFileStatus?: SystemIntakeDocumentStatus | null, transcriptFileURL?: string | null, transcriptLink?: string | null, presentationDeckFileName?: string | null, presentationDeckFileStatus?: SystemIntakeDocumentStatus | null, presentationDeckFileURL?: string | null } | null } | null };

export type GetSystemIntakeRelatedRequestsQueryVariables = Exact<{
  systemIntakeID: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeRelatedRequestsQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, statusAdmin: SystemIntakeStatusAdmin, statusRequester: SystemIntakeStatusRequester, submittedAt?: Time | null, lcid?: string | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }> } | null };

export type GetSystemIntakeRelationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeRelationQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, relationType?: RequestRelationType | null, contractName?: string | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> } | null, cedarSystems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> };

export type GetSystemIntakesTableQueryVariables = Exact<{
  openRequests: Scalars['Boolean']['input'];
}>;


export type GetSystemIntakesTableQuery = { __typename: 'Query', systemIntakes: Array<{ __typename: 'SystemIntake', id: UUID, euaUserId?: string | null, requestName?: string | null, statusAdmin: SystemIntakeStatusAdmin, state: SystemIntakeState, requesterName?: string | null, requesterComponent?: string | null, trbCollaboratorName?: string | null, oitSecurityCollaboratorName?: string | null, eaCollaboratorName?: string | null, existingFunding?: boolean | null, contractName?: string | null, businessNeed?: string | null, businessSolution?: string | null, currentStage?: string | null, needsEaSupport?: boolean | null, grtDate?: Time | null, grbDate?: Time | null, lcid?: string | null, lcidScope?: HTML | null, lcidExpiresAt?: Time | null, adminLead?: string | null, hasUiChanges?: boolean | null, usesAiTech?: boolean | null, usingSoftware?: string | null, acquisitionMethods: Array<SystemIntakeSoftwareAcquisitionMethods>, decidedAt?: Time | null, submittedAt?: Time | null, updatedAt?: Time | null, createdAt?: Time | null, archivedAt?: Time | null, businessOwner: { __typename: 'SystemIntakeBusinessOwner', name?: string | null, component?: string | null }, productManager: { __typename: 'SystemIntakeProductManager', name?: string | null, component?: string | null }, isso: { __typename: 'SystemIntakeISSO', name?: string | null }, fundingSources: Array<{ __typename: 'SystemIntakeFundingSource', id: UUID, fundingNumber?: string | null, source?: string | null }>, annualSpending?: { __typename: 'SystemIntakeAnnualSpending', currentAnnualSpending?: string | null, currentAnnualSpendingITPortion?: string | null, plannedYearOneSpending?: string | null, plannedYearOneSpendingITPortion?: string | null } | null, contract: { __typename: 'SystemIntakeContract', hasContract?: string | null, contractor?: string | null, vehicle?: string | null, startDate: { __typename: 'ContractDate', day?: string | null, month?: string | null, year?: string | null }, endDate: { __typename: 'ContractDate', day?: string | null, month?: string | null, year?: string | null } }, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string }>, notes: Array<{ __typename: 'SystemIntakeNote', id: UUID, createdAt: Time, content: HTML }>, actions: Array<{ __typename: 'SystemIntakeAction', id: UUID, createdAt: Time }> }> };

export type GetSystemsQueryVariables = Exact<{
  openRequests: Scalars['Boolean']['input'];
}>;


export type GetSystemsQuery = { __typename: 'Query', systemIntakes: Array<{ __typename: 'SystemIntake', id: UUID, lcid?: string | null, businessOwner: { __typename: 'SystemIntakeBusinessOwner', name?: string | null, component?: string | null } }> };

export type SetSystemIntakeRelationNewSystemMutationVariables = Exact<{
  input: SetSystemIntakeRelationNewSystemInput;
}>;


export type SetSystemIntakeRelationNewSystemMutation = { __typename: 'Mutation', setSystemIntakeRelationNewSystem?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type SetSystemIntakeRelationExistingSystemMutationVariables = Exact<{
  input: SetSystemIntakeRelationExistingSystemInput;
}>;


export type SetSystemIntakeRelationExistingSystemMutation = { __typename: 'Mutation', setSystemIntakeRelationExistingSystem?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type SetSystemIntakeRelationExistingServiceMutationVariables = Exact<{
  input: SetSystemIntakeRelationExistingServiceInput;
}>;


export type SetSystemIntakeRelationExistingServiceMutation = { __typename: 'Mutation', setSystemIntakeRelationExistingService?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type UnlinkSystemIntakeRelationMutationVariables = Exact<{
  intakeID: Scalars['UUID']['input'];
}>;


export type UnlinkSystemIntakeRelationMutation = { __typename: 'Mutation', unlinkSystemIntakeRelation?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type SetTrbRequestRelationNewSystemMutationVariables = Exact<{
  input: SetTRBRequestRelationNewSystemInput;
}>;


export type SetTrbRequestRelationNewSystemMutation = { __typename: 'Mutation', setTRBRequestRelationNewSystem?: { __typename: 'TRBRequest', id: UUID } | null };

export type SetTrbRequestRelationExistingSystemMutationVariables = Exact<{
  input: SetTRBRequestRelationExistingSystemInput;
}>;


export type SetTrbRequestRelationExistingSystemMutation = { __typename: 'Mutation', setTRBRequestRelationExistingSystem?: { __typename: 'TRBRequest', id: UUID } | null };

export type SetTrbRequestRelationExistingServiceMutationVariables = Exact<{
  input: SetTRBRequestRelationExistingServiceInput;
}>;


export type SetTrbRequestRelationExistingServiceMutation = { __typename: 'Mutation', setTRBRequestRelationExistingService?: { __typename: 'TRBRequest', id: UUID } | null };

export type UnlinkTrbRequestRelationMutationVariables = Exact<{
  trbRequestID: Scalars['UUID']['input'];
}>;


export type UnlinkTrbRequestRelationMutation = { __typename: 'Mutation', unlinkTRBRequestRelation?: { __typename: 'TRBRequest', id: UUID } | null };

export type CreateSystemIntakeMutationVariables = Exact<{
  input: CreateSystemIntakeInput;
}>;


export type CreateSystemIntakeMutation = { __typename: 'Mutation', createSystemIntake?: { __typename: 'SystemIntake', id: UUID, requestType: SystemIntakeRequestType, requester: { __typename: 'SystemIntakeRequester', name: string } } | null };

export type UpdateSystemIntakeContractDetailsMutationVariables = Exact<{
  input: UpdateSystemIntakeContractDetailsInput;
}>;


export type UpdateSystemIntakeContractDetailsMutation = { __typename: 'Mutation', updateSystemIntakeContractDetails?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, currentStage?: string | null, fundingSources: Array<{ __typename: 'SystemIntakeFundingSource', id: UUID, fundingNumber?: string | null, source?: string | null }>, costs?: { __typename: 'SystemIntakeCosts', expectedIncreaseAmount?: string | null } | null, annualSpending?: { __typename: 'SystemIntakeAnnualSpending', currentAnnualSpending?: string | null, currentAnnualSpendingITPortion?: string | null, plannedYearOneSpending?: string | null, plannedYearOneSpendingITPortion?: string | null } | null, contract: { __typename: 'SystemIntakeContract', contractor?: string | null, hasContract?: string | null, endDate: { __typename: 'ContractDate', day?: string | null, month?: string | null, year?: string | null }, startDate: { __typename: 'ContractDate', day?: string | null, month?: string | null, year?: string | null } }, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', id: UUID, systemIntakeID: UUID, contractNumber: string }> } | null } | null };

export type UpdateSystemIntakeRequestDetailsMutationVariables = Exact<{
  input: UpdateSystemIntakeRequestDetailsInput;
}>;


export type UpdateSystemIntakeRequestDetailsMutation = { __typename: 'Mutation', updateSystemIntakeRequestDetails?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, requestName?: string | null, businessNeed?: string | null, businessSolution?: string | null, needsEaSupport?: boolean | null, hasUiChanges?: boolean | null, usesAiTech?: boolean | null, usingSoftware?: string | null, acquisitionMethods: Array<SystemIntakeSoftwareAcquisitionMethods> } | null } | null };

export type UpdateSystemIntakeContactDetailsMutationVariables = Exact<{
  input: UpdateSystemIntakeContactDetailsInput;
}>;


export type UpdateSystemIntakeContactDetailsMutation = { __typename: 'Mutation', updateSystemIntakeContactDetails?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, businessOwner: { __typename: 'SystemIntakeBusinessOwner', component?: string | null, name?: string | null }, governanceTeams: { __typename: 'SystemIntakeGovernanceTeam', isPresent?: boolean | null, teams?: Array<{ __typename: 'SystemIntakeCollaborator', acronym: string, collaborator: string, key: string, label: string, name: string }> | null }, isso: { __typename: 'SystemIntakeISSO', isPresent?: boolean | null, name?: string | null }, productManager: { __typename: 'SystemIntakeProductManager', component?: string | null, name?: string | null }, requester: { __typename: 'SystemIntakeRequester', component?: string | null, name: string } } | null } | null };

export type UpdateSystemIntakeRequestTypeMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  requestType: SystemIntakeRequestType;
}>;


export type UpdateSystemIntakeRequestTypeMutation = { __typename: 'Mutation', updateSystemIntakeRequestType: { __typename: 'SystemIntake', id: UUID } };

export type SubmitIntakeMutationVariables = Exact<{
  input: SubmitIntakeInput;
}>;


export type SubmitIntakeMutation = { __typename: 'Mutation', submitIntake?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID } | null } | null };

export type UpdateSystemIntakeAdminLeadMutationVariables = Exact<{
  input: UpdateSystemIntakeAdminLeadInput;
}>;


export type UpdateSystemIntakeAdminLeadMutation = { __typename: 'Mutation', updateSystemIntakeAdminLead?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', adminLead?: string | null, id: UUID } | null } | null };

export type UpdateSystemIntakeNoteMutationVariables = Exact<{
  input: UpdateSystemIntakeNoteInput;
}>;


export type UpdateSystemIntakeNoteMutation = { __typename: 'Mutation', updateSystemIntakeNote: { __typename: 'SystemIntakeNote', id: UUID, content: HTML } };

export type UpdateSystemIntakeReviewDatesMutationVariables = Exact<{
  input: UpdateSystemIntakeReviewDatesInput;
}>;


export type UpdateSystemIntakeReviewDatesMutation = { __typename: 'Mutation', updateSystemIntakeReviewDates?: { __typename: 'UpdateSystemIntakePayload', systemIntake?: { __typename: 'SystemIntake', id: UUID, grbDate?: Time | null, grtDate?: Time | null } | null } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename: 'Query', currentUser?: { __typename: 'CurrentUser', launchDarkly: { __typename: 'LaunchDarklySettings', userKey: string, signedHash: string } } | null };

export type GetLinkedRequestsQueryVariables = Exact<{
  cedarSystemId: Scalars['String']['input'];
  systemIntakeState: SystemIntakeState;
  trbRequestState: TRBRequestState;
}>;


export type GetLinkedRequestsQuery = { __typename: 'Query', cedarSystemDetails?: { __typename: 'CedarSystemDetails', cedarSystem: { __typename: 'CedarSystem', id: string, linkedSystemIntakes: Array<{ __typename: 'SystemIntake', id: UUID, submittedAt?: Time | null, lcid?: string | null, requesterName?: string | null, nextMeetingDate?: Time | null, lastMeetingDate?: Time | null, name?: string | null, status: SystemIntakeStatusRequester }>, linkedTrbRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, state: TRBRequestState, nextMeetingDate?: Time | null, lastMeetingDate?: Time | null, form: { __typename: 'TRBRequestForm', submittedAt?: Time | null }, requesterInfo: { __typename: 'UserInfo', commonName: string } }> } } | null };

export type GetRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRequestsQuery = { __typename: 'Query', mySystemIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, submittedAt?: Time | null, statusRequester: SystemIntakeStatusRequester, statusAdmin: SystemIntakeStatusAdmin, grbDate?: Time | null, grtDate?: Time | null, lcid?: string | null, nextMeetingDate?: Time | null, lastMeetingDate?: Time | null, systems: Array<{ __typename: 'CedarSystem', id: string, name: string }> }>, myTrbRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, lastMeetingDate?: Time | null, submittedAt: Time, nextMeetingDate?: Time | null, systems: Array<{ __typename: 'CedarSystem', id: string, name: string }> }> };

export type GetCedarRoleTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCedarRoleTypesQuery = { __typename: 'Query', roleTypes: Array<{ __typename: 'CedarRoleType', id: string, name: string, description?: string | null }> };

export type SetRolesForUserOnSystemMutationVariables = Exact<{
  input: SetRolesForUserOnSystemInput;
}>;


export type SetRolesForUserOnSystemMutation = { __typename: 'Mutation', setRolesForUserOnSystem?: string | null };

export type CreateCedarSystemBookmarkMutationVariables = Exact<{
  input: CreateCedarSystemBookmarkInput;
}>;


export type CreateCedarSystemBookmarkMutation = { __typename: 'Mutation', createCedarSystemBookmark?: { __typename: 'CreateCedarSystemBookmarkPayload', cedarSystemBookmark?: { __typename: 'CedarSystemBookmark', cedarSystemId: string } | null } | null };

export type DeleteCedarSystemBookmarkMutationVariables = Exact<{
  input: CreateCedarSystemBookmarkInput;
}>;


export type DeleteCedarSystemBookmarkMutation = { __typename: 'Mutation', deleteCedarSystemBookmark?: { __typename: 'DeleteCedarSystemBookmarkPayload', cedarSystemId: string } | null };

export type GetCedarContactsQueryVariables = Exact<{
  commonName: Scalars['String']['input'];
}>;


export type GetCedarContactsQuery = { __typename: 'Query', cedarPersonsByCommonName: Array<{ __typename: 'UserInfo', commonName: string, email: EmailAddress, euaUserId: string }> };

export type GetCedarSubSystemsQueryVariables = Exact<{
  cedarSystemId: Scalars['String']['input'];
}>;


export type GetCedarSubSystemsQuery = { __typename: 'Query', cedarSubSystems: Array<{ __typename: 'CedarSubSystem', id: string, name: string, acronym?: string | null, description?: string | null }> };

export type GetCedarSystemQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCedarSystemQuery = { __typename: 'Query', cedarSystem?: { __typename: 'CedarSystem', id: string, name: string, description?: string | null, acronym?: string | null, status?: string | null, businessOwnerOrg?: string | null, businessOwnerOrgComp?: string | null, systemMaintainerOrg?: string | null, systemMaintainerOrgComp?: string | null, isBookmarked: boolean } | null };

export type GetCedarSystemIDsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCedarSystemIDsQuery = { __typename: 'Query', cedarSystems: Array<{ __typename: 'CedarSystem', id: string, name: string }> };

export type GetCedarSystemIsBookmarkedQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCedarSystemIsBookmarkedQuery = { __typename: 'Query', cedarSystem?: { __typename: 'CedarSystem', id: string, isBookmarked: boolean } | null };

export type GetCedarSystemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCedarSystemsQuery = { __typename: 'Query', cedarSystems: Array<{ __typename: 'CedarSystem', id: string, name: string, description?: string | null, acronym?: string | null, status?: string | null, businessOwnerOrg?: string | null, businessOwnerOrgComp?: string | null, systemMaintainerOrg?: string | null, systemMaintainerOrgComp?: string | null, isBookmarked: boolean, atoExpirationDate?: Time | null, linkedTrbRequests: Array<{ __typename: 'TRBRequest', id: UUID }>, linkedSystemIntakes: Array<{ __typename: 'SystemIntake', id: UUID }> }> };

export type GetMyCedarSystemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCedarSystemsQuery = { __typename: 'Query', myCedarSystems: Array<{ __typename: 'CedarSystem', id: string, name: string, description?: string | null, acronym?: string | null, status?: string | null, businessOwnerOrg?: string | null, businessOwnerOrgComp?: string | null, systemMaintainerOrg?: string | null, systemMaintainerOrgComp?: string | null, isBookmarked: boolean, atoExpirationDate?: Time | null, linkedSystemIntakes: Array<{ __typename: 'SystemIntake', id: UUID }>, linkedTrbRequests: Array<{ __typename: 'TRBRequest', id: UUID }> }> };

export type GetSystemIntakesWithLCIDSQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemIntakesWithLCIDSQuery = { __typename: 'Query', systemIntakesWithLcids: Array<{ __typename: 'SystemIntake', id: UUID, lcid?: string | null, requestName?: string | null, lcidExpiresAt?: Time | null, lcidScope?: HTML | null, decisionNextSteps?: HTML | null, trbFollowUpRecommendation?: SystemIntakeTRBFollowUp | null, lcidCostBaseline?: string | null }> };

export type GetSystemProfileQueryVariables = Exact<{
  cedarSystemId: Scalars['String']['input'];
}>;


export type GetSystemProfileQuery = { __typename: 'Query', cedarAuthorityToOperate: Array<{ __typename: 'CedarAuthorityToOperate', uuid: string, actualDispositionDate?: Time | null, containsPersonallyIdentifiableInformation?: boolean | null, countOfTotalNonPrivilegedUserPopulation: number, countOfOpenPoams: number, countOfTotalPrivilegedUserPopulation: number, dateAuthorizationMemoExpires?: Time | null, dateAuthorizationMemoSigned?: Time | null, eAuthenticationLevel?: string | null, fips199OverallImpactRating?: number | null, fismaSystemAcronym?: string | null, fismaSystemName?: string | null, isAccessedByNonOrganizationalUsers?: boolean | null, isPiiLimitedToUserNameAndPass?: boolean | null, isProtectedHealthInformation?: boolean | null, lastActScaDate?: Time | null, lastAssessmentDate?: Time | null, lastContingencyPlanCompletionDate?: Time | null, lastPenTestDate?: Time | null, piaCompletionDate?: Time | null, primaryCyberRiskAdvisor?: string | null, privacySubjectMatterExpert?: string | null, recoveryPointObjective?: number | null, recoveryTimeObjective?: number | null, systemOfRecordsNotice: Array<string>, tlcPhase?: string | null }>, exchanges: Array<{ __typename: 'CedarExchange', connectionFrequency: Array<string>, containsHealthDisparityData?: boolean | null, containsPhi?: boolean | null, dataExchangeAgreement?: string | null, exchangeDescription?: string | null, exchangeDirection?: ExchangeDirection | null, exchangeId?: string | null, exchangeName?: string | null, numOfRecords?: string | null, sharedViaApi?: boolean | null }>, cedarBudget?: Array<{ __typename: 'CedarBudget', fiscalYear?: string | null, funding?: string | null, fundingId?: string | null, fundingSource?: string | null, id?: string | null, name?: string | null, projectId: string, projectTitle?: string | null, systemId?: string | null }> | null, cedarBudgetSystemCost?: { __typename: 'CedarBudgetSystemCost', budgetActualCost: Array<{ __typename: 'CedarBudgetActualCost', actualSystemCost?: string | null, fiscalYear?: string | null, systemId?: string | null }> } | null, cedarThreat: Array<{ __typename: 'CedarThreat', daysOpen?: number | null, weaknessRiskLevel?: string | null }>, cedarSoftwareProducts?: { __typename: 'CedarSoftwareProducts', aiSolnCatg: Array<string | null>, aiSolnCatgOther?: string | null, apiDataArea: Array<string | null>, apiDescPubLocation?: string | null, apiDescPublished?: string | null, apiFHIRUse?: string | null, apiFHIRUseOther?: string | null, apiHasPortal?: boolean | null, apisAccessibility?: string | null, apisDeveloped?: string | null, developmentStage?: string | null, systemHasAPIGateway?: boolean | null, usesAiTech?: string | null, softwareProducts: Array<{ __typename: 'CedarSoftwareProductItem', apiGatewayUse?: boolean | null, elaPurchase?: string | null, elaVendorId?: string | null, providesAiCapability?: boolean | null, refstr?: string | null, softwareCatagoryConnectionGuid?: string | null, softwareVendorConnectionGuid?: string | null, softwareCost?: string | null, softwareElaOrganization?: string | null, softwareName?: string | null, systemSoftwareConnectionGuid?: string | null, technopediaCategory?: string | null, technopediaID?: string | null, vendorName?: string | null }> } | null, cedarContractsBySystem: Array<{ __typename: 'CedarContract', systemID?: string | null, startDate?: Time | null, endDate?: Time | null, contractNumber?: string | null, contractName?: string | null, description?: string | null, orderNumber?: string | null, serviceProvided?: string | null, isDeliveryOrg?: boolean | null }>, cedarSystemDetails?: { __typename: 'CedarSystemDetails', isMySystem?: boolean | null, businessOwnerInformation: { __typename: 'CedarBusinessOwnerInformation', isCmsOwned?: boolean | null, numberOfContractorFte?: string | null, numberOfFederalFte?: string | null, numberOfSupportedUsersPerMonth?: string | null, storesBeneficiaryAddress?: boolean | null, storesBankingData?: boolean | null }, cedarSystem: { __typename: 'CedarSystem', id: string, isBookmarked: boolean, name: string, description?: string | null, acronym?: string | null, status?: string | null, businessOwnerOrg?: string | null, businessOwnerOrgComp?: string | null, systemMaintainerOrg?: string | null, systemMaintainerOrgComp?: string | null, uuid?: string | null }, deployments: Array<{ __typename: 'CedarDeployment', id: string, startDate?: Time | null, deploymentType?: string | null, name: string, dataCenter?: { __typename: 'CedarDataCenter', name?: string | null } | null }>, roles: Array<{ __typename: 'CedarRole', application: string, objectID: string, roleTypeID: string, assigneeType?: CedarAssigneeType | null, assigneeUsername?: string | null, assigneeEmail?: string | null, assigneeOrgID?: string | null, assigneeOrgName?: string | null, assigneeFirstName?: string | null, assigneeLastName?: string | null, roleTypeName?: string | null, roleID?: string | null }>, urls: Array<{ __typename: 'CedarURL', id: string, address?: string | null, isAPIEndpoint?: boolean | null, isBehindWebApplicationFirewall?: boolean | null, isVersionCodeRepository?: boolean | null, urlHostingEnv?: string | null }>, systemMaintainerInformation: { __typename: 'CedarSystemMaintainerInformation', agileUsed?: boolean | null, deploymentFrequency?: string | null, devCompletionPercent?: string | null, devWorkDescription?: string | null, ecapParticipation?: boolean | null, frontendAccessType?: string | null, hardCodedIPAddress?: boolean | null, ip6EnabledAssetPercent?: string | null, ip6TransitionPlan?: string | null, ipEnabledAssetCount?: number | null, netAccessibility?: string | null, plansToRetireReplace?: string | null, quarterToRetireReplace?: string | null, systemCustomization?: string | null, yearToRetireReplace?: string | null } } | null, cedarSubSystems: Array<{ __typename: 'CedarSubSystem', id: string, name: string, acronym?: string | null, description?: string | null }> };

export type GetSystemWorkspaceQueryVariables = Exact<{
  cedarSystemId: Scalars['String']['input'];
}>;


export type GetSystemWorkspaceQuery = { __typename: 'Query', cedarAuthorityToOperate: Array<{ __typename: 'CedarAuthorityToOperate', uuid: string, tlcPhase?: string | null, dateAuthorizationMemoExpires?: Time | null, countOfOpenPoams: number, lastAssessmentDate?: Time | null }>, cedarSystemDetails?: { __typename: 'CedarSystemDetails', isMySystem?: boolean | null, cedarSystem: { __typename: 'CedarSystem', id: string, name: string, isBookmarked: boolean, linkedTrbRequests: Array<{ __typename: 'TRBRequest', id: UUID }>, linkedSystemIntakes: Array<{ __typename: 'SystemIntake', id: UUID }> }, roles: Array<{ __typename: 'CedarRole', application: string, objectID: string, roleTypeID: string, assigneeType?: CedarAssigneeType | null, assigneeUsername?: string | null, assigneeEmail?: string | null, assigneeOrgID?: string | null, assigneeOrgName?: string | null, assigneeFirstName?: string | null, assigneeLastName?: string | null, roleTypeName?: string | null, roleID?: string | null }> } | null };

export type GetTRBAdminHomeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTRBAdminHomeQuery = { __typename: 'Query', trbRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, type: TRBRequestType, isRecent: boolean, status: TRBRequestStatus, state: TRBRequestState, consultMeetingTime?: Time | null, requesterComponent?: string | null, contractName?: string | null, trbLeadInfo: { __typename: 'UserInfo', commonName: string }, requesterInfo: { __typename: 'UserInfo', commonName: string }, taskStatuses: { __typename: 'TRBTaskStatuses', formStatus: TRBFormStatus, feedbackStatus: TRBFeedbackStatus, consultPrepStatus: TRBConsultPrepStatus, attendConsultStatus: TRBAttendConsultStatus, guidanceLetterStatus: TRBGuidanceLetterStatus }, form: { __typename: 'TRBRequestForm', submittedAt?: Time | null }, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string }> }> };

export type CreateTRBAdminNoteConsultSessionMutationVariables = Exact<{
  input: CreateTRBAdminNoteConsultSessionInput;
}>;


export type CreateTRBAdminNoteConsultSessionMutation = { __typename: 'Mutation', createTRBAdminNoteConsultSession: { __typename: 'TRBAdminNote', id: UUID, isArchived: boolean, category: TRBAdminNoteCategory, noteText: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string }, categorySpecificData: { __typename: 'TRBAdminNoteConsultSessionCategoryData' } | { __typename: 'TRBAdminNoteGeneralRequestCategoryData' } | { __typename: 'TRBAdminNoteGuidanceLetterCategoryData', appliesToMeetingSummary: boolean, appliesToNextSteps: boolean, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, deletedAt?: Time | null }> } | { __typename: 'TRBAdminNoteInitialRequestFormCategoryData', appliesToBasicRequestDetails: boolean, appliesToSubjectAreas: boolean, appliesToAttendees: boolean } | { __typename: 'TRBAdminNoteSupportingDocumentsCategoryData', documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, deletedAt?: Time | null }> } } };

export type CreateTRBAdminNoteGeneralRequestMutationVariables = Exact<{
  input: CreateTRBAdminNoteGeneralRequestInput;
}>;


export type CreateTRBAdminNoteGeneralRequestMutation = { __typename: 'Mutation', createTRBAdminNoteGeneralRequest: { __typename: 'TRBAdminNote', id: UUID, isArchived: boolean, category: TRBAdminNoteCategory, noteText: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string }, categorySpecificData: { __typename: 'TRBAdminNoteConsultSessionCategoryData' } | { __typename: 'TRBAdminNoteGeneralRequestCategoryData' } | { __typename: 'TRBAdminNoteGuidanceLetterCategoryData', appliesToMeetingSummary: boolean, appliesToNextSteps: boolean, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, deletedAt?: Time | null }> } | { __typename: 'TRBAdminNoteInitialRequestFormCategoryData', appliesToBasicRequestDetails: boolean, appliesToSubjectAreas: boolean, appliesToAttendees: boolean } | { __typename: 'TRBAdminNoteSupportingDocumentsCategoryData', documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, deletedAt?: Time | null }> } } };

export type CreateTRBAdminNoteGuidanceLetterMutationVariables = Exact<{
  input: CreateTRBAdminNoteGuidanceLetterInput;
}>;


export type CreateTRBAdminNoteGuidanceLetterMutation = { __typename: 'Mutation', createTRBAdminNoteGuidanceLetter: { __typename: 'TRBAdminNote', id: UUID, isArchived: boolean, category: TRBAdminNoteCategory, noteText: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string }, categorySpecificData: { __typename: 'TRBAdminNoteConsultSessionCategoryData' } | { __typename: 'TRBAdminNoteGeneralRequestCategoryData' } | { __typename: 'TRBAdminNoteGuidanceLetterCategoryData', appliesToMeetingSummary: boolean, appliesToNextSteps: boolean, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, deletedAt?: Time | null }> } | { __typename: 'TRBAdminNoteInitialRequestFormCategoryData', appliesToBasicRequestDetails: boolean, appliesToSubjectAreas: boolean, appliesToAttendees: boolean } | { __typename: 'TRBAdminNoteSupportingDocumentsCategoryData', documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, deletedAt?: Time | null }> } } };

export type CreateTRBAdminNoteInitialRequestFormMutationVariables = Exact<{
  input: CreateTRBAdminNoteInitialRequestFormInput;
}>;


export type CreateTRBAdminNoteInitialRequestFormMutation = { __typename: 'Mutation', createTRBAdminNoteInitialRequestForm: { __typename: 'TRBAdminNote', id: UUID, isArchived: boolean, category: TRBAdminNoteCategory, noteText: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string }, categorySpecificData: { __typename: 'TRBAdminNoteConsultSessionCategoryData' } | { __typename: 'TRBAdminNoteGeneralRequestCategoryData' } | { __typename: 'TRBAdminNoteGuidanceLetterCategoryData', appliesToMeetingSummary: boolean, appliesToNextSteps: boolean, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, deletedAt?: Time | null }> } | { __typename: 'TRBAdminNoteInitialRequestFormCategoryData', appliesToBasicRequestDetails: boolean, appliesToSubjectAreas: boolean, appliesToAttendees: boolean } | { __typename: 'TRBAdminNoteSupportingDocumentsCategoryData', documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, deletedAt?: Time | null }> } } };

export type CreateTRBAdminNoteSupportingDocumentsMutationVariables = Exact<{
  input: CreateTRBAdminNoteSupportingDocumentsInput;
}>;


export type CreateTRBAdminNoteSupportingDocumentsMutation = { __typename: 'Mutation', createTRBAdminNoteSupportingDocuments: { __typename: 'TRBAdminNote', id: UUID, isArchived: boolean, category: TRBAdminNoteCategory, noteText: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string }, categorySpecificData: { __typename: 'TRBAdminNoteConsultSessionCategoryData' } | { __typename: 'TRBAdminNoteGeneralRequestCategoryData' } | { __typename: 'TRBAdminNoteGuidanceLetterCategoryData', appliesToMeetingSummary: boolean, appliesToNextSteps: boolean, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, deletedAt?: Time | null }> } | { __typename: 'TRBAdminNoteInitialRequestFormCategoryData', appliesToBasicRequestDetails: boolean, appliesToSubjectAreas: boolean, appliesToAttendees: boolean } | { __typename: 'TRBAdminNoteSupportingDocumentsCategoryData', documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, deletedAt?: Time | null }> } } };

export type GetTRBAdminNotesQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBAdminNotesQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, adminNotes: Array<{ __typename: 'TRBAdminNote', id: UUID, isArchived: boolean, category: TRBAdminNoteCategory, noteText: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string }, categorySpecificData: { __typename: 'TRBAdminNoteConsultSessionCategoryData' } | { __typename: 'TRBAdminNoteGeneralRequestCategoryData' } | { __typename: 'TRBAdminNoteGuidanceLetterCategoryData', appliesToMeetingSummary: boolean, appliesToNextSteps: boolean, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, deletedAt?: Time | null }> } | { __typename: 'TRBAdminNoteInitialRequestFormCategoryData', appliesToBasicRequestDetails: boolean, appliesToSubjectAreas: boolean, appliesToAttendees: boolean } | { __typename: 'TRBAdminNoteSupportingDocumentsCategoryData', documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, deletedAt?: Time | null }> } }> } };

export type TRBAdminNoteInitialRequestFormCategoryDataFragment = { __typename: 'TRBAdminNoteInitialRequestFormCategoryData', appliesToBasicRequestDetails: boolean, appliesToSubjectAreas: boolean, appliesToAttendees: boolean };

export type TRBAdminNoteSupportingDocumentsCategoryDataFragment = { __typename: 'TRBAdminNoteSupportingDocumentsCategoryData', documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, deletedAt?: Time | null }> };

export type TRBAdminNoteGuidanceLetterCategoryDataFragment = { __typename: 'TRBAdminNoteGuidanceLetterCategoryData', appliesToMeetingSummary: boolean, appliesToNextSteps: boolean, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, deletedAt?: Time | null }> };

export type TRBAdminNoteFragment = { __typename: 'TRBAdminNote', id: UUID, isArchived: boolean, category: TRBAdminNoteCategory, noteText: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string }, categorySpecificData: { __typename: 'TRBAdminNoteConsultSessionCategoryData' } | { __typename: 'TRBAdminNoteGeneralRequestCategoryData' } | { __typename: 'TRBAdminNoteGuidanceLetterCategoryData', appliesToMeetingSummary: boolean, appliesToNextSteps: boolean, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, deletedAt?: Time | null }> } | { __typename: 'TRBAdminNoteInitialRequestFormCategoryData', appliesToBasicRequestDetails: boolean, appliesToSubjectAreas: boolean, appliesToAttendees: boolean } | { __typename: 'TRBAdminNoteSupportingDocumentsCategoryData', documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, deletedAt?: Time | null }> } };

export type CreateTRBRequestAttendeeMutationVariables = Exact<{
  input: CreateTRBRequestAttendeeInput;
}>;


export type CreateTRBRequestAttendeeMutation = { __typename: 'Mutation', createTRBRequestAttendee: { __typename: 'TRBRequestAttendee', id: UUID, trbRequestId: UUID, component?: string | null, role?: PersonRole | null, createdAt: Time, userInfo?: { __typename: 'UserInfo', commonName: string, email: EmailAddress, euaUserId: string } | null } };

export type DeleteTRBRequestAttendeeMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteTRBRequestAttendeeMutation = { __typename: 'Mutation', deleteTRBRequestAttendee: { __typename: 'TRBRequestAttendee', id: UUID, trbRequestId: UUID, component?: string | null, role?: PersonRole | null, createdAt: Time, userInfo?: { __typename: 'UserInfo', commonName: string, email: EmailAddress, euaUserId: string } | null } };

export type GetTRBRequestAttendeesQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestAttendeesQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, attendees: Array<{ __typename: 'TRBRequestAttendee', id: UUID, trbRequestId: UUID, component?: string | null, role?: PersonRole | null, createdAt: Time, userInfo?: { __typename: 'UserInfo', commonName: string, email: EmailAddress, euaUserId: string } | null }> } };

export type UpdateTRBRequestAttendeeMutationVariables = Exact<{
  input: UpdateTRBRequestAttendeeInput;
}>;


export type UpdateTRBRequestAttendeeMutation = { __typename: 'Mutation', updateTRBRequestAttendee: { __typename: 'TRBRequestAttendee', id: UUID, trbRequestId: UUID, component?: string | null, role?: PersonRole | null, createdAt: Time, userInfo?: { __typename: 'UserInfo', commonName: string, email: EmailAddress, euaUserId: string } | null } };

export type CreateTRBGuidanceLetterMutationVariables = Exact<{
  trbRequestId: Scalars['UUID']['input'];
}>;


export type CreateTRBGuidanceLetterMutation = { __typename: 'Mutation', createTRBGuidanceLetter: { __typename: 'TRBGuidanceLetter', id: UUID, meetingSummary?: HTML | null, nextSteps?: HTML | null, isFollowupRecommended?: boolean | null, dateSent?: Time | null, followupPoint?: string | null, createdAt: Time, modifiedAt?: Time | null, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> }>, author: { __typename: 'UserInfo', euaUserId: string, commonName: string } } };

export type CreateTRBGuidanceLetterInsightMutationVariables = Exact<{
  input: CreateTRBGuidanceLetterInsightInput;
}>;


export type CreateTRBGuidanceLetterInsightMutation = { __typename: 'Mutation', createTRBGuidanceLetterInsight: { __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> } };

export type DeleteTRBGuidanceLetterInsightMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteTRBGuidanceLetterInsightMutation = { __typename: 'Mutation', deleteTRBGuidanceLetterInsight: { __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> } };

export type GetTRBGuidanceLetterQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBGuidanceLetterQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, name?: string | null, type: TRBRequestType, createdAt: Time, consultMeetingTime?: Time | null, taskStatuses: { __typename: 'TRBTaskStatuses', guidanceLetterStatus: TRBGuidanceLetterStatus }, guidanceLetter?: { __typename: 'TRBGuidanceLetter', id: UUID, meetingSummary?: HTML | null, nextSteps?: HTML | null, isFollowupRecommended?: boolean | null, dateSent?: Time | null, followupPoint?: string | null, createdAt: Time, modifiedAt?: Time | null, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> }>, author: { __typename: 'UserInfo', euaUserId: string, commonName: string } } | null } };

export type GetTRBGuidanceLetterInsightsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBGuidanceLetterInsightsQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', guidanceLetter?: { __typename: 'TRBGuidanceLetter', insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> }> } | null } };

export type GetTRBPublicGuidanceLetterQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBPublicGuidanceLetterQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, name?: string | null, requesterComponent?: string | null, type: TRBRequestType, consultMeetingTime?: Time | null, requesterInfo: { __typename: 'UserInfo', commonName: string }, form: { __typename: 'TRBRequestForm', id: UUID, submittedAt?: Time | null, component?: string | null, needsAssistanceWith?: string | null }, guidanceLetter?: { __typename: 'TRBGuidanceLetter', id: UUID, meetingSummary?: HTML | null, nextSteps?: HTML | null, isFollowupRecommended?: boolean | null, dateSent?: Time | null, followupPoint?: string | null, createdAt: Time, modifiedAt?: Time | null, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> }>, author: { __typename: 'UserInfo', euaUserId: string, commonName: string } } | null, taskStatuses: { __typename: 'TRBTaskStatuses', guidanceLetterStatus: TRBGuidanceLetterStatus } } };

export type RequestReviewForTRBGuidanceLetterMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type RequestReviewForTRBGuidanceLetterMutation = { __typename: 'Mutation', requestReviewForTRBGuidanceLetter: { __typename: 'TRBGuidanceLetter', id: UUID } };

export type SendTRBGuidanceLetterMutationVariables = Exact<{
  input: SendTRBGuidanceLetterInput;
}>;


export type SendTRBGuidanceLetterMutation = { __typename: 'Mutation', sendTRBGuidanceLetter: { __typename: 'TRBGuidanceLetter', id: UUID } };

export type TRBGuidanceLetterFragment = { __typename: 'TRBGuidanceLetter', id: UUID, meetingSummary?: HTML | null, nextSteps?: HTML | null, isFollowupRecommended?: boolean | null, dateSent?: Time | null, followupPoint?: string | null, createdAt: Time, modifiedAt?: Time | null, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> }>, author: { __typename: 'UserInfo', euaUserId: string, commonName: string } };

export type TRBGuidanceLetterInsightFragment = { __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> };

export type UpdateTRBGuidanceLetterMutationVariables = Exact<{
  input: UpdateTRBGuidanceLetterInput;
}>;


export type UpdateTRBGuidanceLetterMutation = { __typename: 'Mutation', updateTRBGuidanceLetter: { __typename: 'TRBGuidanceLetter', id: UUID, meetingSummary?: HTML | null, nextSteps?: HTML | null, isFollowupRecommended?: boolean | null, dateSent?: Time | null, followupPoint?: string | null, createdAt: Time, modifiedAt?: Time | null, insights: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> }>, author: { __typename: 'UserInfo', euaUserId: string, commonName: string } } };

export type UpdateTRBGuidanceLetterInsightMutationVariables = Exact<{
  input: UpdateTRBGuidanceLetterInsightInput;
}>;


export type UpdateTRBGuidanceLetterInsightMutation = { __typename: 'Mutation', updateTRBGuidanceLetterInsight: { __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> } };

export type UpdateTRBGuidanceLetterInsightOrderMutationVariables = Exact<{
  input: UpdateTRBGuidanceLetterInsightOrderInput;
}>;


export type UpdateTRBGuidanceLetterInsightOrderMutation = { __typename: 'Mutation', updateTRBGuidanceLetterInsightOrder: Array<{ __typename: 'TRBGuidanceLetterInsight', id: UUID, category?: TRBGuidanceLetterInsightCategory | null, title: string, insight: HTML, links: Array<string> }> };

export type CloseTRBRequestMutationVariables = Exact<{
  input: CloseTRBRequestInput;
}>;


export type CloseTRBRequestMutation = { __typename: 'Mutation', closeTRBRequest: { __typename: 'TRBRequest', id: UUID } };

export type CreateTRBRequestMutationVariables = Exact<{
  requestType: TRBRequestType;
}>;


export type CreateTRBRequestMutation = { __typename: 'Mutation', createTRBRequest: { __typename: 'TRBRequest', id: UUID, name?: string | null, type: TRBRequestType, state: TRBRequestState, taskStatuses: { __typename: 'TRBTaskStatuses', formStatus: TRBFormStatus, feedbackStatus: TRBFeedbackStatus, consultPrepStatus: TRBConsultPrepStatus, attendConsultStatus: TRBAttendConsultStatus, guidanceLetterStatus: TRBGuidanceLetterStatus }, form: { __typename: 'TRBRequestForm', id: UUID, component?: string | null, needsAssistanceWith?: string | null, hasSolutionInMind?: boolean | null, proposedSolution?: string | null, whereInProcess?: TRBWhereInProcessOption | null, whereInProcessOther?: string | null, hasExpectedStartEndDates?: boolean | null, expectedStartDate?: Time | null, expectedEndDate?: Time | null, collabGroups: Array<TRBCollabGroupOption>, collabDateSecurity?: string | null, collabDateEnterpriseArchitecture?: string | null, collabDateCloud?: string | null, collabDatePrivacyAdvisor?: string | null, collabDateGovernanceReviewBoard?: string | null, collabDateOther?: string | null, collabGroupOther?: string | null, collabGRBConsultRequested?: boolean | null, subjectAreaOptions?: Array<TRBSubjectAreaOption> | null, subjectAreaOptionOther?: string | null, submittedAt?: Time | null, fundingSources?: Array<{ __typename: 'TRBFundingSource', id: UUID, fundingNumber: string, source: string }> | null, systemIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, lcid?: string | null }> }, feedback: Array<{ __typename: 'TRBRequestFeedback', id: UUID, action: TRBFeedbackAction, feedbackMessage: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string } }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }>, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, decisionState: SystemIntakeDecisionState, submittedAt?: Time | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }> } };

export type CreateTRBRequestDocumentMutationVariables = Exact<{
  input: CreateTRBRequestDocumentInput;
}>;


export type CreateTRBRequestDocumentMutation = { __typename: 'Mutation', createTRBRequestDocument?: { __typename: 'CreateTRBRequestDocumentPayload', document?: { __typename: 'TRBRequestDocument', id: UUID, fileName: string, documentType: { __typename: 'TRBRequestDocumentType', commonType: TRBDocumentCommonType, otherTypeDescription?: string | null } } | null } | null };

export type CreateTRBRequestFeedbackMutationVariables = Exact<{
  input: CreateTRBRequestFeedbackInput;
}>;


export type CreateTRBRequestFeedbackMutation = { __typename: 'Mutation', createTRBRequestFeedback: { __typename: 'TRBRequestFeedback', id: UUID } };

export type DeleteTRBRequestDocumentMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteTRBRequestDocumentMutation = { __typename: 'Mutation', deleteTRBRequestDocument?: { __typename: 'DeleteTRBRequestDocumentPayload', document?: { __typename: 'TRBRequestDocument', fileName: string } | null } | null };

export type DeleteTRBRequestFundingSourceMutationVariables = Exact<{
  input: DeleteTRBRequestFundingSourcesInput;
}>;


export type DeleteTRBRequestFundingSourceMutation = { __typename: 'Mutation', deleteTRBRequestFundingSources: Array<{ __typename: 'TRBFundingSource', id: UUID }> };

export type GetTRBLeadOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTRBLeadOptionsQuery = { __typename: 'Query', trbLeadOptions: Array<{ __typename: 'UserInfo', euaUserId: string, commonName: string }> };

export type GetTRBRequestQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, name?: string | null, type: TRBRequestType, state: TRBRequestState, taskStatuses: { __typename: 'TRBTaskStatuses', formStatus: TRBFormStatus, feedbackStatus: TRBFeedbackStatus, consultPrepStatus: TRBConsultPrepStatus, attendConsultStatus: TRBAttendConsultStatus, guidanceLetterStatus: TRBGuidanceLetterStatus }, form: { __typename: 'TRBRequestForm', id: UUID, component?: string | null, needsAssistanceWith?: string | null, hasSolutionInMind?: boolean | null, proposedSolution?: string | null, whereInProcess?: TRBWhereInProcessOption | null, whereInProcessOther?: string | null, hasExpectedStartEndDates?: boolean | null, expectedStartDate?: Time | null, expectedEndDate?: Time | null, collabGroups: Array<TRBCollabGroupOption>, collabDateSecurity?: string | null, collabDateEnterpriseArchitecture?: string | null, collabDateCloud?: string | null, collabDatePrivacyAdvisor?: string | null, collabDateGovernanceReviewBoard?: string | null, collabDateOther?: string | null, collabGroupOther?: string | null, collabGRBConsultRequested?: boolean | null, subjectAreaOptions?: Array<TRBSubjectAreaOption> | null, subjectAreaOptionOther?: string | null, submittedAt?: Time | null, fundingSources?: Array<{ __typename: 'TRBFundingSource', id: UUID, fundingNumber: string, source: string }> | null, systemIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, lcid?: string | null }> }, feedback: Array<{ __typename: 'TRBRequestFeedback', id: UUID, action: TRBFeedbackAction, feedbackMessage: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string } }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }>, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, decisionState: SystemIntakeDecisionState, submittedAt?: Time | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }> } };

export type GetTRBRequestConsultMeetingQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestConsultMeetingQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, consultMeetingTime?: Time | null } };

export type GetTRBRequestDocumentUrlsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestDocumentUrlsQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, url: string, fileName: string }> } };

export type GetTRBRequestDocumentsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestDocumentsQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, documents: Array<{ __typename: 'TRBRequestDocument', id: UUID, fileName: string, status: TRBRequestDocumentStatus, uploadedAt: Time, documentType: { __typename: 'TRBRequestDocumentType', commonType: TRBDocumentCommonType, otherTypeDescription?: string | null } }> } };

export type GetTRBRequestFeedbackQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestFeedbackQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, feedback: Array<{ __typename: 'TRBRequestFeedback', id: UUID, action: TRBFeedbackAction, feedbackMessage: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string } }> } };

export type GetTRBRequestHomeQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestHomeQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, consultMeetingTime?: Time | null, taskStatuses: { __typename: 'TRBTaskStatuses', formStatus: TRBFormStatus, guidanceLetterStatus: TRBGuidanceLetterStatus }, form: { __typename: 'TRBRequestForm', id: UUID, modifiedAt?: Time | null }, guidanceLetter?: { __typename: 'TRBGuidanceLetter', id: UUID, modifiedAt?: Time | null } | null, trbLeadInfo: { __typename: 'UserInfo', commonName: string, email: EmailAddress }, documents: Array<{ __typename: 'TRBRequestDocument', id: UUID }>, adminNotes: Array<{ __typename: 'TRBAdminNote', id: UUID }> } };

export type GetTRBRequestRelatedRequestsQueryVariables = Exact<{
  trbRequestID: Scalars['UUID']['input'];
}>;


export type GetTRBRequestRelatedRequestsQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, statusAdmin: SystemIntakeStatusAdmin, statusRequester: SystemIntakeStatusRequester, submittedAt?: Time | null, lcid?: string | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }> } };

export type GetTRBRequestRelationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestRelationQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, relationType?: RequestRelationType | null, contractName?: string | null, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> }, cedarSystems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> };

export type GetTRBRequestSummaryQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBRequestSummaryQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, name?: string | null, type: TRBRequestType, state: TRBRequestState, status: TRBRequestStatus, createdAt: Time, relationType?: RequestRelationType | null, contractName?: string | null, trbLeadInfo: { __typename: 'UserInfo', commonName: string }, taskStatuses: { __typename: 'TRBTaskStatuses', formStatus: TRBFormStatus, feedbackStatus: TRBFeedbackStatus, consultPrepStatus: TRBConsultPrepStatus, attendConsultStatus: TRBAttendConsultStatus, guidanceLetterStatus: TRBGuidanceLetterStatus }, adminNotes: Array<{ __typename: 'TRBAdminNote', id: UUID }>, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', id: UUID, contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, description?: string | null, acronym?: string | null, businessOwnerOrg?: string | null, businessOwnerRoles: Array<{ __typename: 'CedarRole', objectID: string, assigneeFirstName?: string | null, assigneeLastName?: string | null }> }> } };

export type GetTRBRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTRBRequestsQuery = { __typename: 'Query', myTrbRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, state: TRBRequestState, createdAt: Time, form: { __typename: 'TRBRequestForm', submittedAt?: Time | null } }> };

export type GetTRBTasklistQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTRBTasklistQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', name?: string | null, type: TRBRequestType, consultMeetingTime?: Time | null, relationType?: RequestRelationType | null, contractName?: string | null, form: { __typename: 'TRBRequestForm', status: TRBFormStatus }, taskStatuses: { __typename: 'TRBTaskStatuses', formStatus: TRBFormStatus, feedbackStatus: TRBFeedbackStatus, consultPrepStatus: TRBConsultPrepStatus, attendConsultStatus: TRBAttendConsultStatus, guidanceLetterStatusTaskList: TRBGuidanceLetterStatusTaskList }, feedback: Array<{ __typename: 'TRBRequestFeedback', id: UUID }>, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> } };

export type ReopenTRBRequestMutationVariables = Exact<{
  input: ReopenTRBRequestInput;
}>;


export type ReopenTRBRequestMutation = { __typename: 'Mutation', reopenTrbRequest: { __typename: 'TRBRequest', id: UUID } };

export type UpdateTRBFormMutationVariables = Exact<{
  input: UpdateTRBRequestFormInput;
}>;


export type UpdateTRBFormMutation = { __typename: 'Mutation', updateTRBRequestForm: { __typename: 'TRBRequestForm', id: UUID } };

export type UpdateTRBRequestAndFormMutationVariables = Exact<{
  input: UpdateTRBRequestFormInput;
  id: Scalars['UUID']['input'];
  changes?: InputMaybe<TRBRequestChanges>;
}>;


export type UpdateTRBRequestAndFormMutation = { __typename: 'Mutation', updateTRBRequestForm: { __typename: 'TRBRequestForm', id: UUID }, updateTRBRequest: { __typename: 'TRBRequest', id: UUID, name?: string | null, type: TRBRequestType, state: TRBRequestState, taskStatuses: { __typename: 'TRBTaskStatuses', formStatus: TRBFormStatus, feedbackStatus: TRBFeedbackStatus, consultPrepStatus: TRBConsultPrepStatus, attendConsultStatus: TRBAttendConsultStatus, guidanceLetterStatus: TRBGuidanceLetterStatus }, form: { __typename: 'TRBRequestForm', id: UUID, component?: string | null, needsAssistanceWith?: string | null, hasSolutionInMind?: boolean | null, proposedSolution?: string | null, whereInProcess?: TRBWhereInProcessOption | null, whereInProcessOther?: string | null, hasExpectedStartEndDates?: boolean | null, expectedStartDate?: Time | null, expectedEndDate?: Time | null, collabGroups: Array<TRBCollabGroupOption>, collabDateSecurity?: string | null, collabDateEnterpriseArchitecture?: string | null, collabDateCloud?: string | null, collabDatePrivacyAdvisor?: string | null, collabDateGovernanceReviewBoard?: string | null, collabDateOther?: string | null, collabGroupOther?: string | null, collabGRBConsultRequested?: boolean | null, subjectAreaOptions?: Array<TRBSubjectAreaOption> | null, subjectAreaOptionOther?: string | null, submittedAt?: Time | null, fundingSources?: Array<{ __typename: 'TRBFundingSource', id: UUID, fundingNumber: string, source: string }> | null, systemIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, lcid?: string | null }> }, feedback: Array<{ __typename: 'TRBRequestFeedback', id: UUID, action: TRBFeedbackAction, feedbackMessage: HTML, createdAt: Time, author: { __typename: 'UserInfo', commonName: string } }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }>, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, decisionState: SystemIntakeDecisionState, submittedAt?: Time | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }> } };

export type UpdateTRBRequestArchivedMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  archived: Scalars['Boolean']['input'];
}>;


export type UpdateTRBRequestArchivedMutation = { __typename: 'Mutation', updateTRBRequest: { __typename: 'TRBRequest', id: UUID, archived: boolean } };

export type UpdateTRBRequestConsultMeetingMutationVariables = Exact<{
  input: UpdateTRBRequestConsultMeetingTimeInput;
}>;


export type UpdateTRBRequestConsultMeetingMutation = { __typename: 'Mutation', updateTRBRequestConsultMeetingTime: { __typename: 'TRBRequest', id: UUID, consultMeetingTime?: Time | null } };

export type UpdateTRBRequestFormStatusMutationVariables = Exact<{
  isSubmitted: Scalars['Boolean']['input'];
  trbRequestId: Scalars['UUID']['input'];
}>;


export type UpdateTRBRequestFormStatusMutation = { __typename: 'Mutation', updateTRBRequestForm: { __typename: 'TRBRequestForm', status: TRBFormStatus } };

export type UpdateTRBRequestFundingSourcesMutationVariables = Exact<{
  input: UpdateTRBRequestFundingSourcesInput;
}>;


export type UpdateTRBRequestFundingSourcesMutation = { __typename: 'Mutation', updateTRBRequestFundingSources: Array<{ __typename: 'TRBFundingSource', source: string, fundingNumber: string, id: UUID, createdAt: Time }> };

export type UpdateTRBRequestLeadMutationVariables = Exact<{
  input: UpdateTRBRequestTRBLeadInput;
}>;


export type UpdateTRBRequestLeadMutation = { __typename: 'Mutation', updateTRBRequestTRBLead: { __typename: 'TRBRequest', id: UUID, trbLead?: string | null, trbLeadInfo: { __typename: 'UserInfo', commonName: string, email: EmailAddress, euaUserId: string } } };

export type UpdateTRBRequestTypeMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  type: TRBRequestType;
}>;


export type UpdateTRBRequestTypeMutation = { __typename: 'Mutation', updateTRBRequest: { __typename: 'TRBRequest', id: UUID, type: TRBRequestType } };

export const CedarRoleFragmentFragmentDoc = gql`
    fragment CedarRoleFragment on CedarRole {
  application
  objectID
  roleTypeID
  assigneeType
  assigneeUsername
  assigneeEmail
  assigneeOrgID
  assigneeOrgName
  assigneeFirstName
  assigneeLastName
  roleTypeName
  roleID
}
    `;
export const CedarRoleTypeFragmentFragmentDoc = gql`
    fragment CedarRoleTypeFragment on CedarRoleType {
  id
  name
  description
}
    `;
export const SystemIntakeContactFragmentFragmentDoc = gql`
    fragment SystemIntakeContactFragment on AugmentedSystemIntakeContact {
  systemIntakeId
  id
  euaUserId
  component
  role
  commonName
  email
}
    `;
export const GovernanceRequestFeedbackFragmentFragmentDoc = gql`
    fragment GovernanceRequestFeedbackFragment on GovernanceRequestFeedback {
  id
  feedback
  targetForm
  type
  author {
    commonName
  }
  createdAt
}
    `;
export const FundingSourceFragmentFragmentDoc = gql`
    fragment FundingSourceFragment on SystemIntakeFundingSource {
  id
  fundingNumber
  source
}
    `;
export const SystemIntakeDocumentFragmentFragmentDoc = gql`
    fragment SystemIntakeDocumentFragment on SystemIntakeDocument {
  documentType {
    commonType
    otherTypeDescription
  }
  id
  fileName
  version
  status
  uploadedAt
  url
  canView
  canDelete
  systemIntakeId
}
    `;
export const SystemIntakeGRBPresentationLinksFragmentFragmentDoc = gql`
    fragment SystemIntakeGRBPresentationLinksFragment on SystemIntakeGRBPresentationLinks {
  recordingLink
  recordingPasscode
  transcriptFileName
  transcriptFileStatus
  transcriptFileURL
  transcriptLink
  presentationDeckFileName
  presentationDeckFileStatus
  presentationDeckFileURL
}
    `;
export const SystemIntakeFragmentFragmentDoc = gql`
    fragment SystemIntakeFragment on SystemIntake {
  id
  adminLead
  businessNeed
  businessSolution
  businessOwner {
    component
    name
  }
  contract {
    contractor
    endDate {
      day
      month
      year
    }
    hasContract
    startDate {
      day
      month
      year
    }
    vehicle
  }
  contractNumbers {
    id
    contractNumber
  }
  costs {
    isExpectingIncrease
    expectedIncreaseAmount
  }
  annualSpending {
    currentAnnualSpending
    currentAnnualSpendingITPortion
    plannedYearOneSpending
    plannedYearOneSpendingITPortion
  }
  currentStage
  decisionNextSteps
  grbDate
  grtDate
  governanceRequestFeedbacks {
    ...GovernanceRequestFeedbackFragment
  }
  governanceTeams {
    isPresent
    teams {
      acronym
      collaborator
      key
      label
      name
    }
  }
  isso {
    isPresent
    name
  }
  existingFunding
  fundingSources {
    ...FundingSourceFragment
  }
  lcid
  lcidIssuedAt
  lcidExpiresAt
  lcidRetiresAt
  lcidScope
  lcidCostBaseline
  lcidStatus
  needsEaSupport
  productManager {
    component
    name
  }
  rejectionReason
  requester {
    component
    email
    name
  }
  requestName
  requestType
  statusAdmin
  statusRequester
  grtReviewEmailBody
  decidedAt
  businessCaseId
  submittedAt
  updatedAt
  createdAt
  archivedAt
  euaUserId
  hasUiChanges
  usesAiTech
  usingSoftware
  acquisitionMethods
  documents {
    ...SystemIntakeDocumentFragment
  }
  state
  decisionState
  trbFollowUpRecommendation
  requestFormState
  relationType
  contractName
  contractNumbers {
    id
    contractNumber
  }
  systems {
    id
    name
    description
    acronym
    businessOwnerOrg
    businessOwnerRoles {
      objectID
      assigneeFirstName
      assigneeLastName
    }
  }
  relatedTRBRequests {
    id
    name
    contractNumbers {
      contractNumber
    }
    status
    createdAt
  }
  relatedIntakes {
    id
    requestName
    contractNumbers {
      contractNumber
    }
    decisionState
    submittedAt
  }
  grbDate
  grbReviewType
  grbPresentationLinks {
    ...SystemIntakeGRBPresentationLinksFragment
  }
}
    ${GovernanceRequestFeedbackFragmentFragmentDoc}
${FundingSourceFragmentFragmentDoc}
${SystemIntakeDocumentFragmentFragmentDoc}
${SystemIntakeGRBPresentationLinksFragmentFragmentDoc}`;
export const SystemIntakeGRBReviewerFragmentDoc = gql`
    fragment SystemIntakeGRBReviewer on SystemIntakeGRBReviewer {
  id
  grbRole
  votingRole
  userAccount {
    id
    username
    commonName
    email
  }
}
    `;
export const SystemIntakeGRBPresentationLinksFragmentDoc = gql`
    fragment SystemIntakeGRBPresentationLinks on SystemIntakeGRBPresentationLinks {
  recordingLink
  recordingPasscode
  transcriptFileName
  transcriptFileStatus
  transcriptFileURL
  transcriptLink
  presentationDeckFileName
  presentationDeckFileStatus
  presentationDeckFileURL
}
    `;
export const SystemIntakeGRBReviewFragmentDoc = gql`
    fragment SystemIntakeGRBReview on SystemIntake {
  id
  grbReviewStartedAt
  grbReviewType
  grbDate
  grbReviewAsyncRecordingTime
  grbReviewers {
    ...SystemIntakeGRBReviewer
  }
  grbPresentationLinks {
    ...SystemIntakeGRBPresentationLinks
  }
  documents {
    ...SystemIntakeDocumentFragment
  }
}
    ${SystemIntakeGRBReviewerFragmentDoc}
${SystemIntakeGRBPresentationLinksFragmentDoc}
${SystemIntakeDocumentFragmentFragmentDoc}`;
export const TRBAttendeeFragmentFragmentDoc = gql`
    fragment TRBAttendeeFragment on TRBRequestAttendee {
  id
  trbRequestId
  userInfo {
    commonName
    email
    euaUserId
  }
  component
  role
  createdAt
}
    `;
export const TrbRequestFormFieldsFragmentFragmentDoc = gql`
    fragment TrbRequestFormFieldsFragment on TRBRequest {
  id
  name
  type
  state
  taskStatuses {
    formStatus
    feedbackStatus
    consultPrepStatus
    attendConsultStatus
    guidanceLetterStatus
  }
  form {
    id
    component
    needsAssistanceWith
    hasSolutionInMind
    proposedSolution
    whereInProcess
    whereInProcessOther
    hasExpectedStartEndDates
    expectedStartDate
    expectedEndDate
    collabGroups
    collabDateSecurity
    collabDateEnterpriseArchitecture
    collabDateCloud
    collabDatePrivacyAdvisor
    collabDateGovernanceReviewBoard
    collabDateOther
    collabGroupOther
    collabGRBConsultRequested
    subjectAreaOptions
    subjectAreaOptionOther
    fundingSources {
      id
      fundingNumber
      source
    }
    systemIntakes {
      id
      requestName
      lcid
    }
    submittedAt
  }
  feedback {
    id
    action
    feedbackMessage
    author {
      commonName
    }
    createdAt
  }
  relatedTRBRequests {
    id
    name
    contractNumbers {
      contractNumber
    }
    status
    createdAt
  }
  relatedIntakes {
    id
    requestName
    contractNumbers {
      contractNumber
    }
    decisionState
    submittedAt
  }
}
    `;
export const SystemIntakeWithReviewRequestedFragmentDoc = gql`
    fragment SystemIntakeWithReviewRequested on SystemIntake {
  id
  requestName
  requesterName
  requesterComponent
  grbDate
}
    `;
export const SystemIntakeGRBReviewDiscussionPostFragmentDoc = gql`
    fragment SystemIntakeGRBReviewDiscussionPost on SystemIntakeGRBReviewDiscussionPost {
  id
  content
  votingRole
  grbRole
  createdByUserAccount {
    id
    commonName
  }
  systemIntakeID
  createdAt
}
    `;
export const SystemIntakeGRBReviewDiscussionFragmentDoc = gql`
    fragment SystemIntakeGRBReviewDiscussion on SystemIntakeGRBReviewDiscussion {
  initialPost {
    ...SystemIntakeGRBReviewDiscussionPost
  }
  replies {
    ...SystemIntakeGRBReviewDiscussionPost
  }
}
    ${SystemIntakeGRBReviewDiscussionPostFragmentDoc}`;
export const TRBAdminNoteInitialRequestFormCategoryDataFragmentDoc = gql`
    fragment TRBAdminNoteInitialRequestFormCategoryData on TRBAdminNoteInitialRequestFormCategoryData {
  appliesToBasicRequestDetails
  appliesToSubjectAreas
  appliesToAttendees
}
    `;
export const TRBAdminNoteSupportingDocumentsCategoryDataFragmentDoc = gql`
    fragment TRBAdminNoteSupportingDocumentsCategoryData on TRBAdminNoteSupportingDocumentsCategoryData {
  documents {
    id
    fileName
    deletedAt
  }
}
    `;
export const TRBAdminNoteGuidanceLetterCategoryDataFragmentDoc = gql`
    fragment TRBAdminNoteGuidanceLetterCategoryData on TRBAdminNoteGuidanceLetterCategoryData {
  appliesToMeetingSummary
  appliesToNextSteps
  insights {
    id
    category
    title
    deletedAt
  }
}
    `;
export const TRBAdminNoteFragmentDoc = gql`
    fragment TRBAdminNote on TRBAdminNote {
  id
  isArchived
  category
  noteText
  author {
    commonName
  }
  createdAt
  categorySpecificData {
    ... on TRBAdminNoteInitialRequestFormCategoryData {
      ...TRBAdminNoteInitialRequestFormCategoryData
    }
    ... on TRBAdminNoteSupportingDocumentsCategoryData {
      ...TRBAdminNoteSupportingDocumentsCategoryData
    }
    ... on TRBAdminNoteGuidanceLetterCategoryData {
      ...TRBAdminNoteGuidanceLetterCategoryData
    }
  }
}
    ${TRBAdminNoteInitialRequestFormCategoryDataFragmentDoc}
${TRBAdminNoteSupportingDocumentsCategoryDataFragmentDoc}
${TRBAdminNoteGuidanceLetterCategoryDataFragmentDoc}`;
export const TRBGuidanceLetterInsightFragmentDoc = gql`
    fragment TRBGuidanceLetterInsight on TRBGuidanceLetterInsight {
  id
  category
  title
  insight
  links
}
    `;
export const TRBGuidanceLetterFragmentDoc = gql`
    fragment TRBGuidanceLetter on TRBGuidanceLetter {
  id
  meetingSummary
  nextSteps
  isFollowupRecommended
  dateSent
  followupPoint
  insights {
    ...TRBGuidanceLetterInsight
  }
  author {
    euaUserId
    commonName
  }
  createdAt
  modifiedAt
}
    ${TRBGuidanceLetterInsightFragmentDoc}`;
export const SendFeedbackEmailDocument = gql`
    mutation SendFeedbackEmail($input: SendFeedbackEmailInput!) {
  sendFeedbackEmail(input: $input)
}
    `;
export type SendFeedbackEmailMutationFn = Apollo.MutationFunction<SendFeedbackEmailMutation, SendFeedbackEmailMutationVariables>;

/**
 * __useSendFeedbackEmailMutation__
 *
 * To run a mutation, you first call `useSendFeedbackEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendFeedbackEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendFeedbackEmailMutation, { data, loading, error }] = useSendFeedbackEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendFeedbackEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendFeedbackEmailMutation, SendFeedbackEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendFeedbackEmailMutation, SendFeedbackEmailMutationVariables>(SendFeedbackEmailDocument, options);
      }
export type SendFeedbackEmailMutationHookResult = ReturnType<typeof useSendFeedbackEmailMutation>;
export type SendFeedbackEmailMutationResult = Apollo.MutationResult<SendFeedbackEmailMutation>;
export type SendFeedbackEmailMutationOptions = Apollo.BaseMutationOptions<SendFeedbackEmailMutation, SendFeedbackEmailMutationVariables>;
export const SendReportAProblemEmailDocument = gql`
    mutation SendReportAProblemEmail($input: SendReportAProblemEmailInput!) {
  sendReportAProblemEmail(input: $input)
}
    `;
export type SendReportAProblemEmailMutationFn = Apollo.MutationFunction<SendReportAProblemEmailMutation, SendReportAProblemEmailMutationVariables>;

/**
 * __useSendReportAProblemEmailMutation__
 *
 * To run a mutation, you first call `useSendReportAProblemEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendReportAProblemEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendReportAProblemEmailMutation, { data, loading, error }] = useSendReportAProblemEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendReportAProblemEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendReportAProblemEmailMutation, SendReportAProblemEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendReportAProblemEmailMutation, SendReportAProblemEmailMutationVariables>(SendReportAProblemEmailDocument, options);
      }
export type SendReportAProblemEmailMutationHookResult = ReturnType<typeof useSendReportAProblemEmailMutation>;
export type SendReportAProblemEmailMutationResult = Apollo.MutationResult<SendReportAProblemEmailMutation>;
export type SendReportAProblemEmailMutationOptions = Apollo.BaseMutationOptions<SendReportAProblemEmailMutation, SendReportAProblemEmailMutationVariables>;
export const CreateSystemIntakeActionChangeLCIDRetirementDateDocument = gql`
    mutation CreateSystemIntakeActionChangeLCIDRetirementDate($input: SystemIntakeChangeLCIDRetirementDateInput!) {
  createSystemIntakeActionChangeLCIDRetirementDate(input: $input) {
    systemIntake {
      id
      lcid
    }
  }
}
    `;
export type CreateSystemIntakeActionChangeLCIDRetirementDateMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionChangeLCIDRetirementDateMutation, CreateSystemIntakeActionChangeLCIDRetirementDateMutationVariables>;

/**
 * __useCreateSystemIntakeActionChangeLCIDRetirementDateMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionChangeLCIDRetirementDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionChangeLCIDRetirementDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionChangeLcidRetirementDateMutation, { data, loading, error }] = useCreateSystemIntakeActionChangeLCIDRetirementDateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionChangeLCIDRetirementDateMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionChangeLCIDRetirementDateMutation, CreateSystemIntakeActionChangeLCIDRetirementDateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionChangeLCIDRetirementDateMutation, CreateSystemIntakeActionChangeLCIDRetirementDateMutationVariables>(CreateSystemIntakeActionChangeLCIDRetirementDateDocument, options);
      }
export type CreateSystemIntakeActionChangeLCIDRetirementDateMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionChangeLCIDRetirementDateMutation>;
export type CreateSystemIntakeActionChangeLCIDRetirementDateMutationResult = Apollo.MutationResult<CreateSystemIntakeActionChangeLCIDRetirementDateMutation>;
export type CreateSystemIntakeActionChangeLCIDRetirementDateMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionChangeLCIDRetirementDateMutation, CreateSystemIntakeActionChangeLCIDRetirementDateMutationVariables>;
export const CreateSystemIntakeActionCloseRequestDocument = gql`
    mutation CreateSystemIntakeActionCloseRequest($input: SystemIntakeCloseRequestInput!) {
  createSystemIntakeActionCloseRequest(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type CreateSystemIntakeActionCloseRequestMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionCloseRequestMutation, CreateSystemIntakeActionCloseRequestMutationVariables>;

/**
 * __useCreateSystemIntakeActionCloseRequestMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionCloseRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionCloseRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionCloseRequestMutation, { data, loading, error }] = useCreateSystemIntakeActionCloseRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionCloseRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionCloseRequestMutation, CreateSystemIntakeActionCloseRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionCloseRequestMutation, CreateSystemIntakeActionCloseRequestMutationVariables>(CreateSystemIntakeActionCloseRequestDocument, options);
      }
export type CreateSystemIntakeActionCloseRequestMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionCloseRequestMutation>;
export type CreateSystemIntakeActionCloseRequestMutationResult = Apollo.MutationResult<CreateSystemIntakeActionCloseRequestMutation>;
export type CreateSystemIntakeActionCloseRequestMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionCloseRequestMutation, CreateSystemIntakeActionCloseRequestMutationVariables>;
export const CreateSystemIntakeActionConfirmLCIDDocument = gql`
    mutation CreateSystemIntakeActionConfirmLCID($input: SystemIntakeConfirmLCIDInput!) {
  createSystemIntakeActionConfirmLCID(input: $input) {
    systemIntake {
      id
      lcid
    }
  }
}
    `;
export type CreateSystemIntakeActionConfirmLCIDMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionConfirmLCIDMutation, CreateSystemIntakeActionConfirmLCIDMutationVariables>;

/**
 * __useCreateSystemIntakeActionConfirmLCIDMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionConfirmLCIDMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionConfirmLCIDMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionConfirmLcidMutation, { data, loading, error }] = useCreateSystemIntakeActionConfirmLCIDMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionConfirmLCIDMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionConfirmLCIDMutation, CreateSystemIntakeActionConfirmLCIDMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionConfirmLCIDMutation, CreateSystemIntakeActionConfirmLCIDMutationVariables>(CreateSystemIntakeActionConfirmLCIDDocument, options);
      }
export type CreateSystemIntakeActionConfirmLCIDMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionConfirmLCIDMutation>;
export type CreateSystemIntakeActionConfirmLCIDMutationResult = Apollo.MutationResult<CreateSystemIntakeActionConfirmLCIDMutation>;
export type CreateSystemIntakeActionConfirmLCIDMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionConfirmLCIDMutation, CreateSystemIntakeActionConfirmLCIDMutationVariables>;
export const CreateSystemIntakeActionExpireLCIDDocument = gql`
    mutation CreateSystemIntakeActionExpireLCID($input: SystemIntakeExpireLCIDInput!) {
  createSystemIntakeActionExpireLCID(input: $input) {
    systemIntake {
      id
      lcid
    }
  }
}
    `;
export type CreateSystemIntakeActionExpireLCIDMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionExpireLCIDMutation, CreateSystemIntakeActionExpireLCIDMutationVariables>;

/**
 * __useCreateSystemIntakeActionExpireLCIDMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionExpireLCIDMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionExpireLCIDMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionExpireLcidMutation, { data, loading, error }] = useCreateSystemIntakeActionExpireLCIDMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionExpireLCIDMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionExpireLCIDMutation, CreateSystemIntakeActionExpireLCIDMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionExpireLCIDMutation, CreateSystemIntakeActionExpireLCIDMutationVariables>(CreateSystemIntakeActionExpireLCIDDocument, options);
      }
export type CreateSystemIntakeActionExpireLCIDMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionExpireLCIDMutation>;
export type CreateSystemIntakeActionExpireLCIDMutationResult = Apollo.MutationResult<CreateSystemIntakeActionExpireLCIDMutation>;
export type CreateSystemIntakeActionExpireLCIDMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionExpireLCIDMutation, CreateSystemIntakeActionExpireLCIDMutationVariables>;
export const CreateSystemIntakeActionIssueLCIDDocument = gql`
    mutation CreateSystemIntakeActionIssueLCID($input: SystemIntakeIssueLCIDInput!) {
  createSystemIntakeActionIssueLCID(input: $input) {
    systemIntake {
      id
      lcid
    }
  }
}
    `;
export type CreateSystemIntakeActionIssueLCIDMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionIssueLCIDMutation, CreateSystemIntakeActionIssueLCIDMutationVariables>;

/**
 * __useCreateSystemIntakeActionIssueLCIDMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionIssueLCIDMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionIssueLCIDMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionIssueLcidMutation, { data, loading, error }] = useCreateSystemIntakeActionIssueLCIDMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionIssueLCIDMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionIssueLCIDMutation, CreateSystemIntakeActionIssueLCIDMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionIssueLCIDMutation, CreateSystemIntakeActionIssueLCIDMutationVariables>(CreateSystemIntakeActionIssueLCIDDocument, options);
      }
export type CreateSystemIntakeActionIssueLCIDMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionIssueLCIDMutation>;
export type CreateSystemIntakeActionIssueLCIDMutationResult = Apollo.MutationResult<CreateSystemIntakeActionIssueLCIDMutation>;
export type CreateSystemIntakeActionIssueLCIDMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionIssueLCIDMutation, CreateSystemIntakeActionIssueLCIDMutationVariables>;
export const CreateSystemIntakeActionNotITGovRequestDocument = gql`
    mutation CreateSystemIntakeActionNotITGovRequest($input: SystemIntakeNotITGovReqInput!) {
  createSystemIntakeActionNotITGovRequest(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type CreateSystemIntakeActionNotITGovRequestMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionNotITGovRequestMutation, CreateSystemIntakeActionNotITGovRequestMutationVariables>;

/**
 * __useCreateSystemIntakeActionNotITGovRequestMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionNotITGovRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionNotITGovRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionNotItGovRequestMutation, { data, loading, error }] = useCreateSystemIntakeActionNotITGovRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionNotITGovRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionNotITGovRequestMutation, CreateSystemIntakeActionNotITGovRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionNotITGovRequestMutation, CreateSystemIntakeActionNotITGovRequestMutationVariables>(CreateSystemIntakeActionNotITGovRequestDocument, options);
      }
export type CreateSystemIntakeActionNotITGovRequestMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionNotITGovRequestMutation>;
export type CreateSystemIntakeActionNotITGovRequestMutationResult = Apollo.MutationResult<CreateSystemIntakeActionNotITGovRequestMutation>;
export type CreateSystemIntakeActionNotITGovRequestMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionNotITGovRequestMutation, CreateSystemIntakeActionNotITGovRequestMutationVariables>;
export const CreateSystemIntakeActionProgressToNewStepDocument = gql`
    mutation CreateSystemIntakeActionProgressToNewStep($input: SystemIntakeProgressToNewStepsInput!) {
  createSystemIntakeActionProgressToNewStep(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type CreateSystemIntakeActionProgressToNewStepMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionProgressToNewStepMutation, CreateSystemIntakeActionProgressToNewStepMutationVariables>;

/**
 * __useCreateSystemIntakeActionProgressToNewStepMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionProgressToNewStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionProgressToNewStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionProgressToNewStepMutation, { data, loading, error }] = useCreateSystemIntakeActionProgressToNewStepMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionProgressToNewStepMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionProgressToNewStepMutation, CreateSystemIntakeActionProgressToNewStepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionProgressToNewStepMutation, CreateSystemIntakeActionProgressToNewStepMutationVariables>(CreateSystemIntakeActionProgressToNewStepDocument, options);
      }
export type CreateSystemIntakeActionProgressToNewStepMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionProgressToNewStepMutation>;
export type CreateSystemIntakeActionProgressToNewStepMutationResult = Apollo.MutationResult<CreateSystemIntakeActionProgressToNewStepMutation>;
export type CreateSystemIntakeActionProgressToNewStepMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionProgressToNewStepMutation, CreateSystemIntakeActionProgressToNewStepMutationVariables>;
export const CreateSystemIntakeActionRejectIntakeDocument = gql`
    mutation CreateSystemIntakeActionRejectIntake($input: SystemIntakeRejectIntakeInput!) {
  createSystemIntakeActionRejectIntake(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type CreateSystemIntakeActionRejectIntakeMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionRejectIntakeMutation, CreateSystemIntakeActionRejectIntakeMutationVariables>;

/**
 * __useCreateSystemIntakeActionRejectIntakeMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionRejectIntakeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionRejectIntakeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionRejectIntakeMutation, { data, loading, error }] = useCreateSystemIntakeActionRejectIntakeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionRejectIntakeMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionRejectIntakeMutation, CreateSystemIntakeActionRejectIntakeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionRejectIntakeMutation, CreateSystemIntakeActionRejectIntakeMutationVariables>(CreateSystemIntakeActionRejectIntakeDocument, options);
      }
export type CreateSystemIntakeActionRejectIntakeMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionRejectIntakeMutation>;
export type CreateSystemIntakeActionRejectIntakeMutationResult = Apollo.MutationResult<CreateSystemIntakeActionRejectIntakeMutation>;
export type CreateSystemIntakeActionRejectIntakeMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionRejectIntakeMutation, CreateSystemIntakeActionRejectIntakeMutationVariables>;
export const CreateSystemIntakeActionReopenRequestDocument = gql`
    mutation CreateSystemIntakeActionReopenRequest($input: SystemIntakeReopenRequestInput!) {
  createSystemIntakeActionReopenRequest(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type CreateSystemIntakeActionReopenRequestMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionReopenRequestMutation, CreateSystemIntakeActionReopenRequestMutationVariables>;

/**
 * __useCreateSystemIntakeActionReopenRequestMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionReopenRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionReopenRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionReopenRequestMutation, { data, loading, error }] = useCreateSystemIntakeActionReopenRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionReopenRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionReopenRequestMutation, CreateSystemIntakeActionReopenRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionReopenRequestMutation, CreateSystemIntakeActionReopenRequestMutationVariables>(CreateSystemIntakeActionReopenRequestDocument, options);
      }
export type CreateSystemIntakeActionReopenRequestMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionReopenRequestMutation>;
export type CreateSystemIntakeActionReopenRequestMutationResult = Apollo.MutationResult<CreateSystemIntakeActionReopenRequestMutation>;
export type CreateSystemIntakeActionReopenRequestMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionReopenRequestMutation, CreateSystemIntakeActionReopenRequestMutationVariables>;
export const CreateSystemIntakeActionRequestEditsDocument = gql`
    mutation CreateSystemIntakeActionRequestEdits($input: SystemIntakeRequestEditsInput!) {
  createSystemIntakeActionRequestEdits(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type CreateSystemIntakeActionRequestEditsMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionRequestEditsMutation, CreateSystemIntakeActionRequestEditsMutationVariables>;

/**
 * __useCreateSystemIntakeActionRequestEditsMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionRequestEditsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionRequestEditsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionRequestEditsMutation, { data, loading, error }] = useCreateSystemIntakeActionRequestEditsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionRequestEditsMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionRequestEditsMutation, CreateSystemIntakeActionRequestEditsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionRequestEditsMutation, CreateSystemIntakeActionRequestEditsMutationVariables>(CreateSystemIntakeActionRequestEditsDocument, options);
      }
export type CreateSystemIntakeActionRequestEditsMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionRequestEditsMutation>;
export type CreateSystemIntakeActionRequestEditsMutationResult = Apollo.MutationResult<CreateSystemIntakeActionRequestEditsMutation>;
export type CreateSystemIntakeActionRequestEditsMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionRequestEditsMutation, CreateSystemIntakeActionRequestEditsMutationVariables>;
export const CreateSystemIntakeActionRetireLcidDocument = gql`
    mutation CreateSystemIntakeActionRetireLcid($input: SystemIntakeRetireLCIDInput!) {
  createSystemIntakeActionRetireLCID(input: $input) {
    systemIntake {
      id
      lcid
    }
  }
}
    `;
export type CreateSystemIntakeActionRetireLcidMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionRetireLcidMutation, CreateSystemIntakeActionRetireLcidMutationVariables>;

/**
 * __useCreateSystemIntakeActionRetireLcidMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionRetireLcidMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionRetireLcidMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionRetireLcidMutation, { data, loading, error }] = useCreateSystemIntakeActionRetireLcidMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionRetireLcidMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionRetireLcidMutation, CreateSystemIntakeActionRetireLcidMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionRetireLcidMutation, CreateSystemIntakeActionRetireLcidMutationVariables>(CreateSystemIntakeActionRetireLcidDocument, options);
      }
export type CreateSystemIntakeActionRetireLcidMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionRetireLcidMutation>;
export type CreateSystemIntakeActionRetireLcidMutationResult = Apollo.MutationResult<CreateSystemIntakeActionRetireLcidMutation>;
export type CreateSystemIntakeActionRetireLcidMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionRetireLcidMutation, CreateSystemIntakeActionRetireLcidMutationVariables>;
export const CreateSystemIntakeActionUnretireLCIDDocument = gql`
    mutation CreateSystemIntakeActionUnretireLCID($input: SystemIntakeUnretireLCIDInput!) {
  createSystemIntakeActionUnretireLCID(input: $input) {
    systemIntake {
      id
      lcid
    }
  }
}
    `;
export type CreateSystemIntakeActionUnretireLCIDMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionUnretireLCIDMutation, CreateSystemIntakeActionUnretireLCIDMutationVariables>;

/**
 * __useCreateSystemIntakeActionUnretireLCIDMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionUnretireLCIDMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionUnretireLCIDMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionUnretireLcidMutation, { data, loading, error }] = useCreateSystemIntakeActionUnretireLCIDMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionUnretireLCIDMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionUnretireLCIDMutation, CreateSystemIntakeActionUnretireLCIDMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionUnretireLCIDMutation, CreateSystemIntakeActionUnretireLCIDMutationVariables>(CreateSystemIntakeActionUnretireLCIDDocument, options);
      }
export type CreateSystemIntakeActionUnretireLCIDMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionUnretireLCIDMutation>;
export type CreateSystemIntakeActionUnretireLCIDMutationResult = Apollo.MutationResult<CreateSystemIntakeActionUnretireLCIDMutation>;
export type CreateSystemIntakeActionUnretireLCIDMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionUnretireLCIDMutation, CreateSystemIntakeActionUnretireLCIDMutationVariables>;
export const CreateSystemIntakeActionUpdateLCIDDocument = gql`
    mutation CreateSystemIntakeActionUpdateLCID($input: SystemIntakeUpdateLCIDInput!) {
  createSystemIntakeActionUpdateLCID(input: $input) {
    systemIntake {
      id
      lcid
    }
  }
}
    `;
export type CreateSystemIntakeActionUpdateLCIDMutationFn = Apollo.MutationFunction<CreateSystemIntakeActionUpdateLCIDMutation, CreateSystemIntakeActionUpdateLCIDMutationVariables>;

/**
 * __useCreateSystemIntakeActionUpdateLCIDMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeActionUpdateLCIDMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeActionUpdateLCIDMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeActionUpdateLcidMutation, { data, loading, error }] = useCreateSystemIntakeActionUpdateLCIDMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeActionUpdateLCIDMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeActionUpdateLCIDMutation, CreateSystemIntakeActionUpdateLCIDMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeActionUpdateLCIDMutation, CreateSystemIntakeActionUpdateLCIDMutationVariables>(CreateSystemIntakeActionUpdateLCIDDocument, options);
      }
export type CreateSystemIntakeActionUpdateLCIDMutationHookResult = ReturnType<typeof useCreateSystemIntakeActionUpdateLCIDMutation>;
export type CreateSystemIntakeActionUpdateLCIDMutationResult = Apollo.MutationResult<CreateSystemIntakeActionUpdateLCIDMutation>;
export type CreateSystemIntakeActionUpdateLCIDMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeActionUpdateLCIDMutation, CreateSystemIntakeActionUpdateLCIDMutationVariables>;
export const GetAdminNotesAndActionsDocument = gql`
    query GetAdminNotesAndActions($id: UUID!) {
  systemIntake(id: $id) {
    id
    lcid
    notes {
      id
      createdAt
      content
      editor {
        commonName
      }
      modifiedBy
      modifiedAt
      isArchived
      author {
        name
        eua
      }
    }
    actions {
      id
      createdAt
      feedback
      type
      lcidExpirationChange {
        previousDate
        newDate
        previousScope
        newScope
        previousNextSteps
        newNextSteps
        previousCostBaseline
        newCostBaseline
      }
      actor {
        name
        email
      }
    }
  }
}
    `;

/**
 * __useGetAdminNotesAndActionsQuery__
 *
 * To run a query within a React component, call `useGetAdminNotesAndActionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminNotesAndActionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminNotesAndActionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminNotesAndActionsQuery(baseOptions: Apollo.QueryHookOptions<GetAdminNotesAndActionsQuery, GetAdminNotesAndActionsQueryVariables> & ({ variables: GetAdminNotesAndActionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminNotesAndActionsQuery, GetAdminNotesAndActionsQueryVariables>(GetAdminNotesAndActionsDocument, options);
      }
export function useGetAdminNotesAndActionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminNotesAndActionsQuery, GetAdminNotesAndActionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminNotesAndActionsQuery, GetAdminNotesAndActionsQueryVariables>(GetAdminNotesAndActionsDocument, options);
        }
export function useGetAdminNotesAndActionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminNotesAndActionsQuery, GetAdminNotesAndActionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminNotesAndActionsQuery, GetAdminNotesAndActionsQueryVariables>(GetAdminNotesAndActionsDocument, options);
        }
export type GetAdminNotesAndActionsQueryHookResult = ReturnType<typeof useGetAdminNotesAndActionsQuery>;
export type GetAdminNotesAndActionsLazyQueryHookResult = ReturnType<typeof useGetAdminNotesAndActionsLazyQuery>;
export type GetAdminNotesAndActionsSuspenseQueryHookResult = ReturnType<typeof useGetAdminNotesAndActionsSuspenseQuery>;
export type GetAdminNotesAndActionsQueryResult = Apollo.QueryResult<GetAdminNotesAndActionsQuery, GetAdminNotesAndActionsQueryVariables>;
export const GetSystemIntakeContactsDocument = gql`
    query GetSystemIntakeContacts($id: UUID!) {
  systemIntakeContacts(id: $id) {
    systemIntakeContacts {
      ...SystemIntakeContactFragment
    }
  }
}
    ${SystemIntakeContactFragmentFragmentDoc}`;

/**
 * __useGetSystemIntakeContactsQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeContactsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeContactsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeContactsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemIntakeContactsQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakeContactsQuery, GetSystemIntakeContactsQueryVariables> & ({ variables: GetSystemIntakeContactsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakeContactsQuery, GetSystemIntakeContactsQueryVariables>(GetSystemIntakeContactsDocument, options);
      }
export function useGetSystemIntakeContactsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakeContactsQuery, GetSystemIntakeContactsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakeContactsQuery, GetSystemIntakeContactsQueryVariables>(GetSystemIntakeContactsDocument, options);
        }
export function useGetSystemIntakeContactsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakeContactsQuery, GetSystemIntakeContactsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakeContactsQuery, GetSystemIntakeContactsQueryVariables>(GetSystemIntakeContactsDocument, options);
        }
export type GetSystemIntakeContactsQueryHookResult = ReturnType<typeof useGetSystemIntakeContactsQuery>;
export type GetSystemIntakeContactsLazyQueryHookResult = ReturnType<typeof useGetSystemIntakeContactsLazyQuery>;
export type GetSystemIntakeContactsSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakeContactsSuspenseQuery>;
export type GetSystemIntakeContactsQueryResult = Apollo.QueryResult<GetSystemIntakeContactsQuery, GetSystemIntakeContactsQueryVariables>;
export const CreateSystemIntakeContactDocument = gql`
    mutation CreateSystemIntakeContact($input: CreateSystemIntakeContactInput!) {
  createSystemIntakeContact(input: $input) {
    systemIntakeContact {
      id
      euaUserId
      systemIntakeId
      component
      role
    }
  }
}
    `;
export type CreateSystemIntakeContactMutationFn = Apollo.MutationFunction<CreateSystemIntakeContactMutation, CreateSystemIntakeContactMutationVariables>;

/**
 * __useCreateSystemIntakeContactMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeContactMutation, { data, loading, error }] = useCreateSystemIntakeContactMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeContactMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeContactMutation, CreateSystemIntakeContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeContactMutation, CreateSystemIntakeContactMutationVariables>(CreateSystemIntakeContactDocument, options);
      }
export type CreateSystemIntakeContactMutationHookResult = ReturnType<typeof useCreateSystemIntakeContactMutation>;
export type CreateSystemIntakeContactMutationResult = Apollo.MutationResult<CreateSystemIntakeContactMutation>;
export type CreateSystemIntakeContactMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeContactMutation, CreateSystemIntakeContactMutationVariables>;
export const UpdateSystemIntakeContactDocument = gql`
    mutation UpdateSystemIntakeContact($input: UpdateSystemIntakeContactInput!) {
  updateSystemIntakeContact(input: $input) {
    systemIntakeContact {
      id
      euaUserId
      systemIntakeId
      component
      role
    }
  }
}
    `;
export type UpdateSystemIntakeContactMutationFn = Apollo.MutationFunction<UpdateSystemIntakeContactMutation, UpdateSystemIntakeContactMutationVariables>;

/**
 * __useUpdateSystemIntakeContactMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeContactMutation, { data, loading, error }] = useUpdateSystemIntakeContactMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeContactMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeContactMutation, UpdateSystemIntakeContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeContactMutation, UpdateSystemIntakeContactMutationVariables>(UpdateSystemIntakeContactDocument, options);
      }
export type UpdateSystemIntakeContactMutationHookResult = ReturnType<typeof useUpdateSystemIntakeContactMutation>;
export type UpdateSystemIntakeContactMutationResult = Apollo.MutationResult<UpdateSystemIntakeContactMutation>;
export type UpdateSystemIntakeContactMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeContactMutation, UpdateSystemIntakeContactMutationVariables>;
export const DeleteSystemIntakeContactDocument = gql`
    mutation DeleteSystemIntakeContact($input: DeleteSystemIntakeContactInput!) {
  deleteSystemIntakeContact(input: $input) {
    systemIntakeContact {
      id
      euaUserId
      systemIntakeId
      component
      role
    }
  }
}
    `;
export type DeleteSystemIntakeContactMutationFn = Apollo.MutationFunction<DeleteSystemIntakeContactMutation, DeleteSystemIntakeContactMutationVariables>;

/**
 * __useDeleteSystemIntakeContactMutation__
 *
 * To run a mutation, you first call `useDeleteSystemIntakeContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSystemIntakeContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSystemIntakeContactMutation, { data, loading, error }] = useDeleteSystemIntakeContactMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteSystemIntakeContactMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSystemIntakeContactMutation, DeleteSystemIntakeContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSystemIntakeContactMutation, DeleteSystemIntakeContactMutationVariables>(DeleteSystemIntakeContactDocument, options);
      }
export type DeleteSystemIntakeContactMutationHookResult = ReturnType<typeof useDeleteSystemIntakeContactMutation>;
export type DeleteSystemIntakeContactMutationResult = Apollo.MutationResult<DeleteSystemIntakeContactMutation>;
export type DeleteSystemIntakeContactMutationOptions = Apollo.BaseMutationOptions<DeleteSystemIntakeContactMutation, DeleteSystemIntakeContactMutationVariables>;
export const CreateSystemIntakeDocumentDocument = gql`
    mutation CreateSystemIntakeDocument($input: CreateSystemIntakeDocumentInput!) {
  createSystemIntakeDocument(input: $input) {
    document {
      ...SystemIntakeDocumentFragment
    }
  }
}
    ${SystemIntakeDocumentFragmentFragmentDoc}`;
export type CreateSystemIntakeDocumentMutationFn = Apollo.MutationFunction<CreateSystemIntakeDocumentMutation, CreateSystemIntakeDocumentMutationVariables>;

/**
 * __useCreateSystemIntakeDocumentMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeDocumentMutation, { data, loading, error }] = useCreateSystemIntakeDocumentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeDocumentMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeDocumentMutation, CreateSystemIntakeDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeDocumentMutation, CreateSystemIntakeDocumentMutationVariables>(CreateSystemIntakeDocumentDocument, options);
      }
export type CreateSystemIntakeDocumentMutationHookResult = ReturnType<typeof useCreateSystemIntakeDocumentMutation>;
export type CreateSystemIntakeDocumentMutationResult = Apollo.MutationResult<CreateSystemIntakeDocumentMutation>;
export type CreateSystemIntakeDocumentMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeDocumentMutation, CreateSystemIntakeDocumentMutationVariables>;
export const DeleteSystemIntakeDocumentDocument = gql`
    mutation DeleteSystemIntakeDocument($id: UUID!) {
  deleteSystemIntakeDocument(id: $id) {
    document {
      ...SystemIntakeDocumentFragment
    }
  }
}
    ${SystemIntakeDocumentFragmentFragmentDoc}`;
export type DeleteSystemIntakeDocumentMutationFn = Apollo.MutationFunction<DeleteSystemIntakeDocumentMutation, DeleteSystemIntakeDocumentMutationVariables>;

/**
 * __useDeleteSystemIntakeDocumentMutation__
 *
 * To run a mutation, you first call `useDeleteSystemIntakeDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSystemIntakeDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSystemIntakeDocumentMutation, { data, loading, error }] = useDeleteSystemIntakeDocumentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSystemIntakeDocumentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSystemIntakeDocumentMutation, DeleteSystemIntakeDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSystemIntakeDocumentMutation, DeleteSystemIntakeDocumentMutationVariables>(DeleteSystemIntakeDocumentDocument, options);
      }
export type DeleteSystemIntakeDocumentMutationHookResult = ReturnType<typeof useDeleteSystemIntakeDocumentMutation>;
export type DeleteSystemIntakeDocumentMutationResult = Apollo.MutationResult<DeleteSystemIntakeDocumentMutation>;
export type DeleteSystemIntakeDocumentMutationOptions = Apollo.BaseMutationOptions<DeleteSystemIntakeDocumentMutation, DeleteSystemIntakeDocumentMutationVariables>;
export const GetSystemIntakeDocumentUrlsDocument = gql`
    query GetSystemIntakeDocumentUrls($id: UUID!) {
  systemIntake(id: $id) {
    id
    documents {
      id
      url
      fileName
    }
  }
}
    `;

/**
 * __useGetSystemIntakeDocumentUrlsQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeDocumentUrlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeDocumentUrlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeDocumentUrlsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemIntakeDocumentUrlsQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakeDocumentUrlsQuery, GetSystemIntakeDocumentUrlsQueryVariables> & ({ variables: GetSystemIntakeDocumentUrlsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakeDocumentUrlsQuery, GetSystemIntakeDocumentUrlsQueryVariables>(GetSystemIntakeDocumentUrlsDocument, options);
      }
export function useGetSystemIntakeDocumentUrlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakeDocumentUrlsQuery, GetSystemIntakeDocumentUrlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakeDocumentUrlsQuery, GetSystemIntakeDocumentUrlsQueryVariables>(GetSystemIntakeDocumentUrlsDocument, options);
        }
export function useGetSystemIntakeDocumentUrlsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakeDocumentUrlsQuery, GetSystemIntakeDocumentUrlsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakeDocumentUrlsQuery, GetSystemIntakeDocumentUrlsQueryVariables>(GetSystemIntakeDocumentUrlsDocument, options);
        }
export type GetSystemIntakeDocumentUrlsQueryHookResult = ReturnType<typeof useGetSystemIntakeDocumentUrlsQuery>;
export type GetSystemIntakeDocumentUrlsLazyQueryHookResult = ReturnType<typeof useGetSystemIntakeDocumentUrlsLazyQuery>;
export type GetSystemIntakeDocumentUrlsSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakeDocumentUrlsSuspenseQuery>;
export type GetSystemIntakeDocumentUrlsQueryResult = Apollo.QueryResult<GetSystemIntakeDocumentUrlsQuery, GetSystemIntakeDocumentUrlsQueryVariables>;
export const CreateSystemIntakeGRBDiscussionPostDocument = gql`
    mutation CreateSystemIntakeGRBDiscussionPost($input: createSystemIntakeGRBDiscussionPostInput!) {
  createSystemIntakeGRBDiscussionPost(input: $input) {
    ...SystemIntakeGRBReviewDiscussionPost
  }
}
    ${SystemIntakeGRBReviewDiscussionPostFragmentDoc}`;
export type CreateSystemIntakeGRBDiscussionPostMutationFn = Apollo.MutationFunction<CreateSystemIntakeGRBDiscussionPostMutation, CreateSystemIntakeGRBDiscussionPostMutationVariables>;

/**
 * __useCreateSystemIntakeGRBDiscussionPostMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeGRBDiscussionPostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeGRBDiscussionPostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeGrbDiscussionPostMutation, { data, loading, error }] = useCreateSystemIntakeGRBDiscussionPostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeGRBDiscussionPostMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeGRBDiscussionPostMutation, CreateSystemIntakeGRBDiscussionPostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeGRBDiscussionPostMutation, CreateSystemIntakeGRBDiscussionPostMutationVariables>(CreateSystemIntakeGRBDiscussionPostDocument, options);
      }
export type CreateSystemIntakeGRBDiscussionPostMutationHookResult = ReturnType<typeof useCreateSystemIntakeGRBDiscussionPostMutation>;
export type CreateSystemIntakeGRBDiscussionPostMutationResult = Apollo.MutationResult<CreateSystemIntakeGRBDiscussionPostMutation>;
export type CreateSystemIntakeGRBDiscussionPostMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeGRBDiscussionPostMutation, CreateSystemIntakeGRBDiscussionPostMutationVariables>;
export const CreateSystemIntakeGRBDiscussionReplyDocument = gql`
    mutation CreateSystemIntakeGRBDiscussionReply($input: createSystemIntakeGRBDiscussionReplyInput!) {
  createSystemIntakeGRBDiscussionReply(input: $input) {
    ...SystemIntakeGRBReviewDiscussionPost
  }
}
    ${SystemIntakeGRBReviewDiscussionPostFragmentDoc}`;
export type CreateSystemIntakeGRBDiscussionReplyMutationFn = Apollo.MutationFunction<CreateSystemIntakeGRBDiscussionReplyMutation, CreateSystemIntakeGRBDiscussionReplyMutationVariables>;

/**
 * __useCreateSystemIntakeGRBDiscussionReplyMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeGRBDiscussionReplyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeGRBDiscussionReplyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeGrbDiscussionReplyMutation, { data, loading, error }] = useCreateSystemIntakeGRBDiscussionReplyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeGRBDiscussionReplyMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeGRBDiscussionReplyMutation, CreateSystemIntakeGRBDiscussionReplyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeGRBDiscussionReplyMutation, CreateSystemIntakeGRBDiscussionReplyMutationVariables>(CreateSystemIntakeGRBDiscussionReplyDocument, options);
      }
export type CreateSystemIntakeGRBDiscussionReplyMutationHookResult = ReturnType<typeof useCreateSystemIntakeGRBDiscussionReplyMutation>;
export type CreateSystemIntakeGRBDiscussionReplyMutationResult = Apollo.MutationResult<CreateSystemIntakeGRBDiscussionReplyMutation>;
export type CreateSystemIntakeGRBDiscussionReplyMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeGRBDiscussionReplyMutation, CreateSystemIntakeGRBDiscussionReplyMutationVariables>;
export const CreateSystemIntakeGRBReviewersDocument = gql`
    mutation CreateSystemIntakeGRBReviewers($input: CreateSystemIntakeGRBReviewersInput!) {
  createSystemIntakeGRBReviewers(input: $input) {
    reviewers {
      ...SystemIntakeGRBReviewer
    }
  }
}
    ${SystemIntakeGRBReviewerFragmentDoc}`;
export type CreateSystemIntakeGRBReviewersMutationFn = Apollo.MutationFunction<CreateSystemIntakeGRBReviewersMutation, CreateSystemIntakeGRBReviewersMutationVariables>;

/**
 * __useCreateSystemIntakeGRBReviewersMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeGRBReviewersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeGRBReviewersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeGrbReviewersMutation, { data, loading, error }] = useCreateSystemIntakeGRBReviewersMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeGRBReviewersMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeGRBReviewersMutation, CreateSystemIntakeGRBReviewersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeGRBReviewersMutation, CreateSystemIntakeGRBReviewersMutationVariables>(CreateSystemIntakeGRBReviewersDocument, options);
      }
export type CreateSystemIntakeGRBReviewersMutationHookResult = ReturnType<typeof useCreateSystemIntakeGRBReviewersMutation>;
export type CreateSystemIntakeGRBReviewersMutationResult = Apollo.MutationResult<CreateSystemIntakeGRBReviewersMutation>;
export type CreateSystemIntakeGRBReviewersMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeGRBReviewersMutation, CreateSystemIntakeGRBReviewersMutationVariables>;
export const DeleteSystemIntakeGRBPresentationLinksDocument = gql`
    mutation DeleteSystemIntakeGRBPresentationLinks($input: DeleteSystemIntakeGRBPresentationLinksInput!) {
  deleteSystemIntakeGRBPresentationLinks(input: $input)
}
    `;
export type DeleteSystemIntakeGRBPresentationLinksMutationFn = Apollo.MutationFunction<DeleteSystemIntakeGRBPresentationLinksMutation, DeleteSystemIntakeGRBPresentationLinksMutationVariables>;

/**
 * __useDeleteSystemIntakeGRBPresentationLinksMutation__
 *
 * To run a mutation, you first call `useDeleteSystemIntakeGRBPresentationLinksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSystemIntakeGRBPresentationLinksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSystemIntakeGrbPresentationLinksMutation, { data, loading, error }] = useDeleteSystemIntakeGRBPresentationLinksMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteSystemIntakeGRBPresentationLinksMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSystemIntakeGRBPresentationLinksMutation, DeleteSystemIntakeGRBPresentationLinksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSystemIntakeGRBPresentationLinksMutation, DeleteSystemIntakeGRBPresentationLinksMutationVariables>(DeleteSystemIntakeGRBPresentationLinksDocument, options);
      }
export type DeleteSystemIntakeGRBPresentationLinksMutationHookResult = ReturnType<typeof useDeleteSystemIntakeGRBPresentationLinksMutation>;
export type DeleteSystemIntakeGRBPresentationLinksMutationResult = Apollo.MutationResult<DeleteSystemIntakeGRBPresentationLinksMutation>;
export type DeleteSystemIntakeGRBPresentationLinksMutationOptions = Apollo.BaseMutationOptions<DeleteSystemIntakeGRBPresentationLinksMutation, DeleteSystemIntakeGRBPresentationLinksMutationVariables>;
export const DeleteSystemIntakeGRBReviewerDocument = gql`
    mutation DeleteSystemIntakeGRBReviewer($input: DeleteSystemIntakeGRBReviewerInput!) {
  deleteSystemIntakeGRBReviewer(input: $input)
}
    `;
export type DeleteSystemIntakeGRBReviewerMutationFn = Apollo.MutationFunction<DeleteSystemIntakeGRBReviewerMutation, DeleteSystemIntakeGRBReviewerMutationVariables>;

/**
 * __useDeleteSystemIntakeGRBReviewerMutation__
 *
 * To run a mutation, you first call `useDeleteSystemIntakeGRBReviewerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSystemIntakeGRBReviewerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSystemIntakeGrbReviewerMutation, { data, loading, error }] = useDeleteSystemIntakeGRBReviewerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteSystemIntakeGRBReviewerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSystemIntakeGRBReviewerMutation, DeleteSystemIntakeGRBReviewerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSystemIntakeGRBReviewerMutation, DeleteSystemIntakeGRBReviewerMutationVariables>(DeleteSystemIntakeGRBReviewerDocument, options);
      }
export type DeleteSystemIntakeGRBReviewerMutationHookResult = ReturnType<typeof useDeleteSystemIntakeGRBReviewerMutation>;
export type DeleteSystemIntakeGRBReviewerMutationResult = Apollo.MutationResult<DeleteSystemIntakeGRBReviewerMutation>;
export type DeleteSystemIntakeGRBReviewerMutationOptions = Apollo.BaseMutationOptions<DeleteSystemIntakeGRBReviewerMutation, DeleteSystemIntakeGRBReviewerMutationVariables>;
export const GetGRBReviewersComparisonsDocument = gql`
    query getGRBReviewersComparisons($id: UUID!) {
  compareGRBReviewersByIntakeID(id: $id) {
    id
    requestName
    reviewers {
      id
      grbRole
      votingRole
      userAccount {
        id
        username
        commonName
        email
      }
      isCurrentReviewer
    }
  }
}
    `;

/**
 * __useGetGRBReviewersComparisonsQuery__
 *
 * To run a query within a React component, call `useGetGRBReviewersComparisonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGRBReviewersComparisonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGRBReviewersComparisonsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGRBReviewersComparisonsQuery(baseOptions: Apollo.QueryHookOptions<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables> & ({ variables: GetGRBReviewersComparisonsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables>(GetGRBReviewersComparisonsDocument, options);
      }
export function useGetGRBReviewersComparisonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables>(GetGRBReviewersComparisonsDocument, options);
        }
export function useGetGRBReviewersComparisonsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables>(GetGRBReviewersComparisonsDocument, options);
        }
export type GetGRBReviewersComparisonsQueryHookResult = ReturnType<typeof useGetGRBReviewersComparisonsQuery>;
export type GetGRBReviewersComparisonsLazyQueryHookResult = ReturnType<typeof useGetGRBReviewersComparisonsLazyQuery>;
export type GetGRBReviewersComparisonsSuspenseQueryHookResult = ReturnType<typeof useGetGRBReviewersComparisonsSuspenseQuery>;
export type GetGRBReviewersComparisonsQueryResult = Apollo.QueryResult<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables>;
export const GetSystemIntakeGRBDiscussionsDocument = gql`
    query GetSystemIntakeGRBDiscussions($id: UUID!) {
  systemIntake(id: $id) {
    id
    grbDiscussions {
      ...SystemIntakeGRBReviewDiscussion
    }
  }
}
    ${SystemIntakeGRBReviewDiscussionFragmentDoc}`;

/**
 * __useGetSystemIntakeGRBDiscussionsQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeGRBDiscussionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeGRBDiscussionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeGRBDiscussionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemIntakeGRBDiscussionsQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakeGRBDiscussionsQuery, GetSystemIntakeGRBDiscussionsQueryVariables> & ({ variables: GetSystemIntakeGRBDiscussionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakeGRBDiscussionsQuery, GetSystemIntakeGRBDiscussionsQueryVariables>(GetSystemIntakeGRBDiscussionsDocument, options);
      }
export function useGetSystemIntakeGRBDiscussionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakeGRBDiscussionsQuery, GetSystemIntakeGRBDiscussionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakeGRBDiscussionsQuery, GetSystemIntakeGRBDiscussionsQueryVariables>(GetSystemIntakeGRBDiscussionsDocument, options);
        }
export function useGetSystemIntakeGRBDiscussionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakeGRBDiscussionsQuery, GetSystemIntakeGRBDiscussionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakeGRBDiscussionsQuery, GetSystemIntakeGRBDiscussionsQueryVariables>(GetSystemIntakeGRBDiscussionsDocument, options);
        }
export type GetSystemIntakeGRBDiscussionsQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBDiscussionsQuery>;
export type GetSystemIntakeGRBDiscussionsLazyQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBDiscussionsLazyQuery>;
export type GetSystemIntakeGRBDiscussionsSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBDiscussionsSuspenseQuery>;
export type GetSystemIntakeGRBDiscussionsQueryResult = Apollo.QueryResult<GetSystemIntakeGRBDiscussionsQuery, GetSystemIntakeGRBDiscussionsQueryVariables>;
export const GetSystemIntakeGRBReviewDocument = gql`
    query GetSystemIntakeGRBReview($id: UUID!) {
  systemIntake(id: $id) {
    ...SystemIntakeGRBReview
  }
}
    ${SystemIntakeGRBReviewFragmentDoc}`;

/**
 * __useGetSystemIntakeGRBReviewQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeGRBReviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeGRBReviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeGRBReviewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemIntakeGRBReviewQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakeGRBReviewQuery, GetSystemIntakeGRBReviewQueryVariables> & ({ variables: GetSystemIntakeGRBReviewQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakeGRBReviewQuery, GetSystemIntakeGRBReviewQueryVariables>(GetSystemIntakeGRBReviewDocument, options);
      }
export function useGetSystemIntakeGRBReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakeGRBReviewQuery, GetSystemIntakeGRBReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakeGRBReviewQuery, GetSystemIntakeGRBReviewQueryVariables>(GetSystemIntakeGRBReviewDocument, options);
        }
export function useGetSystemIntakeGRBReviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakeGRBReviewQuery, GetSystemIntakeGRBReviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakeGRBReviewQuery, GetSystemIntakeGRBReviewQueryVariables>(GetSystemIntakeGRBReviewDocument, options);
        }
export type GetSystemIntakeGRBReviewQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBReviewQuery>;
export type GetSystemIntakeGRBReviewLazyQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBReviewLazyQuery>;
export type GetSystemIntakeGRBReviewSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBReviewSuspenseQuery>;
export type GetSystemIntakeGRBReviewQueryResult = Apollo.QueryResult<GetSystemIntakeGRBReviewQuery, GetSystemIntakeGRBReviewQueryVariables>;
export const GetSystemIntakesWithReviewRequestedDocument = gql`
    query GetSystemIntakesWithReviewRequested {
  systemIntakesWithReviewRequested {
    ...SystemIntakeWithReviewRequested
  }
}
    ${SystemIntakeWithReviewRequestedFragmentDoc}`;

/**
 * __useGetSystemIntakesWithReviewRequestedQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakesWithReviewRequestedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakesWithReviewRequestedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakesWithReviewRequestedQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSystemIntakesWithReviewRequestedQuery(baseOptions?: Apollo.QueryHookOptions<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>(GetSystemIntakesWithReviewRequestedDocument, options);
      }
export function useGetSystemIntakesWithReviewRequestedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>(GetSystemIntakesWithReviewRequestedDocument, options);
        }
export function useGetSystemIntakesWithReviewRequestedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>(GetSystemIntakesWithReviewRequestedDocument, options);
        }
export type GetSystemIntakesWithReviewRequestedQueryHookResult = ReturnType<typeof useGetSystemIntakesWithReviewRequestedQuery>;
export type GetSystemIntakesWithReviewRequestedLazyQueryHookResult = ReturnType<typeof useGetSystemIntakesWithReviewRequestedLazyQuery>;
export type GetSystemIntakesWithReviewRequestedSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakesWithReviewRequestedSuspenseQuery>;
export type GetSystemIntakesWithReviewRequestedQueryResult = Apollo.QueryResult<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>;
export const SendPresentationDeckReminderDocument = gql`
    mutation SendPresentationDeckReminder($systemIntakeID: UUID!) {
  sendGRBReviewPresentationDeckReminderEmail(systemIntakeID: $systemIntakeID)
}
    `;
export type SendPresentationDeckReminderMutationFn = Apollo.MutationFunction<SendPresentationDeckReminderMutation, SendPresentationDeckReminderMutationVariables>;

/**
 * __useSendPresentationDeckReminderMutation__
 *
 * To run a mutation, you first call `useSendPresentationDeckReminderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendPresentationDeckReminderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendPresentationDeckReminderMutation, { data, loading, error }] = useSendPresentationDeckReminderMutation({
 *   variables: {
 *      systemIntakeID: // value for 'systemIntakeID'
 *   },
 * });
 */
export function useSendPresentationDeckReminderMutation(baseOptions?: Apollo.MutationHookOptions<SendPresentationDeckReminderMutation, SendPresentationDeckReminderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendPresentationDeckReminderMutation, SendPresentationDeckReminderMutationVariables>(SendPresentationDeckReminderDocument, options);
      }
export type SendPresentationDeckReminderMutationHookResult = ReturnType<typeof useSendPresentationDeckReminderMutation>;
export type SendPresentationDeckReminderMutationResult = Apollo.MutationResult<SendPresentationDeckReminderMutation>;
export type SendPresentationDeckReminderMutationOptions = Apollo.BaseMutationOptions<SendPresentationDeckReminderMutation, SendPresentationDeckReminderMutationVariables>;
export const SetSystemIntakeGRBPresentationLinksDocument = gql`
    mutation SetSystemIntakeGRBPresentationLinks($input: SystemIntakeGRBPresentationLinksInput!) {
  setSystemIntakeGRBPresentationLinks(input: $input) {
    createdAt
  }
}
    `;
export type SetSystemIntakeGRBPresentationLinksMutationFn = Apollo.MutationFunction<SetSystemIntakeGRBPresentationLinksMutation, SetSystemIntakeGRBPresentationLinksMutationVariables>;

/**
 * __useSetSystemIntakeGRBPresentationLinksMutation__
 *
 * To run a mutation, you first call `useSetSystemIntakeGRBPresentationLinksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSystemIntakeGRBPresentationLinksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSystemIntakeGrbPresentationLinksMutation, { data, loading, error }] = useSetSystemIntakeGRBPresentationLinksMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetSystemIntakeGRBPresentationLinksMutation(baseOptions?: Apollo.MutationHookOptions<SetSystemIntakeGRBPresentationLinksMutation, SetSystemIntakeGRBPresentationLinksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSystemIntakeGRBPresentationLinksMutation, SetSystemIntakeGRBPresentationLinksMutationVariables>(SetSystemIntakeGRBPresentationLinksDocument, options);
      }
export type SetSystemIntakeGRBPresentationLinksMutationHookResult = ReturnType<typeof useSetSystemIntakeGRBPresentationLinksMutation>;
export type SetSystemIntakeGRBPresentationLinksMutationResult = Apollo.MutationResult<SetSystemIntakeGRBPresentationLinksMutation>;
export type SetSystemIntakeGRBPresentationLinksMutationOptions = Apollo.BaseMutationOptions<SetSystemIntakeGRBPresentationLinksMutation, SetSystemIntakeGRBPresentationLinksMutationVariables>;
export const StartGRBReviewDocument = gql`
    mutation StartGRBReview($input: StartGRBReviewInput!) {
  startGRBReview(input: $input)
}
    `;
export type StartGRBReviewMutationFn = Apollo.MutationFunction<StartGRBReviewMutation, StartGRBReviewMutationVariables>;

/**
 * __useStartGRBReviewMutation__
 *
 * To run a mutation, you first call `useStartGRBReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartGRBReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startGrbReviewMutation, { data, loading, error }] = useStartGRBReviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStartGRBReviewMutation(baseOptions?: Apollo.MutationHookOptions<StartGRBReviewMutation, StartGRBReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartGRBReviewMutation, StartGRBReviewMutationVariables>(StartGRBReviewDocument, options);
      }
export type StartGRBReviewMutationHookResult = ReturnType<typeof useStartGRBReviewMutation>;
export type StartGRBReviewMutationResult = Apollo.MutationResult<StartGRBReviewMutation>;
export type StartGRBReviewMutationOptions = Apollo.BaseMutationOptions<StartGRBReviewMutation, StartGRBReviewMutationVariables>;
export const UpdateSystemIntakeGRBReviewTypeDocument = gql`
    mutation UpdateSystemIntakeGRBReviewType($input: updateSystemIntakeGRBReviewTypeInput!) {
  updateSystemIntakeGRBReviewType(input: $input) {
    systemIntake {
      ...SystemIntakeGRBReview
    }
  }
}
    ${SystemIntakeGRBReviewFragmentDoc}`;
export type UpdateSystemIntakeGRBReviewTypeMutationFn = Apollo.MutationFunction<UpdateSystemIntakeGRBReviewTypeMutation, UpdateSystemIntakeGRBReviewTypeMutationVariables>;

/**
 * __useUpdateSystemIntakeGRBReviewTypeMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeGRBReviewTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeGRBReviewTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeGrbReviewTypeMutation, { data, loading, error }] = useUpdateSystemIntakeGRBReviewTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeGRBReviewTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeGRBReviewTypeMutation, UpdateSystemIntakeGRBReviewTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeGRBReviewTypeMutation, UpdateSystemIntakeGRBReviewTypeMutationVariables>(UpdateSystemIntakeGRBReviewTypeDocument, options);
      }
export type UpdateSystemIntakeGRBReviewTypeMutationHookResult = ReturnType<typeof useUpdateSystemIntakeGRBReviewTypeMutation>;
export type UpdateSystemIntakeGRBReviewTypeMutationResult = Apollo.MutationResult<UpdateSystemIntakeGRBReviewTypeMutation>;
export type UpdateSystemIntakeGRBReviewTypeMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeGRBReviewTypeMutation, UpdateSystemIntakeGRBReviewTypeMutationVariables>;
export const UpdateSystemIntakeGRBReviewerDocument = gql`
    mutation UpdateSystemIntakeGRBReviewer($input: UpdateSystemIntakeGRBReviewerInput!) {
  updateSystemIntakeGRBReviewer(input: $input) {
    ...SystemIntakeGRBReviewer
  }
}
    ${SystemIntakeGRBReviewerFragmentDoc}`;
export type UpdateSystemIntakeGRBReviewerMutationFn = Apollo.MutationFunction<UpdateSystemIntakeGRBReviewerMutation, UpdateSystemIntakeGRBReviewerMutationVariables>;

/**
 * __useUpdateSystemIntakeGRBReviewerMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeGRBReviewerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeGRBReviewerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeGrbReviewerMutation, { data, loading, error }] = useUpdateSystemIntakeGRBReviewerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeGRBReviewerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeGRBReviewerMutation, UpdateSystemIntakeGRBReviewerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeGRBReviewerMutation, UpdateSystemIntakeGRBReviewerMutationVariables>(UpdateSystemIntakeGRBReviewerDocument, options);
      }
export type UpdateSystemIntakeGRBReviewerMutationHookResult = ReturnType<typeof useUpdateSystemIntakeGRBReviewerMutation>;
export type UpdateSystemIntakeGRBReviewerMutationResult = Apollo.MutationResult<UpdateSystemIntakeGRBReviewerMutation>;
export type UpdateSystemIntakeGRBReviewerMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeGRBReviewerMutation, UpdateSystemIntakeGRBReviewerMutationVariables>;
export const UploadSystemIntakeGRBPresentationDeckDocument = gql`
    mutation UploadSystemIntakeGRBPresentationDeck($input: UploadSystemIntakeGRBPresentationDeckInput!) {
  uploadSystemIntakeGRBPresentationDeck(input: $input) {
    createdAt
  }
}
    `;
export type UploadSystemIntakeGRBPresentationDeckMutationFn = Apollo.MutationFunction<UploadSystemIntakeGRBPresentationDeckMutation, UploadSystemIntakeGRBPresentationDeckMutationVariables>;

/**
 * __useUploadSystemIntakeGRBPresentationDeckMutation__
 *
 * To run a mutation, you first call `useUploadSystemIntakeGRBPresentationDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadSystemIntakeGRBPresentationDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadSystemIntakeGrbPresentationDeckMutation, { data, loading, error }] = useUploadSystemIntakeGRBPresentationDeckMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadSystemIntakeGRBPresentationDeckMutation(baseOptions?: Apollo.MutationHookOptions<UploadSystemIntakeGRBPresentationDeckMutation, UploadSystemIntakeGRBPresentationDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadSystemIntakeGRBPresentationDeckMutation, UploadSystemIntakeGRBPresentationDeckMutationVariables>(UploadSystemIntakeGRBPresentationDeckDocument, options);
      }
export type UploadSystemIntakeGRBPresentationDeckMutationHookResult = ReturnType<typeof useUploadSystemIntakeGRBPresentationDeckMutation>;
export type UploadSystemIntakeGRBPresentationDeckMutationResult = Apollo.MutationResult<UploadSystemIntakeGRBPresentationDeckMutation>;
export type UploadSystemIntakeGRBPresentationDeckMutationOptions = Apollo.BaseMutationOptions<UploadSystemIntakeGRBPresentationDeckMutation, UploadSystemIntakeGRBPresentationDeckMutationVariables>;
export const ArchiveSystemIntakeDocument = gql`
    mutation ArchiveSystemIntake($id: UUID!) {
  archiveSystemIntake(id: $id) {
    id
    archivedAt
  }
}
    `;
export type ArchiveSystemIntakeMutationFn = Apollo.MutationFunction<ArchiveSystemIntakeMutation, ArchiveSystemIntakeMutationVariables>;

/**
 * __useArchiveSystemIntakeMutation__
 *
 * To run a mutation, you first call `useArchiveSystemIntakeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveSystemIntakeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveSystemIntakeMutation, { data, loading, error }] = useArchiveSystemIntakeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveSystemIntakeMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveSystemIntakeMutation, ArchiveSystemIntakeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveSystemIntakeMutation, ArchiveSystemIntakeMutationVariables>(ArchiveSystemIntakeDocument, options);
      }
export type ArchiveSystemIntakeMutationHookResult = ReturnType<typeof useArchiveSystemIntakeMutation>;
export type ArchiveSystemIntakeMutationResult = Apollo.MutationResult<ArchiveSystemIntakeMutation>;
export type ArchiveSystemIntakeMutationOptions = Apollo.BaseMutationOptions<ArchiveSystemIntakeMutation, ArchiveSystemIntakeMutationVariables>;
export const CreateSystemIntakeNoteDocument = gql`
    mutation CreateSystemIntakeNote($input: CreateSystemIntakeNoteInput!) {
  createSystemIntakeNote(input: $input) {
    id
    createdAt
    content
    author {
      name
      eua
    }
  }
}
    `;
export type CreateSystemIntakeNoteMutationFn = Apollo.MutationFunction<CreateSystemIntakeNoteMutation, CreateSystemIntakeNoteMutationVariables>;

/**
 * __useCreateSystemIntakeNoteMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeNoteMutation, { data, loading, error }] = useCreateSystemIntakeNoteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeNoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeNoteMutation, CreateSystemIntakeNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeNoteMutation, CreateSystemIntakeNoteMutationVariables>(CreateSystemIntakeNoteDocument, options);
      }
export type CreateSystemIntakeNoteMutationHookResult = ReturnType<typeof useCreateSystemIntakeNoteMutation>;
export type CreateSystemIntakeNoteMutationResult = Apollo.MutationResult<CreateSystemIntakeNoteMutation>;
export type CreateSystemIntakeNoteMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeNoteMutation, CreateSystemIntakeNoteMutationVariables>;
export const GetGovernanceRequestFeedbackDocument = gql`
    query GetGovernanceRequestFeedback($intakeID: UUID!) {
  systemIntake(id: $intakeID) {
    id
    requestName
    governanceRequestFeedbacks {
      ...GovernanceRequestFeedbackFragment
    }
  }
}
    ${GovernanceRequestFeedbackFragmentFragmentDoc}`;

/**
 * __useGetGovernanceRequestFeedbackQuery__
 *
 * To run a query within a React component, call `useGetGovernanceRequestFeedbackQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGovernanceRequestFeedbackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGovernanceRequestFeedbackQuery({
 *   variables: {
 *      intakeID: // value for 'intakeID'
 *   },
 * });
 */
export function useGetGovernanceRequestFeedbackQuery(baseOptions: Apollo.QueryHookOptions<GetGovernanceRequestFeedbackQuery, GetGovernanceRequestFeedbackQueryVariables> & ({ variables: GetGovernanceRequestFeedbackQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGovernanceRequestFeedbackQuery, GetGovernanceRequestFeedbackQueryVariables>(GetGovernanceRequestFeedbackDocument, options);
      }
export function useGetGovernanceRequestFeedbackLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGovernanceRequestFeedbackQuery, GetGovernanceRequestFeedbackQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGovernanceRequestFeedbackQuery, GetGovernanceRequestFeedbackQueryVariables>(GetGovernanceRequestFeedbackDocument, options);
        }
export function useGetGovernanceRequestFeedbackSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGovernanceRequestFeedbackQuery, GetGovernanceRequestFeedbackQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGovernanceRequestFeedbackQuery, GetGovernanceRequestFeedbackQueryVariables>(GetGovernanceRequestFeedbackDocument, options);
        }
export type GetGovernanceRequestFeedbackQueryHookResult = ReturnType<typeof useGetGovernanceRequestFeedbackQuery>;
export type GetGovernanceRequestFeedbackLazyQueryHookResult = ReturnType<typeof useGetGovernanceRequestFeedbackLazyQuery>;
export type GetGovernanceRequestFeedbackSuspenseQueryHookResult = ReturnType<typeof useGetGovernanceRequestFeedbackSuspenseQuery>;
export type GetGovernanceRequestFeedbackQueryResult = Apollo.QueryResult<GetGovernanceRequestFeedbackQuery, GetGovernanceRequestFeedbackQueryVariables>;
export const GetGovernanceTaskListDocument = gql`
    query GetGovernanceTaskList($id: UUID!) {
  systemIntake(id: $id) {
    id
    requestName
    itGovTaskStatuses {
      intakeFormStatus
      feedbackFromInitialReviewStatus
      bizCaseDraftStatus
      grtMeetingStatus
      bizCaseFinalStatus
      grbMeetingStatus
      decisionAndNextStepsStatus
    }
    governanceRequestFeedbacks {
      id
      targetForm
    }
    submittedAt
    updatedAt
    grtDate
    grbDate
    grbReviewType
    grbReviewStartedAt
    grbReviewAsyncEndDate
    grbReviewAsyncGRBMeetingTime
    step
    state
    decisionState
    businessCase {
      id
    }
    relationType
    contractName
    contractNumbers {
      contractNumber
    }
    systems {
      id
      name
      acronym
    }
    grbPresentationLinks {
      presentationDeckFileName
      presentationDeckFileStatus
      presentationDeckFileURL
    }
  }
}
    `;

/**
 * __useGetGovernanceTaskListQuery__
 *
 * To run a query within a React component, call `useGetGovernanceTaskListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGovernanceTaskListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGovernanceTaskListQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGovernanceTaskListQuery(baseOptions: Apollo.QueryHookOptions<GetGovernanceTaskListQuery, GetGovernanceTaskListQueryVariables> & ({ variables: GetGovernanceTaskListQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGovernanceTaskListQuery, GetGovernanceTaskListQueryVariables>(GetGovernanceTaskListDocument, options);
      }
export function useGetGovernanceTaskListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGovernanceTaskListQuery, GetGovernanceTaskListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGovernanceTaskListQuery, GetGovernanceTaskListQueryVariables>(GetGovernanceTaskListDocument, options);
        }
export function useGetGovernanceTaskListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGovernanceTaskListQuery, GetGovernanceTaskListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGovernanceTaskListQuery, GetGovernanceTaskListQueryVariables>(GetGovernanceTaskListDocument, options);
        }
export type GetGovernanceTaskListQueryHookResult = ReturnType<typeof useGetGovernanceTaskListQuery>;
export type GetGovernanceTaskListLazyQueryHookResult = ReturnType<typeof useGetGovernanceTaskListLazyQuery>;
export type GetGovernanceTaskListSuspenseQueryHookResult = ReturnType<typeof useGetGovernanceTaskListSuspenseQuery>;
export type GetGovernanceTaskListQueryResult = Apollo.QueryResult<GetGovernanceTaskListQuery, GetGovernanceTaskListQueryVariables>;
export const GetSystemIntakeDocument = gql`
    query GetSystemIntake($id: UUID!) {
  systemIntake(id: $id) {
    ...SystemIntakeFragment
  }
}
    ${SystemIntakeFragmentFragmentDoc}`;

/**
 * __useGetSystemIntakeQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemIntakeQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakeQuery, GetSystemIntakeQueryVariables> & ({ variables: GetSystemIntakeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakeQuery, GetSystemIntakeQueryVariables>(GetSystemIntakeDocument, options);
      }
export function useGetSystemIntakeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakeQuery, GetSystemIntakeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakeQuery, GetSystemIntakeQueryVariables>(GetSystemIntakeDocument, options);
        }
export function useGetSystemIntakeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakeQuery, GetSystemIntakeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakeQuery, GetSystemIntakeQueryVariables>(GetSystemIntakeDocument, options);
        }
export type GetSystemIntakeQueryHookResult = ReturnType<typeof useGetSystemIntakeQuery>;
export type GetSystemIntakeLazyQueryHookResult = ReturnType<typeof useGetSystemIntakeLazyQuery>;
export type GetSystemIntakeSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakeSuspenseQuery>;
export type GetSystemIntakeQueryResult = Apollo.QueryResult<GetSystemIntakeQuery, GetSystemIntakeQueryVariables>;
export const GetSystemIntakeRelatedRequestsDocument = gql`
    query GetSystemIntakeRelatedRequests($systemIntakeID: UUID!) {
  systemIntake(id: $systemIntakeID) {
    id
    relatedIntakes {
      id
      requestName
      contractNumbers {
        contractNumber
      }
      statusAdmin
      statusRequester
      submittedAt
      lcid
    }
    relatedTRBRequests {
      id
      name
      contractNumbers {
        contractNumber
      }
      status
      createdAt
    }
  }
}
    `;

/**
 * __useGetSystemIntakeRelatedRequestsQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeRelatedRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeRelatedRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeRelatedRequestsQuery({
 *   variables: {
 *      systemIntakeID: // value for 'systemIntakeID'
 *   },
 * });
 */
export function useGetSystemIntakeRelatedRequestsQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables> & ({ variables: GetSystemIntakeRelatedRequestsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables>(GetSystemIntakeRelatedRequestsDocument, options);
      }
export function useGetSystemIntakeRelatedRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables>(GetSystemIntakeRelatedRequestsDocument, options);
        }
export function useGetSystemIntakeRelatedRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables>(GetSystemIntakeRelatedRequestsDocument, options);
        }
export type GetSystemIntakeRelatedRequestsQueryHookResult = ReturnType<typeof useGetSystemIntakeRelatedRequestsQuery>;
export type GetSystemIntakeRelatedRequestsLazyQueryHookResult = ReturnType<typeof useGetSystemIntakeRelatedRequestsLazyQuery>;
export type GetSystemIntakeRelatedRequestsSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakeRelatedRequestsSuspenseQuery>;
export type GetSystemIntakeRelatedRequestsQueryResult = Apollo.QueryResult<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables>;
export const GetSystemIntakeRelationDocument = gql`
    query GetSystemIntakeRelation($id: UUID!) {
  systemIntake(id: $id) {
    id
    relationType
    contractName
    contractNumbers {
      contractNumber
    }
    systems {
      id
      name
      acronym
    }
  }
  cedarSystems {
    id
    name
    acronym
  }
}
    `;

/**
 * __useGetSystemIntakeRelationQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeRelationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeRelationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeRelationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemIntakeRelationQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables> & ({ variables: GetSystemIntakeRelationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables>(GetSystemIntakeRelationDocument, options);
      }
export function useGetSystemIntakeRelationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables>(GetSystemIntakeRelationDocument, options);
        }
export function useGetSystemIntakeRelationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables>(GetSystemIntakeRelationDocument, options);
        }
export type GetSystemIntakeRelationQueryHookResult = ReturnType<typeof useGetSystemIntakeRelationQuery>;
export type GetSystemIntakeRelationLazyQueryHookResult = ReturnType<typeof useGetSystemIntakeRelationLazyQuery>;
export type GetSystemIntakeRelationSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakeRelationSuspenseQuery>;
export type GetSystemIntakeRelationQueryResult = Apollo.QueryResult<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables>;
export const GetSystemIntakesTableDocument = gql`
    query GetSystemIntakesTable($openRequests: Boolean!) {
  systemIntakes(openRequests: $openRequests) {
    id
    euaUserId
    requestName
    statusAdmin
    state
    requesterName
    requesterComponent
    businessOwner {
      name
      component
    }
    productManager {
      name
      component
    }
    isso {
      name
    }
    trbCollaboratorName
    oitSecurityCollaboratorName
    eaCollaboratorName
    existingFunding
    fundingSources {
      ...FundingSourceFragment
    }
    annualSpending {
      currentAnnualSpending
      currentAnnualSpendingITPortion
      plannedYearOneSpending
      plannedYearOneSpendingITPortion
    }
    contract {
      hasContract
      contractor
      vehicle
      startDate {
        day
        month
        year
      }
      endDate {
        day
        month
        year
      }
    }
    contractName
    contractNumbers {
      contractNumber
    }
    systems {
      id
      name
    }
    businessNeed
    businessSolution
    currentStage
    needsEaSupport
    grtDate
    grbDate
    lcid
    lcidScope
    lcidExpiresAt
    adminLead
    notes {
      id
      createdAt
      content
    }
    actions {
      id
      createdAt
    }
    hasUiChanges
    usesAiTech
    usingSoftware
    acquisitionMethods
    decidedAt
    submittedAt
    updatedAt
    createdAt
    archivedAt
  }
}
    ${FundingSourceFragmentFragmentDoc}`;

/**
 * __useGetSystemIntakesTableQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakesTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakesTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakesTableQuery({
 *   variables: {
 *      openRequests: // value for 'openRequests'
 *   },
 * });
 */
export function useGetSystemIntakesTableQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakesTableQuery, GetSystemIntakesTableQueryVariables> & ({ variables: GetSystemIntakesTableQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakesTableQuery, GetSystemIntakesTableQueryVariables>(GetSystemIntakesTableDocument, options);
      }
export function useGetSystemIntakesTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakesTableQuery, GetSystemIntakesTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakesTableQuery, GetSystemIntakesTableQueryVariables>(GetSystemIntakesTableDocument, options);
        }
export function useGetSystemIntakesTableSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakesTableQuery, GetSystemIntakesTableQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakesTableQuery, GetSystemIntakesTableQueryVariables>(GetSystemIntakesTableDocument, options);
        }
export type GetSystemIntakesTableQueryHookResult = ReturnType<typeof useGetSystemIntakesTableQuery>;
export type GetSystemIntakesTableLazyQueryHookResult = ReturnType<typeof useGetSystemIntakesTableLazyQuery>;
export type GetSystemIntakesTableSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakesTableSuspenseQuery>;
export type GetSystemIntakesTableQueryResult = Apollo.QueryResult<GetSystemIntakesTableQuery, GetSystemIntakesTableQueryVariables>;
export const GetSystemsDocument = gql`
    query GetSystems($openRequests: Boolean!) {
  systemIntakes(openRequests: $openRequests) {
    id
    lcid
    businessOwner {
      name
      component
    }
  }
}
    `;

/**
 * __useGetSystemsQuery__
 *
 * To run a query within a React component, call `useGetSystemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemsQuery({
 *   variables: {
 *      openRequests: // value for 'openRequests'
 *   },
 * });
 */
export function useGetSystemsQuery(baseOptions: Apollo.QueryHookOptions<GetSystemsQuery, GetSystemsQueryVariables> & ({ variables: GetSystemsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemsQuery, GetSystemsQueryVariables>(GetSystemsDocument, options);
      }
export function useGetSystemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemsQuery, GetSystemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemsQuery, GetSystemsQueryVariables>(GetSystemsDocument, options);
        }
export function useGetSystemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemsQuery, GetSystemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemsQuery, GetSystemsQueryVariables>(GetSystemsDocument, options);
        }
export type GetSystemsQueryHookResult = ReturnType<typeof useGetSystemsQuery>;
export type GetSystemsLazyQueryHookResult = ReturnType<typeof useGetSystemsLazyQuery>;
export type GetSystemsSuspenseQueryHookResult = ReturnType<typeof useGetSystemsSuspenseQuery>;
export type GetSystemsQueryResult = Apollo.QueryResult<GetSystemsQuery, GetSystemsQueryVariables>;
export const SetSystemIntakeRelationNewSystemDocument = gql`
    mutation SetSystemIntakeRelationNewSystem($input: SetSystemIntakeRelationNewSystemInput!) {
  setSystemIntakeRelationNewSystem(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type SetSystemIntakeRelationNewSystemMutationFn = Apollo.MutationFunction<SetSystemIntakeRelationNewSystemMutation, SetSystemIntakeRelationNewSystemMutationVariables>;

/**
 * __useSetSystemIntakeRelationNewSystemMutation__
 *
 * To run a mutation, you first call `useSetSystemIntakeRelationNewSystemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSystemIntakeRelationNewSystemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSystemIntakeRelationNewSystemMutation, { data, loading, error }] = useSetSystemIntakeRelationNewSystemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetSystemIntakeRelationNewSystemMutation(baseOptions?: Apollo.MutationHookOptions<SetSystemIntakeRelationNewSystemMutation, SetSystemIntakeRelationNewSystemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSystemIntakeRelationNewSystemMutation, SetSystemIntakeRelationNewSystemMutationVariables>(SetSystemIntakeRelationNewSystemDocument, options);
      }
export type SetSystemIntakeRelationNewSystemMutationHookResult = ReturnType<typeof useSetSystemIntakeRelationNewSystemMutation>;
export type SetSystemIntakeRelationNewSystemMutationResult = Apollo.MutationResult<SetSystemIntakeRelationNewSystemMutation>;
export type SetSystemIntakeRelationNewSystemMutationOptions = Apollo.BaseMutationOptions<SetSystemIntakeRelationNewSystemMutation, SetSystemIntakeRelationNewSystemMutationVariables>;
export const SetSystemIntakeRelationExistingSystemDocument = gql`
    mutation SetSystemIntakeRelationExistingSystem($input: SetSystemIntakeRelationExistingSystemInput!) {
  setSystemIntakeRelationExistingSystem(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type SetSystemIntakeRelationExistingSystemMutationFn = Apollo.MutationFunction<SetSystemIntakeRelationExistingSystemMutation, SetSystemIntakeRelationExistingSystemMutationVariables>;

/**
 * __useSetSystemIntakeRelationExistingSystemMutation__
 *
 * To run a mutation, you first call `useSetSystemIntakeRelationExistingSystemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSystemIntakeRelationExistingSystemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSystemIntakeRelationExistingSystemMutation, { data, loading, error }] = useSetSystemIntakeRelationExistingSystemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetSystemIntakeRelationExistingSystemMutation(baseOptions?: Apollo.MutationHookOptions<SetSystemIntakeRelationExistingSystemMutation, SetSystemIntakeRelationExistingSystemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSystemIntakeRelationExistingSystemMutation, SetSystemIntakeRelationExistingSystemMutationVariables>(SetSystemIntakeRelationExistingSystemDocument, options);
      }
export type SetSystemIntakeRelationExistingSystemMutationHookResult = ReturnType<typeof useSetSystemIntakeRelationExistingSystemMutation>;
export type SetSystemIntakeRelationExistingSystemMutationResult = Apollo.MutationResult<SetSystemIntakeRelationExistingSystemMutation>;
export type SetSystemIntakeRelationExistingSystemMutationOptions = Apollo.BaseMutationOptions<SetSystemIntakeRelationExistingSystemMutation, SetSystemIntakeRelationExistingSystemMutationVariables>;
export const SetSystemIntakeRelationExistingServiceDocument = gql`
    mutation SetSystemIntakeRelationExistingService($input: SetSystemIntakeRelationExistingServiceInput!) {
  setSystemIntakeRelationExistingService(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type SetSystemIntakeRelationExistingServiceMutationFn = Apollo.MutationFunction<SetSystemIntakeRelationExistingServiceMutation, SetSystemIntakeRelationExistingServiceMutationVariables>;

/**
 * __useSetSystemIntakeRelationExistingServiceMutation__
 *
 * To run a mutation, you first call `useSetSystemIntakeRelationExistingServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSystemIntakeRelationExistingServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSystemIntakeRelationExistingServiceMutation, { data, loading, error }] = useSetSystemIntakeRelationExistingServiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetSystemIntakeRelationExistingServiceMutation(baseOptions?: Apollo.MutationHookOptions<SetSystemIntakeRelationExistingServiceMutation, SetSystemIntakeRelationExistingServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSystemIntakeRelationExistingServiceMutation, SetSystemIntakeRelationExistingServiceMutationVariables>(SetSystemIntakeRelationExistingServiceDocument, options);
      }
export type SetSystemIntakeRelationExistingServiceMutationHookResult = ReturnType<typeof useSetSystemIntakeRelationExistingServiceMutation>;
export type SetSystemIntakeRelationExistingServiceMutationResult = Apollo.MutationResult<SetSystemIntakeRelationExistingServiceMutation>;
export type SetSystemIntakeRelationExistingServiceMutationOptions = Apollo.BaseMutationOptions<SetSystemIntakeRelationExistingServiceMutation, SetSystemIntakeRelationExistingServiceMutationVariables>;
export const UnlinkSystemIntakeRelationDocument = gql`
    mutation UnlinkSystemIntakeRelation($intakeID: UUID!) {
  unlinkSystemIntakeRelation(intakeID: $intakeID) {
    systemIntake {
      id
    }
  }
}
    `;
export type UnlinkSystemIntakeRelationMutationFn = Apollo.MutationFunction<UnlinkSystemIntakeRelationMutation, UnlinkSystemIntakeRelationMutationVariables>;

/**
 * __useUnlinkSystemIntakeRelationMutation__
 *
 * To run a mutation, you first call `useUnlinkSystemIntakeRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkSystemIntakeRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkSystemIntakeRelationMutation, { data, loading, error }] = useUnlinkSystemIntakeRelationMutation({
 *   variables: {
 *      intakeID: // value for 'intakeID'
 *   },
 * });
 */
export function useUnlinkSystemIntakeRelationMutation(baseOptions?: Apollo.MutationHookOptions<UnlinkSystemIntakeRelationMutation, UnlinkSystemIntakeRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnlinkSystemIntakeRelationMutation, UnlinkSystemIntakeRelationMutationVariables>(UnlinkSystemIntakeRelationDocument, options);
      }
export type UnlinkSystemIntakeRelationMutationHookResult = ReturnType<typeof useUnlinkSystemIntakeRelationMutation>;
export type UnlinkSystemIntakeRelationMutationResult = Apollo.MutationResult<UnlinkSystemIntakeRelationMutation>;
export type UnlinkSystemIntakeRelationMutationOptions = Apollo.BaseMutationOptions<UnlinkSystemIntakeRelationMutation, UnlinkSystemIntakeRelationMutationVariables>;
export const SetTrbRequestRelationNewSystemDocument = gql`
    mutation SetTrbRequestRelationNewSystem($input: SetTRBRequestRelationNewSystemInput!) {
  setTRBRequestRelationNewSystem(input: $input) {
    id
  }
}
    `;
export type SetTrbRequestRelationNewSystemMutationFn = Apollo.MutationFunction<SetTrbRequestRelationNewSystemMutation, SetTrbRequestRelationNewSystemMutationVariables>;

/**
 * __useSetTrbRequestRelationNewSystemMutation__
 *
 * To run a mutation, you first call `useSetTrbRequestRelationNewSystemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTrbRequestRelationNewSystemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTrbRequestRelationNewSystemMutation, { data, loading, error }] = useSetTrbRequestRelationNewSystemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTrbRequestRelationNewSystemMutation(baseOptions?: Apollo.MutationHookOptions<SetTrbRequestRelationNewSystemMutation, SetTrbRequestRelationNewSystemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetTrbRequestRelationNewSystemMutation, SetTrbRequestRelationNewSystemMutationVariables>(SetTrbRequestRelationNewSystemDocument, options);
      }
export type SetTrbRequestRelationNewSystemMutationHookResult = ReturnType<typeof useSetTrbRequestRelationNewSystemMutation>;
export type SetTrbRequestRelationNewSystemMutationResult = Apollo.MutationResult<SetTrbRequestRelationNewSystemMutation>;
export type SetTrbRequestRelationNewSystemMutationOptions = Apollo.BaseMutationOptions<SetTrbRequestRelationNewSystemMutation, SetTrbRequestRelationNewSystemMutationVariables>;
export const SetTrbRequestRelationExistingSystemDocument = gql`
    mutation SetTrbRequestRelationExistingSystem($input: SetTRBRequestRelationExistingSystemInput!) {
  setTRBRequestRelationExistingSystem(input: $input) {
    id
  }
}
    `;
export type SetTrbRequestRelationExistingSystemMutationFn = Apollo.MutationFunction<SetTrbRequestRelationExistingSystemMutation, SetTrbRequestRelationExistingSystemMutationVariables>;

/**
 * __useSetTrbRequestRelationExistingSystemMutation__
 *
 * To run a mutation, you first call `useSetTrbRequestRelationExistingSystemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTrbRequestRelationExistingSystemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTrbRequestRelationExistingSystemMutation, { data, loading, error }] = useSetTrbRequestRelationExistingSystemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTrbRequestRelationExistingSystemMutation(baseOptions?: Apollo.MutationHookOptions<SetTrbRequestRelationExistingSystemMutation, SetTrbRequestRelationExistingSystemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetTrbRequestRelationExistingSystemMutation, SetTrbRequestRelationExistingSystemMutationVariables>(SetTrbRequestRelationExistingSystemDocument, options);
      }
export type SetTrbRequestRelationExistingSystemMutationHookResult = ReturnType<typeof useSetTrbRequestRelationExistingSystemMutation>;
export type SetTrbRequestRelationExistingSystemMutationResult = Apollo.MutationResult<SetTrbRequestRelationExistingSystemMutation>;
export type SetTrbRequestRelationExistingSystemMutationOptions = Apollo.BaseMutationOptions<SetTrbRequestRelationExistingSystemMutation, SetTrbRequestRelationExistingSystemMutationVariables>;
export const SetTrbRequestRelationExistingServiceDocument = gql`
    mutation SetTrbRequestRelationExistingService($input: SetTRBRequestRelationExistingServiceInput!) {
  setTRBRequestRelationExistingService(input: $input) {
    id
  }
}
    `;
export type SetTrbRequestRelationExistingServiceMutationFn = Apollo.MutationFunction<SetTrbRequestRelationExistingServiceMutation, SetTrbRequestRelationExistingServiceMutationVariables>;

/**
 * __useSetTrbRequestRelationExistingServiceMutation__
 *
 * To run a mutation, you first call `useSetTrbRequestRelationExistingServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTrbRequestRelationExistingServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTrbRequestRelationExistingServiceMutation, { data, loading, error }] = useSetTrbRequestRelationExistingServiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTrbRequestRelationExistingServiceMutation(baseOptions?: Apollo.MutationHookOptions<SetTrbRequestRelationExistingServiceMutation, SetTrbRequestRelationExistingServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetTrbRequestRelationExistingServiceMutation, SetTrbRequestRelationExistingServiceMutationVariables>(SetTrbRequestRelationExistingServiceDocument, options);
      }
export type SetTrbRequestRelationExistingServiceMutationHookResult = ReturnType<typeof useSetTrbRequestRelationExistingServiceMutation>;
export type SetTrbRequestRelationExistingServiceMutationResult = Apollo.MutationResult<SetTrbRequestRelationExistingServiceMutation>;
export type SetTrbRequestRelationExistingServiceMutationOptions = Apollo.BaseMutationOptions<SetTrbRequestRelationExistingServiceMutation, SetTrbRequestRelationExistingServiceMutationVariables>;
export const UnlinkTrbRequestRelationDocument = gql`
    mutation UnlinkTrbRequestRelation($trbRequestID: UUID!) {
  unlinkTRBRequestRelation(trbRequestID: $trbRequestID) {
    id
  }
}
    `;
export type UnlinkTrbRequestRelationMutationFn = Apollo.MutationFunction<UnlinkTrbRequestRelationMutation, UnlinkTrbRequestRelationMutationVariables>;

/**
 * __useUnlinkTrbRequestRelationMutation__
 *
 * To run a mutation, you first call `useUnlinkTrbRequestRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkTrbRequestRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkTrbRequestRelationMutation, { data, loading, error }] = useUnlinkTrbRequestRelationMutation({
 *   variables: {
 *      trbRequestID: // value for 'trbRequestID'
 *   },
 * });
 */
export function useUnlinkTrbRequestRelationMutation(baseOptions?: Apollo.MutationHookOptions<UnlinkTrbRequestRelationMutation, UnlinkTrbRequestRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnlinkTrbRequestRelationMutation, UnlinkTrbRequestRelationMutationVariables>(UnlinkTrbRequestRelationDocument, options);
      }
export type UnlinkTrbRequestRelationMutationHookResult = ReturnType<typeof useUnlinkTrbRequestRelationMutation>;
export type UnlinkTrbRequestRelationMutationResult = Apollo.MutationResult<UnlinkTrbRequestRelationMutation>;
export type UnlinkTrbRequestRelationMutationOptions = Apollo.BaseMutationOptions<UnlinkTrbRequestRelationMutation, UnlinkTrbRequestRelationMutationVariables>;
export const CreateSystemIntakeDocument = gql`
    mutation CreateSystemIntake($input: CreateSystemIntakeInput!) {
  createSystemIntake(input: $input) {
    id
    requestType
    requester {
      name
    }
  }
}
    `;
export type CreateSystemIntakeMutationFn = Apollo.MutationFunction<CreateSystemIntakeMutation, CreateSystemIntakeMutationVariables>;

/**
 * __useCreateSystemIntakeMutation__
 *
 * To run a mutation, you first call `useCreateSystemIntakeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemIntakeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemIntakeMutation, { data, loading, error }] = useCreateSystemIntakeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemIntakeMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemIntakeMutation, CreateSystemIntakeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemIntakeMutation, CreateSystemIntakeMutationVariables>(CreateSystemIntakeDocument, options);
      }
export type CreateSystemIntakeMutationHookResult = ReturnType<typeof useCreateSystemIntakeMutation>;
export type CreateSystemIntakeMutationResult = Apollo.MutationResult<CreateSystemIntakeMutation>;
export type CreateSystemIntakeMutationOptions = Apollo.BaseMutationOptions<CreateSystemIntakeMutation, CreateSystemIntakeMutationVariables>;
export const UpdateSystemIntakeContractDetailsDocument = gql`
    mutation UpdateSystemIntakeContractDetails($input: UpdateSystemIntakeContractDetailsInput!) {
  updateSystemIntakeContractDetails(input: $input) {
    systemIntake {
      id
      currentStage
      fundingSources {
        ...FundingSourceFragment
      }
      costs {
        expectedIncreaseAmount
      }
      annualSpending {
        currentAnnualSpending
        currentAnnualSpendingITPortion
        plannedYearOneSpending
        plannedYearOneSpendingITPortion
      }
      contract {
        contractor
        endDate {
          day
          month
          year
        }
        hasContract
        startDate {
          day
          month
          year
        }
      }
      contractNumbers {
        id
        systemIntakeID
        contractNumber
      }
    }
  }
}
    ${FundingSourceFragmentFragmentDoc}`;
export type UpdateSystemIntakeContractDetailsMutationFn = Apollo.MutationFunction<UpdateSystemIntakeContractDetailsMutation, UpdateSystemIntakeContractDetailsMutationVariables>;

/**
 * __useUpdateSystemIntakeContractDetailsMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeContractDetailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeContractDetailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeContractDetailsMutation, { data, loading, error }] = useUpdateSystemIntakeContractDetailsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeContractDetailsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeContractDetailsMutation, UpdateSystemIntakeContractDetailsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeContractDetailsMutation, UpdateSystemIntakeContractDetailsMutationVariables>(UpdateSystemIntakeContractDetailsDocument, options);
      }
export type UpdateSystemIntakeContractDetailsMutationHookResult = ReturnType<typeof useUpdateSystemIntakeContractDetailsMutation>;
export type UpdateSystemIntakeContractDetailsMutationResult = Apollo.MutationResult<UpdateSystemIntakeContractDetailsMutation>;
export type UpdateSystemIntakeContractDetailsMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeContractDetailsMutation, UpdateSystemIntakeContractDetailsMutationVariables>;
export const UpdateSystemIntakeRequestDetailsDocument = gql`
    mutation UpdateSystemIntakeRequestDetails($input: UpdateSystemIntakeRequestDetailsInput!) {
  updateSystemIntakeRequestDetails(input: $input) {
    systemIntake {
      id
      requestName
      businessNeed
      businessSolution
      needsEaSupport
      hasUiChanges
      usesAiTech
      usingSoftware
      acquisitionMethods
    }
  }
}
    `;
export type UpdateSystemIntakeRequestDetailsMutationFn = Apollo.MutationFunction<UpdateSystemIntakeRequestDetailsMutation, UpdateSystemIntakeRequestDetailsMutationVariables>;

/**
 * __useUpdateSystemIntakeRequestDetailsMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeRequestDetailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeRequestDetailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeRequestDetailsMutation, { data, loading, error }] = useUpdateSystemIntakeRequestDetailsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeRequestDetailsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeRequestDetailsMutation, UpdateSystemIntakeRequestDetailsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeRequestDetailsMutation, UpdateSystemIntakeRequestDetailsMutationVariables>(UpdateSystemIntakeRequestDetailsDocument, options);
      }
export type UpdateSystemIntakeRequestDetailsMutationHookResult = ReturnType<typeof useUpdateSystemIntakeRequestDetailsMutation>;
export type UpdateSystemIntakeRequestDetailsMutationResult = Apollo.MutationResult<UpdateSystemIntakeRequestDetailsMutation>;
export type UpdateSystemIntakeRequestDetailsMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeRequestDetailsMutation, UpdateSystemIntakeRequestDetailsMutationVariables>;
export const UpdateSystemIntakeContactDetailsDocument = gql`
    mutation UpdateSystemIntakeContactDetails($input: UpdateSystemIntakeContactDetailsInput!) {
  updateSystemIntakeContactDetails(input: $input) {
    systemIntake {
      id
      businessOwner {
        component
        name
      }
      governanceTeams {
        isPresent
        teams {
          acronym
          collaborator
          key
          label
          name
        }
      }
      isso {
        isPresent
        name
      }
      productManager {
        component
        name
      }
      requester {
        component
        name
      }
    }
  }
}
    `;
export type UpdateSystemIntakeContactDetailsMutationFn = Apollo.MutationFunction<UpdateSystemIntakeContactDetailsMutation, UpdateSystemIntakeContactDetailsMutationVariables>;

/**
 * __useUpdateSystemIntakeContactDetailsMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeContactDetailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeContactDetailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeContactDetailsMutation, { data, loading, error }] = useUpdateSystemIntakeContactDetailsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeContactDetailsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeContactDetailsMutation, UpdateSystemIntakeContactDetailsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeContactDetailsMutation, UpdateSystemIntakeContactDetailsMutationVariables>(UpdateSystemIntakeContactDetailsDocument, options);
      }
export type UpdateSystemIntakeContactDetailsMutationHookResult = ReturnType<typeof useUpdateSystemIntakeContactDetailsMutation>;
export type UpdateSystemIntakeContactDetailsMutationResult = Apollo.MutationResult<UpdateSystemIntakeContactDetailsMutation>;
export type UpdateSystemIntakeContactDetailsMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeContactDetailsMutation, UpdateSystemIntakeContactDetailsMutationVariables>;
export const UpdateSystemIntakeRequestTypeDocument = gql`
    mutation UpdateSystemIntakeRequestType($id: UUID!, $requestType: SystemIntakeRequestType!) {
  updateSystemIntakeRequestType(id: $id, newType: $requestType) {
    id
  }
}
    `;
export type UpdateSystemIntakeRequestTypeMutationFn = Apollo.MutationFunction<UpdateSystemIntakeRequestTypeMutation, UpdateSystemIntakeRequestTypeMutationVariables>;

/**
 * __useUpdateSystemIntakeRequestTypeMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeRequestTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeRequestTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeRequestTypeMutation, { data, loading, error }] = useUpdateSystemIntakeRequestTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      requestType: // value for 'requestType'
 *   },
 * });
 */
export function useUpdateSystemIntakeRequestTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeRequestTypeMutation, UpdateSystemIntakeRequestTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeRequestTypeMutation, UpdateSystemIntakeRequestTypeMutationVariables>(UpdateSystemIntakeRequestTypeDocument, options);
      }
export type UpdateSystemIntakeRequestTypeMutationHookResult = ReturnType<typeof useUpdateSystemIntakeRequestTypeMutation>;
export type UpdateSystemIntakeRequestTypeMutationResult = Apollo.MutationResult<UpdateSystemIntakeRequestTypeMutation>;
export type UpdateSystemIntakeRequestTypeMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeRequestTypeMutation, UpdateSystemIntakeRequestTypeMutationVariables>;
export const SubmitIntakeDocument = gql`
    mutation SubmitIntake($input: SubmitIntakeInput!) {
  submitIntake(input: $input) {
    systemIntake {
      id
    }
  }
}
    `;
export type SubmitIntakeMutationFn = Apollo.MutationFunction<SubmitIntakeMutation, SubmitIntakeMutationVariables>;

/**
 * __useSubmitIntakeMutation__
 *
 * To run a mutation, you first call `useSubmitIntakeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitIntakeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitIntakeMutation, { data, loading, error }] = useSubmitIntakeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitIntakeMutation(baseOptions?: Apollo.MutationHookOptions<SubmitIntakeMutation, SubmitIntakeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitIntakeMutation, SubmitIntakeMutationVariables>(SubmitIntakeDocument, options);
      }
export type SubmitIntakeMutationHookResult = ReturnType<typeof useSubmitIntakeMutation>;
export type SubmitIntakeMutationResult = Apollo.MutationResult<SubmitIntakeMutation>;
export type SubmitIntakeMutationOptions = Apollo.BaseMutationOptions<SubmitIntakeMutation, SubmitIntakeMutationVariables>;
export const UpdateSystemIntakeAdminLeadDocument = gql`
    mutation UpdateSystemIntakeAdminLead($input: UpdateSystemIntakeAdminLeadInput!) {
  updateSystemIntakeAdminLead(input: $input) {
    systemIntake {
      adminLead
      id
    }
  }
}
    `;
export type UpdateSystemIntakeAdminLeadMutationFn = Apollo.MutationFunction<UpdateSystemIntakeAdminLeadMutation, UpdateSystemIntakeAdminLeadMutationVariables>;

/**
 * __useUpdateSystemIntakeAdminLeadMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeAdminLeadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeAdminLeadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeAdminLeadMutation, { data, loading, error }] = useUpdateSystemIntakeAdminLeadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeAdminLeadMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeAdminLeadMutation, UpdateSystemIntakeAdminLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeAdminLeadMutation, UpdateSystemIntakeAdminLeadMutationVariables>(UpdateSystemIntakeAdminLeadDocument, options);
      }
export type UpdateSystemIntakeAdminLeadMutationHookResult = ReturnType<typeof useUpdateSystemIntakeAdminLeadMutation>;
export type UpdateSystemIntakeAdminLeadMutationResult = Apollo.MutationResult<UpdateSystemIntakeAdminLeadMutation>;
export type UpdateSystemIntakeAdminLeadMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeAdminLeadMutation, UpdateSystemIntakeAdminLeadMutationVariables>;
export const UpdateSystemIntakeNoteDocument = gql`
    mutation UpdateSystemIntakeNote($input: UpdateSystemIntakeNoteInput!) {
  updateSystemIntakeNote(input: $input) {
    id
    content
  }
}
    `;
export type UpdateSystemIntakeNoteMutationFn = Apollo.MutationFunction<UpdateSystemIntakeNoteMutation, UpdateSystemIntakeNoteMutationVariables>;

/**
 * __useUpdateSystemIntakeNoteMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeNoteMutation, { data, loading, error }] = useUpdateSystemIntakeNoteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeNoteMutation, UpdateSystemIntakeNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeNoteMutation, UpdateSystemIntakeNoteMutationVariables>(UpdateSystemIntakeNoteDocument, options);
      }
export type UpdateSystemIntakeNoteMutationHookResult = ReturnType<typeof useUpdateSystemIntakeNoteMutation>;
export type UpdateSystemIntakeNoteMutationResult = Apollo.MutationResult<UpdateSystemIntakeNoteMutation>;
export type UpdateSystemIntakeNoteMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeNoteMutation, UpdateSystemIntakeNoteMutationVariables>;
export const UpdateSystemIntakeReviewDatesDocument = gql`
    mutation UpdateSystemIntakeReviewDates($input: UpdateSystemIntakeReviewDatesInput!) {
  updateSystemIntakeReviewDates(input: $input) {
    systemIntake {
      id
      grbDate
      grtDate
    }
  }
}
    `;
export type UpdateSystemIntakeReviewDatesMutationFn = Apollo.MutationFunction<UpdateSystemIntakeReviewDatesMutation, UpdateSystemIntakeReviewDatesMutationVariables>;

/**
 * __useUpdateSystemIntakeReviewDatesMutation__
 *
 * To run a mutation, you first call `useUpdateSystemIntakeReviewDatesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemIntakeReviewDatesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemIntakeReviewDatesMutation, { data, loading, error }] = useUpdateSystemIntakeReviewDatesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemIntakeReviewDatesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSystemIntakeReviewDatesMutation, UpdateSystemIntakeReviewDatesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSystemIntakeReviewDatesMutation, UpdateSystemIntakeReviewDatesMutationVariables>(UpdateSystemIntakeReviewDatesDocument, options);
      }
export type UpdateSystemIntakeReviewDatesMutationHookResult = ReturnType<typeof useUpdateSystemIntakeReviewDatesMutation>;
export type UpdateSystemIntakeReviewDatesMutationResult = Apollo.MutationResult<UpdateSystemIntakeReviewDatesMutation>;
export type UpdateSystemIntakeReviewDatesMutationOptions = Apollo.BaseMutationOptions<UpdateSystemIntakeReviewDatesMutation, UpdateSystemIntakeReviewDatesMutationVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  currentUser {
    launchDarkly {
      userKey
      signedHash
    }
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export function useGetCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserSuspenseQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetLinkedRequestsDocument = gql`
    query GetLinkedRequests($cedarSystemId: String!, $systemIntakeState: SystemIntakeState!, $trbRequestState: TRBRequestState!) {
  cedarSystemDetails(cedarSystemId: $cedarSystemId) {
    cedarSystem {
      id
      linkedSystemIntakes: linkedSystemIntakes(state: $systemIntakeState) {
        id
        name: requestName
        submittedAt
        status: statusRequester
        lcid
        requesterName
        nextMeetingDate
        lastMeetingDate
      }
      linkedTrbRequests(state: $trbRequestState) {
        id
        name
        form {
          submittedAt
        }
        status
        state
        requesterInfo {
          commonName
        }
        nextMeetingDate
        lastMeetingDate
      }
    }
  }
}
    `;

/**
 * __useGetLinkedRequestsQuery__
 *
 * To run a query within a React component, call `useGetLinkedRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLinkedRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLinkedRequestsQuery({
 *   variables: {
 *      cedarSystemId: // value for 'cedarSystemId'
 *      systemIntakeState: // value for 'systemIntakeState'
 *      trbRequestState: // value for 'trbRequestState'
 *   },
 * });
 */
export function useGetLinkedRequestsQuery(baseOptions: Apollo.QueryHookOptions<GetLinkedRequestsQuery, GetLinkedRequestsQueryVariables> & ({ variables: GetLinkedRequestsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLinkedRequestsQuery, GetLinkedRequestsQueryVariables>(GetLinkedRequestsDocument, options);
      }
export function useGetLinkedRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLinkedRequestsQuery, GetLinkedRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLinkedRequestsQuery, GetLinkedRequestsQueryVariables>(GetLinkedRequestsDocument, options);
        }
export function useGetLinkedRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLinkedRequestsQuery, GetLinkedRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLinkedRequestsQuery, GetLinkedRequestsQueryVariables>(GetLinkedRequestsDocument, options);
        }
export type GetLinkedRequestsQueryHookResult = ReturnType<typeof useGetLinkedRequestsQuery>;
export type GetLinkedRequestsLazyQueryHookResult = ReturnType<typeof useGetLinkedRequestsLazyQuery>;
export type GetLinkedRequestsSuspenseQueryHookResult = ReturnType<typeof useGetLinkedRequestsSuspenseQuery>;
export type GetLinkedRequestsQueryResult = Apollo.QueryResult<GetLinkedRequestsQuery, GetLinkedRequestsQueryVariables>;
export const GetRequestsDocument = gql`
    query GetRequests {
  mySystemIntakes {
    id
    requestName
    submittedAt
    statusRequester
    statusAdmin
    grbDate
    grtDate
    systems {
      id
      name
    }
    lcid
    nextMeetingDate
    lastMeetingDate
  }
  myTrbRequests(archived: false) {
    id
    name
    submittedAt: createdAt
    status
    nextMeetingDate: consultMeetingTime
    lastMeetingDate
    systems {
      id
      name
    }
  }
}
    `;

/**
 * __useGetRequestsQuery__
 *
 * To run a query within a React component, call `useGetRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRequestsQuery(baseOptions?: Apollo.QueryHookOptions<GetRequestsQuery, GetRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRequestsQuery, GetRequestsQueryVariables>(GetRequestsDocument, options);
      }
export function useGetRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRequestsQuery, GetRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRequestsQuery, GetRequestsQueryVariables>(GetRequestsDocument, options);
        }
export function useGetRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRequestsQuery, GetRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRequestsQuery, GetRequestsQueryVariables>(GetRequestsDocument, options);
        }
export type GetRequestsQueryHookResult = ReturnType<typeof useGetRequestsQuery>;
export type GetRequestsLazyQueryHookResult = ReturnType<typeof useGetRequestsLazyQuery>;
export type GetRequestsSuspenseQueryHookResult = ReturnType<typeof useGetRequestsSuspenseQuery>;
export type GetRequestsQueryResult = Apollo.QueryResult<GetRequestsQuery, GetRequestsQueryVariables>;
export const GetCedarRoleTypesDocument = gql`
    query GetCedarRoleTypes {
  roleTypes {
    ...CedarRoleTypeFragment
  }
}
    ${CedarRoleTypeFragmentFragmentDoc}`;

/**
 * __useGetCedarRoleTypesQuery__
 *
 * To run a query within a React component, call `useGetCedarRoleTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCedarRoleTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCedarRoleTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCedarRoleTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetCedarRoleTypesQuery, GetCedarRoleTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCedarRoleTypesQuery, GetCedarRoleTypesQueryVariables>(GetCedarRoleTypesDocument, options);
      }
export function useGetCedarRoleTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCedarRoleTypesQuery, GetCedarRoleTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCedarRoleTypesQuery, GetCedarRoleTypesQueryVariables>(GetCedarRoleTypesDocument, options);
        }
export function useGetCedarRoleTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCedarRoleTypesQuery, GetCedarRoleTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCedarRoleTypesQuery, GetCedarRoleTypesQueryVariables>(GetCedarRoleTypesDocument, options);
        }
export type GetCedarRoleTypesQueryHookResult = ReturnType<typeof useGetCedarRoleTypesQuery>;
export type GetCedarRoleTypesLazyQueryHookResult = ReturnType<typeof useGetCedarRoleTypesLazyQuery>;
export type GetCedarRoleTypesSuspenseQueryHookResult = ReturnType<typeof useGetCedarRoleTypesSuspenseQuery>;
export type GetCedarRoleTypesQueryResult = Apollo.QueryResult<GetCedarRoleTypesQuery, GetCedarRoleTypesQueryVariables>;
export const SetRolesForUserOnSystemDocument = gql`
    mutation SetRolesForUserOnSystem($input: SetRolesForUserOnSystemInput!) {
  setRolesForUserOnSystem(input: $input)
}
    `;
export type SetRolesForUserOnSystemMutationFn = Apollo.MutationFunction<SetRolesForUserOnSystemMutation, SetRolesForUserOnSystemMutationVariables>;

/**
 * __useSetRolesForUserOnSystemMutation__
 *
 * To run a mutation, you first call `useSetRolesForUserOnSystemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetRolesForUserOnSystemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setRolesForUserOnSystemMutation, { data, loading, error }] = useSetRolesForUserOnSystemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetRolesForUserOnSystemMutation(baseOptions?: Apollo.MutationHookOptions<SetRolesForUserOnSystemMutation, SetRolesForUserOnSystemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetRolesForUserOnSystemMutation, SetRolesForUserOnSystemMutationVariables>(SetRolesForUserOnSystemDocument, options);
      }
export type SetRolesForUserOnSystemMutationHookResult = ReturnType<typeof useSetRolesForUserOnSystemMutation>;
export type SetRolesForUserOnSystemMutationResult = Apollo.MutationResult<SetRolesForUserOnSystemMutation>;
export type SetRolesForUserOnSystemMutationOptions = Apollo.BaseMutationOptions<SetRolesForUserOnSystemMutation, SetRolesForUserOnSystemMutationVariables>;
export const CreateCedarSystemBookmarkDocument = gql`
    mutation CreateCedarSystemBookmark($input: CreateCedarSystemBookmarkInput!) {
  createCedarSystemBookmark(input: $input) {
    cedarSystemBookmark {
      cedarSystemId
    }
  }
}
    `;
export type CreateCedarSystemBookmarkMutationFn = Apollo.MutationFunction<CreateCedarSystemBookmarkMutation, CreateCedarSystemBookmarkMutationVariables>;

/**
 * __useCreateCedarSystemBookmarkMutation__
 *
 * To run a mutation, you first call `useCreateCedarSystemBookmarkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCedarSystemBookmarkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCedarSystemBookmarkMutation, { data, loading, error }] = useCreateCedarSystemBookmarkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCedarSystemBookmarkMutation(baseOptions?: Apollo.MutationHookOptions<CreateCedarSystemBookmarkMutation, CreateCedarSystemBookmarkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCedarSystemBookmarkMutation, CreateCedarSystemBookmarkMutationVariables>(CreateCedarSystemBookmarkDocument, options);
      }
export type CreateCedarSystemBookmarkMutationHookResult = ReturnType<typeof useCreateCedarSystemBookmarkMutation>;
export type CreateCedarSystemBookmarkMutationResult = Apollo.MutationResult<CreateCedarSystemBookmarkMutation>;
export type CreateCedarSystemBookmarkMutationOptions = Apollo.BaseMutationOptions<CreateCedarSystemBookmarkMutation, CreateCedarSystemBookmarkMutationVariables>;
export const DeleteCedarSystemBookmarkDocument = gql`
    mutation DeleteCedarSystemBookmark($input: CreateCedarSystemBookmarkInput!) {
  deleteCedarSystemBookmark(input: $input) {
    cedarSystemId
  }
}
    `;
export type DeleteCedarSystemBookmarkMutationFn = Apollo.MutationFunction<DeleteCedarSystemBookmarkMutation, DeleteCedarSystemBookmarkMutationVariables>;

/**
 * __useDeleteCedarSystemBookmarkMutation__
 *
 * To run a mutation, you first call `useDeleteCedarSystemBookmarkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCedarSystemBookmarkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCedarSystemBookmarkMutation, { data, loading, error }] = useDeleteCedarSystemBookmarkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteCedarSystemBookmarkMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCedarSystemBookmarkMutation, DeleteCedarSystemBookmarkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCedarSystemBookmarkMutation, DeleteCedarSystemBookmarkMutationVariables>(DeleteCedarSystemBookmarkDocument, options);
      }
export type DeleteCedarSystemBookmarkMutationHookResult = ReturnType<typeof useDeleteCedarSystemBookmarkMutation>;
export type DeleteCedarSystemBookmarkMutationResult = Apollo.MutationResult<DeleteCedarSystemBookmarkMutation>;
export type DeleteCedarSystemBookmarkMutationOptions = Apollo.BaseMutationOptions<DeleteCedarSystemBookmarkMutation, DeleteCedarSystemBookmarkMutationVariables>;
export const GetCedarContactsDocument = gql`
    query GetCedarContacts($commonName: String!) {
  cedarPersonsByCommonName(commonName: $commonName) {
    commonName
    email
    euaUserId
  }
}
    `;

/**
 * __useGetCedarContactsQuery__
 *
 * To run a query within a React component, call `useGetCedarContactsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCedarContactsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCedarContactsQuery({
 *   variables: {
 *      commonName: // value for 'commonName'
 *   },
 * });
 */
export function useGetCedarContactsQuery(baseOptions: Apollo.QueryHookOptions<GetCedarContactsQuery, GetCedarContactsQueryVariables> & ({ variables: GetCedarContactsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCedarContactsQuery, GetCedarContactsQueryVariables>(GetCedarContactsDocument, options);
      }
export function useGetCedarContactsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCedarContactsQuery, GetCedarContactsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCedarContactsQuery, GetCedarContactsQueryVariables>(GetCedarContactsDocument, options);
        }
export function useGetCedarContactsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCedarContactsQuery, GetCedarContactsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCedarContactsQuery, GetCedarContactsQueryVariables>(GetCedarContactsDocument, options);
        }
export type GetCedarContactsQueryHookResult = ReturnType<typeof useGetCedarContactsQuery>;
export type GetCedarContactsLazyQueryHookResult = ReturnType<typeof useGetCedarContactsLazyQuery>;
export type GetCedarContactsSuspenseQueryHookResult = ReturnType<typeof useGetCedarContactsSuspenseQuery>;
export type GetCedarContactsQueryResult = Apollo.QueryResult<GetCedarContactsQuery, GetCedarContactsQueryVariables>;
export const GetCedarSubSystemsDocument = gql`
    query GetCedarSubSystems($cedarSystemId: String!) {
  cedarSubSystems(cedarSystemId: $cedarSystemId) {
    id
    name
    acronym
    description
  }
}
    `;

/**
 * __useGetCedarSubSystemsQuery__
 *
 * To run a query within a React component, call `useGetCedarSubSystemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCedarSubSystemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCedarSubSystemsQuery({
 *   variables: {
 *      cedarSystemId: // value for 'cedarSystemId'
 *   },
 * });
 */
export function useGetCedarSubSystemsQuery(baseOptions: Apollo.QueryHookOptions<GetCedarSubSystemsQuery, GetCedarSubSystemsQueryVariables> & ({ variables: GetCedarSubSystemsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCedarSubSystemsQuery, GetCedarSubSystemsQueryVariables>(GetCedarSubSystemsDocument, options);
      }
export function useGetCedarSubSystemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCedarSubSystemsQuery, GetCedarSubSystemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCedarSubSystemsQuery, GetCedarSubSystemsQueryVariables>(GetCedarSubSystemsDocument, options);
        }
export function useGetCedarSubSystemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCedarSubSystemsQuery, GetCedarSubSystemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCedarSubSystemsQuery, GetCedarSubSystemsQueryVariables>(GetCedarSubSystemsDocument, options);
        }
export type GetCedarSubSystemsQueryHookResult = ReturnType<typeof useGetCedarSubSystemsQuery>;
export type GetCedarSubSystemsLazyQueryHookResult = ReturnType<typeof useGetCedarSubSystemsLazyQuery>;
export type GetCedarSubSystemsSuspenseQueryHookResult = ReturnType<typeof useGetCedarSubSystemsSuspenseQuery>;
export type GetCedarSubSystemsQueryResult = Apollo.QueryResult<GetCedarSubSystemsQuery, GetCedarSubSystemsQueryVariables>;
export const GetCedarSystemDocument = gql`
    query GetCedarSystem($id: String!) {
  cedarSystem(cedarSystemId: $id) {
    id
    name
    description
    acronym
    status
    businessOwnerOrg
    businessOwnerOrgComp
    systemMaintainerOrg
    systemMaintainerOrgComp
    isBookmarked
  }
}
    `;

/**
 * __useGetCedarSystemQuery__
 *
 * To run a query within a React component, call `useGetCedarSystemQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCedarSystemQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCedarSystemQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCedarSystemQuery(baseOptions: Apollo.QueryHookOptions<GetCedarSystemQuery, GetCedarSystemQueryVariables> & ({ variables: GetCedarSystemQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCedarSystemQuery, GetCedarSystemQueryVariables>(GetCedarSystemDocument, options);
      }
export function useGetCedarSystemLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCedarSystemQuery, GetCedarSystemQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCedarSystemQuery, GetCedarSystemQueryVariables>(GetCedarSystemDocument, options);
        }
export function useGetCedarSystemSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCedarSystemQuery, GetCedarSystemQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCedarSystemQuery, GetCedarSystemQueryVariables>(GetCedarSystemDocument, options);
        }
export type GetCedarSystemQueryHookResult = ReturnType<typeof useGetCedarSystemQuery>;
export type GetCedarSystemLazyQueryHookResult = ReturnType<typeof useGetCedarSystemLazyQuery>;
export type GetCedarSystemSuspenseQueryHookResult = ReturnType<typeof useGetCedarSystemSuspenseQuery>;
export type GetCedarSystemQueryResult = Apollo.QueryResult<GetCedarSystemQuery, GetCedarSystemQueryVariables>;
export const GetCedarSystemIDsDocument = gql`
    query GetCedarSystemIDs {
  cedarSystems {
    id
    name
  }
}
    `;

/**
 * __useGetCedarSystemIDsQuery__
 *
 * To run a query within a React component, call `useGetCedarSystemIDsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCedarSystemIDsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCedarSystemIDsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCedarSystemIDsQuery(baseOptions?: Apollo.QueryHookOptions<GetCedarSystemIDsQuery, GetCedarSystemIDsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCedarSystemIDsQuery, GetCedarSystemIDsQueryVariables>(GetCedarSystemIDsDocument, options);
      }
export function useGetCedarSystemIDsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCedarSystemIDsQuery, GetCedarSystemIDsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCedarSystemIDsQuery, GetCedarSystemIDsQueryVariables>(GetCedarSystemIDsDocument, options);
        }
export function useGetCedarSystemIDsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCedarSystemIDsQuery, GetCedarSystemIDsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCedarSystemIDsQuery, GetCedarSystemIDsQueryVariables>(GetCedarSystemIDsDocument, options);
        }
export type GetCedarSystemIDsQueryHookResult = ReturnType<typeof useGetCedarSystemIDsQuery>;
export type GetCedarSystemIDsLazyQueryHookResult = ReturnType<typeof useGetCedarSystemIDsLazyQuery>;
export type GetCedarSystemIDsSuspenseQueryHookResult = ReturnType<typeof useGetCedarSystemIDsSuspenseQuery>;
export type GetCedarSystemIDsQueryResult = Apollo.QueryResult<GetCedarSystemIDsQuery, GetCedarSystemIDsQueryVariables>;
export const GetCedarSystemIsBookmarkedDocument = gql`
    query GetCedarSystemIsBookmarked($id: String!) {
  cedarSystem(cedarSystemId: $id) {
    id
    isBookmarked
  }
}
    `;

/**
 * __useGetCedarSystemIsBookmarkedQuery__
 *
 * To run a query within a React component, call `useGetCedarSystemIsBookmarkedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCedarSystemIsBookmarkedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCedarSystemIsBookmarkedQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCedarSystemIsBookmarkedQuery(baseOptions: Apollo.QueryHookOptions<GetCedarSystemIsBookmarkedQuery, GetCedarSystemIsBookmarkedQueryVariables> & ({ variables: GetCedarSystemIsBookmarkedQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCedarSystemIsBookmarkedQuery, GetCedarSystemIsBookmarkedQueryVariables>(GetCedarSystemIsBookmarkedDocument, options);
      }
export function useGetCedarSystemIsBookmarkedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCedarSystemIsBookmarkedQuery, GetCedarSystemIsBookmarkedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCedarSystemIsBookmarkedQuery, GetCedarSystemIsBookmarkedQueryVariables>(GetCedarSystemIsBookmarkedDocument, options);
        }
export function useGetCedarSystemIsBookmarkedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCedarSystemIsBookmarkedQuery, GetCedarSystemIsBookmarkedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCedarSystemIsBookmarkedQuery, GetCedarSystemIsBookmarkedQueryVariables>(GetCedarSystemIsBookmarkedDocument, options);
        }
export type GetCedarSystemIsBookmarkedQueryHookResult = ReturnType<typeof useGetCedarSystemIsBookmarkedQuery>;
export type GetCedarSystemIsBookmarkedLazyQueryHookResult = ReturnType<typeof useGetCedarSystemIsBookmarkedLazyQuery>;
export type GetCedarSystemIsBookmarkedSuspenseQueryHookResult = ReturnType<typeof useGetCedarSystemIsBookmarkedSuspenseQuery>;
export type GetCedarSystemIsBookmarkedQueryResult = Apollo.QueryResult<GetCedarSystemIsBookmarkedQuery, GetCedarSystemIsBookmarkedQueryVariables>;
export const GetCedarSystemsDocument = gql`
    query GetCedarSystems {
  cedarSystems {
    id
    name
    description
    acronym
    status
    businessOwnerOrg
    businessOwnerOrgComp
    systemMaintainerOrg
    systemMaintainerOrgComp
    isBookmarked
    atoExpirationDate
    linkedTrbRequests(state: OPEN) {
      id
    }
    linkedSystemIntakes(state: OPEN) {
      id
    }
  }
}
    `;

/**
 * __useGetCedarSystemsQuery__
 *
 * To run a query within a React component, call `useGetCedarSystemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCedarSystemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCedarSystemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCedarSystemsQuery(baseOptions?: Apollo.QueryHookOptions<GetCedarSystemsQuery, GetCedarSystemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCedarSystemsQuery, GetCedarSystemsQueryVariables>(GetCedarSystemsDocument, options);
      }
export function useGetCedarSystemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCedarSystemsQuery, GetCedarSystemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCedarSystemsQuery, GetCedarSystemsQueryVariables>(GetCedarSystemsDocument, options);
        }
export function useGetCedarSystemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCedarSystemsQuery, GetCedarSystemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCedarSystemsQuery, GetCedarSystemsQueryVariables>(GetCedarSystemsDocument, options);
        }
export type GetCedarSystemsQueryHookResult = ReturnType<typeof useGetCedarSystemsQuery>;
export type GetCedarSystemsLazyQueryHookResult = ReturnType<typeof useGetCedarSystemsLazyQuery>;
export type GetCedarSystemsSuspenseQueryHookResult = ReturnType<typeof useGetCedarSystemsSuspenseQuery>;
export type GetCedarSystemsQueryResult = Apollo.QueryResult<GetCedarSystemsQuery, GetCedarSystemsQueryVariables>;
export const GetMyCedarSystemsDocument = gql`
    query GetMyCedarSystems {
  myCedarSystems {
    id
    name
    description
    acronym
    status
    businessOwnerOrg
    businessOwnerOrgComp
    systemMaintainerOrg
    systemMaintainerOrgComp
    isBookmarked
    atoExpirationDate
    linkedSystemIntakes(state: OPEN) {
      id
    }
    linkedTrbRequests(state: OPEN) {
      id
    }
  }
}
    `;

/**
 * __useGetMyCedarSystemsQuery__
 *
 * To run a query within a React component, call `useGetMyCedarSystemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyCedarSystemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyCedarSystemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyCedarSystemsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyCedarSystemsQuery, GetMyCedarSystemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyCedarSystemsQuery, GetMyCedarSystemsQueryVariables>(GetMyCedarSystemsDocument, options);
      }
export function useGetMyCedarSystemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyCedarSystemsQuery, GetMyCedarSystemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyCedarSystemsQuery, GetMyCedarSystemsQueryVariables>(GetMyCedarSystemsDocument, options);
        }
export function useGetMyCedarSystemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyCedarSystemsQuery, GetMyCedarSystemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyCedarSystemsQuery, GetMyCedarSystemsQueryVariables>(GetMyCedarSystemsDocument, options);
        }
export type GetMyCedarSystemsQueryHookResult = ReturnType<typeof useGetMyCedarSystemsQuery>;
export type GetMyCedarSystemsLazyQueryHookResult = ReturnType<typeof useGetMyCedarSystemsLazyQuery>;
export type GetMyCedarSystemsSuspenseQueryHookResult = ReturnType<typeof useGetMyCedarSystemsSuspenseQuery>;
export type GetMyCedarSystemsQueryResult = Apollo.QueryResult<GetMyCedarSystemsQuery, GetMyCedarSystemsQueryVariables>;
export const GetSystemIntakesWithLCIDSDocument = gql`
    query GetSystemIntakesWithLCIDS {
  systemIntakesWithLcids {
    id
    lcid
    requestName
    lcidExpiresAt
    lcidScope
    decisionNextSteps
    trbFollowUpRecommendation
    lcidCostBaseline
  }
}
    `;

/**
 * __useGetSystemIntakesWithLCIDSQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakesWithLCIDSQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakesWithLCIDSQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakesWithLCIDSQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSystemIntakesWithLCIDSQuery(baseOptions?: Apollo.QueryHookOptions<GetSystemIntakesWithLCIDSQuery, GetSystemIntakesWithLCIDSQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakesWithLCIDSQuery, GetSystemIntakesWithLCIDSQueryVariables>(GetSystemIntakesWithLCIDSDocument, options);
      }
export function useGetSystemIntakesWithLCIDSLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakesWithLCIDSQuery, GetSystemIntakesWithLCIDSQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakesWithLCIDSQuery, GetSystemIntakesWithLCIDSQueryVariables>(GetSystemIntakesWithLCIDSDocument, options);
        }
export function useGetSystemIntakesWithLCIDSSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakesWithLCIDSQuery, GetSystemIntakesWithLCIDSQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakesWithLCIDSQuery, GetSystemIntakesWithLCIDSQueryVariables>(GetSystemIntakesWithLCIDSDocument, options);
        }
export type GetSystemIntakesWithLCIDSQueryHookResult = ReturnType<typeof useGetSystemIntakesWithLCIDSQuery>;
export type GetSystemIntakesWithLCIDSLazyQueryHookResult = ReturnType<typeof useGetSystemIntakesWithLCIDSLazyQuery>;
export type GetSystemIntakesWithLCIDSSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakesWithLCIDSSuspenseQuery>;
export type GetSystemIntakesWithLCIDSQueryResult = Apollo.QueryResult<GetSystemIntakesWithLCIDSQuery, GetSystemIntakesWithLCIDSQueryVariables>;
export const GetSystemProfileDocument = gql`
    query GetSystemProfile($cedarSystemId: String!) {
  cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
    uuid
    actualDispositionDate
    containsPersonallyIdentifiableInformation
    countOfTotalNonPrivilegedUserPopulation
    countOfOpenPoams
    countOfTotalPrivilegedUserPopulation
    dateAuthorizationMemoExpires
    dateAuthorizationMemoSigned
    eAuthenticationLevel
    fips199OverallImpactRating
    fismaSystemAcronym
    fismaSystemName
    isAccessedByNonOrganizationalUsers
    isPiiLimitedToUserNameAndPass
    isProtectedHealthInformation
    lastActScaDate
    lastAssessmentDate
    lastContingencyPlanCompletionDate
    lastPenTestDate
    piaCompletionDate
    primaryCyberRiskAdvisor
    privacySubjectMatterExpert
    recoveryPointObjective
    recoveryTimeObjective
    systemOfRecordsNotice
    tlcPhase
  }
  exchanges(cedarSystemId: $cedarSystemId) {
    connectionFrequency
    containsHealthDisparityData
    containsPhi
    dataExchangeAgreement
    exchangeDescription
    exchangeDirection
    exchangeId
    exchangeName
    numOfRecords
    sharedViaApi
  }
  cedarBudget(cedarSystemID: $cedarSystemId) {
    fiscalYear
    funding
    fundingId
    fundingSource
    id
    name
    projectId
    projectTitle
    systemId
  }
  cedarBudgetSystemCost(cedarSystemID: $cedarSystemId) {
    budgetActualCost {
      actualSystemCost
      fiscalYear
      systemId
    }
  }
  cedarThreat(cedarSystemId: $cedarSystemId) {
    daysOpen
    weaknessRiskLevel
  }
  cedarSoftwareProducts(cedarSystemId: $cedarSystemId) {
    aiSolnCatg
    aiSolnCatgOther
    apiDataArea
    apiDescPubLocation
    apiDescPublished
    apiFHIRUse
    apiFHIRUseOther
    apiHasPortal
    apisAccessibility
    apisDeveloped
    developmentStage
    softwareProducts {
      apiGatewayUse
      elaPurchase
      elaVendorId
      providesAiCapability
      refstr
      softwareCatagoryConnectionGuid
      softwareVendorConnectionGuid
      softwareCost
      softwareElaOrganization
      softwareName
      systemSoftwareConnectionGuid
      technopediaCategory
      technopediaID
      vendorName
    }
    systemHasAPIGateway
    usesAiTech
  }
  cedarContractsBySystem(cedarSystemId: $cedarSystemId) {
    systemID
    startDate
    endDate
    contractNumber
    contractName
    description
    orderNumber
    serviceProvided
    isDeliveryOrg
  }
  cedarSystemDetails(cedarSystemId: $cedarSystemId) {
    isMySystem
    businessOwnerInformation {
      isCmsOwned
      numberOfContractorFte
      numberOfFederalFte
      numberOfSupportedUsersPerMonth
      storesBeneficiaryAddress
      storesBankingData
    }
    cedarSystem {
      id
      isBookmarked
      name
      description
      acronym
      status
      businessOwnerOrg
      businessOwnerOrgComp
      systemMaintainerOrg
      systemMaintainerOrgComp
      uuid
    }
    deployments {
      id
      startDate
      dataCenter {
        name
      }
      deploymentType
      name
    }
    roles {
      ...CedarRoleFragment
    }
    urls {
      id
      address
      isAPIEndpoint
      isBehindWebApplicationFirewall
      isVersionCodeRepository
      urlHostingEnv
    }
    systemMaintainerInformation {
      agileUsed
      deploymentFrequency
      devCompletionPercent
      devWorkDescription
      ecapParticipation
      frontendAccessType
      hardCodedIPAddress
      ip6EnabledAssetPercent
      ip6TransitionPlan
      ipEnabledAssetCount
      netAccessibility
      plansToRetireReplace
      quarterToRetireReplace
      systemCustomization
      yearToRetireReplace
    }
  }
  cedarSubSystems(cedarSystemId: $cedarSystemId) {
    id
    name
    acronym
    description
  }
}
    ${CedarRoleFragmentFragmentDoc}`;

/**
 * __useGetSystemProfileQuery__
 *
 * To run a query within a React component, call `useGetSystemProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemProfileQuery({
 *   variables: {
 *      cedarSystemId: // value for 'cedarSystemId'
 *   },
 * });
 */
export function useGetSystemProfileQuery(baseOptions: Apollo.QueryHookOptions<GetSystemProfileQuery, GetSystemProfileQueryVariables> & ({ variables: GetSystemProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemProfileQuery, GetSystemProfileQueryVariables>(GetSystemProfileDocument, options);
      }
export function useGetSystemProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemProfileQuery, GetSystemProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemProfileQuery, GetSystemProfileQueryVariables>(GetSystemProfileDocument, options);
        }
export function useGetSystemProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemProfileQuery, GetSystemProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemProfileQuery, GetSystemProfileQueryVariables>(GetSystemProfileDocument, options);
        }
export type GetSystemProfileQueryHookResult = ReturnType<typeof useGetSystemProfileQuery>;
export type GetSystemProfileLazyQueryHookResult = ReturnType<typeof useGetSystemProfileLazyQuery>;
export type GetSystemProfileSuspenseQueryHookResult = ReturnType<typeof useGetSystemProfileSuspenseQuery>;
export type GetSystemProfileQueryResult = Apollo.QueryResult<GetSystemProfileQuery, GetSystemProfileQueryVariables>;
export const GetSystemWorkspaceDocument = gql`
    query GetSystemWorkspace($cedarSystemId: String!) {
  cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
    uuid
    tlcPhase
    dateAuthorizationMemoExpires
    countOfOpenPoams
    lastAssessmentDate
  }
  cedarSystemDetails(cedarSystemId: $cedarSystemId) {
    isMySystem
    cedarSystem {
      id
      name
      isBookmarked
      linkedTrbRequests(state: OPEN) {
        id
      }
      linkedSystemIntakes(state: OPEN) {
        id
      }
    }
    roles {
      ...CedarRoleFragment
    }
  }
}
    ${CedarRoleFragmentFragmentDoc}`;

/**
 * __useGetSystemWorkspaceQuery__
 *
 * To run a query within a React component, call `useGetSystemWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemWorkspaceQuery({
 *   variables: {
 *      cedarSystemId: // value for 'cedarSystemId'
 *   },
 * });
 */
export function useGetSystemWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<GetSystemWorkspaceQuery, GetSystemWorkspaceQueryVariables> & ({ variables: GetSystemWorkspaceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemWorkspaceQuery, GetSystemWorkspaceQueryVariables>(GetSystemWorkspaceDocument, options);
      }
export function useGetSystemWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemWorkspaceQuery, GetSystemWorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemWorkspaceQuery, GetSystemWorkspaceQueryVariables>(GetSystemWorkspaceDocument, options);
        }
export function useGetSystemWorkspaceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemWorkspaceQuery, GetSystemWorkspaceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemWorkspaceQuery, GetSystemWorkspaceQueryVariables>(GetSystemWorkspaceDocument, options);
        }
export type GetSystemWorkspaceQueryHookResult = ReturnType<typeof useGetSystemWorkspaceQuery>;
export type GetSystemWorkspaceLazyQueryHookResult = ReturnType<typeof useGetSystemWorkspaceLazyQuery>;
export type GetSystemWorkspaceSuspenseQueryHookResult = ReturnType<typeof useGetSystemWorkspaceSuspenseQuery>;
export type GetSystemWorkspaceQueryResult = Apollo.QueryResult<GetSystemWorkspaceQuery, GetSystemWorkspaceQueryVariables>;
export const GetTRBAdminHomeDocument = gql`
    query GetTRBAdminHome {
  trbRequests(archived: false) {
    id
    name
    type
    isRecent
    status
    state
    consultMeetingTime
    trbLeadInfo {
      commonName
    }
    requesterComponent
    requesterInfo {
      commonName
    }
    taskStatuses {
      formStatus
      feedbackStatus
      consultPrepStatus
      attendConsultStatus
      guidanceLetterStatus
    }
    form {
      submittedAt
    }
    contractName
    contractNumbers {
      contractNumber
    }
    systems {
      id
      name
    }
  }
}
    `;

/**
 * __useGetTRBAdminHomeQuery__
 *
 * To run a query within a React component, call `useGetTRBAdminHomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBAdminHomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBAdminHomeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTRBAdminHomeQuery(baseOptions?: Apollo.QueryHookOptions<GetTRBAdminHomeQuery, GetTRBAdminHomeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBAdminHomeQuery, GetTRBAdminHomeQueryVariables>(GetTRBAdminHomeDocument, options);
      }
export function useGetTRBAdminHomeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBAdminHomeQuery, GetTRBAdminHomeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBAdminHomeQuery, GetTRBAdminHomeQueryVariables>(GetTRBAdminHomeDocument, options);
        }
export function useGetTRBAdminHomeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBAdminHomeQuery, GetTRBAdminHomeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBAdminHomeQuery, GetTRBAdminHomeQueryVariables>(GetTRBAdminHomeDocument, options);
        }
export type GetTRBAdminHomeQueryHookResult = ReturnType<typeof useGetTRBAdminHomeQuery>;
export type GetTRBAdminHomeLazyQueryHookResult = ReturnType<typeof useGetTRBAdminHomeLazyQuery>;
export type GetTRBAdminHomeSuspenseQueryHookResult = ReturnType<typeof useGetTRBAdminHomeSuspenseQuery>;
export type GetTRBAdminHomeQueryResult = Apollo.QueryResult<GetTRBAdminHomeQuery, GetTRBAdminHomeQueryVariables>;
export const CreateTRBAdminNoteConsultSessionDocument = gql`
    mutation CreateTRBAdminNoteConsultSession($input: CreateTRBAdminNoteConsultSessionInput!) {
  createTRBAdminNoteConsultSession(input: $input) {
    ...TRBAdminNote
  }
}
    ${TRBAdminNoteFragmentDoc}`;
export type CreateTRBAdminNoteConsultSessionMutationFn = Apollo.MutationFunction<CreateTRBAdminNoteConsultSessionMutation, CreateTRBAdminNoteConsultSessionMutationVariables>;

/**
 * __useCreateTRBAdminNoteConsultSessionMutation__
 *
 * To run a mutation, you first call `useCreateTRBAdminNoteConsultSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBAdminNoteConsultSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbAdminNoteConsultSessionMutation, { data, loading, error }] = useCreateTRBAdminNoteConsultSessionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBAdminNoteConsultSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBAdminNoteConsultSessionMutation, CreateTRBAdminNoteConsultSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBAdminNoteConsultSessionMutation, CreateTRBAdminNoteConsultSessionMutationVariables>(CreateTRBAdminNoteConsultSessionDocument, options);
      }
export type CreateTRBAdminNoteConsultSessionMutationHookResult = ReturnType<typeof useCreateTRBAdminNoteConsultSessionMutation>;
export type CreateTRBAdminNoteConsultSessionMutationResult = Apollo.MutationResult<CreateTRBAdminNoteConsultSessionMutation>;
export type CreateTRBAdminNoteConsultSessionMutationOptions = Apollo.BaseMutationOptions<CreateTRBAdminNoteConsultSessionMutation, CreateTRBAdminNoteConsultSessionMutationVariables>;
export const CreateTRBAdminNoteGeneralRequestDocument = gql`
    mutation CreateTRBAdminNoteGeneralRequest($input: CreateTRBAdminNoteGeneralRequestInput!) {
  createTRBAdminNoteGeneralRequest(input: $input) {
    ...TRBAdminNote
  }
}
    ${TRBAdminNoteFragmentDoc}`;
export type CreateTRBAdminNoteGeneralRequestMutationFn = Apollo.MutationFunction<CreateTRBAdminNoteGeneralRequestMutation, CreateTRBAdminNoteGeneralRequestMutationVariables>;

/**
 * __useCreateTRBAdminNoteGeneralRequestMutation__
 *
 * To run a mutation, you first call `useCreateTRBAdminNoteGeneralRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBAdminNoteGeneralRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbAdminNoteGeneralRequestMutation, { data, loading, error }] = useCreateTRBAdminNoteGeneralRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBAdminNoteGeneralRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBAdminNoteGeneralRequestMutation, CreateTRBAdminNoteGeneralRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBAdminNoteGeneralRequestMutation, CreateTRBAdminNoteGeneralRequestMutationVariables>(CreateTRBAdminNoteGeneralRequestDocument, options);
      }
export type CreateTRBAdminNoteGeneralRequestMutationHookResult = ReturnType<typeof useCreateTRBAdminNoteGeneralRequestMutation>;
export type CreateTRBAdminNoteGeneralRequestMutationResult = Apollo.MutationResult<CreateTRBAdminNoteGeneralRequestMutation>;
export type CreateTRBAdminNoteGeneralRequestMutationOptions = Apollo.BaseMutationOptions<CreateTRBAdminNoteGeneralRequestMutation, CreateTRBAdminNoteGeneralRequestMutationVariables>;
export const CreateTRBAdminNoteGuidanceLetterDocument = gql`
    mutation CreateTRBAdminNoteGuidanceLetter($input: CreateTRBAdminNoteGuidanceLetterInput!) {
  createTRBAdminNoteGuidanceLetter(input: $input) {
    ...TRBAdminNote
  }
}
    ${TRBAdminNoteFragmentDoc}`;
export type CreateTRBAdminNoteGuidanceLetterMutationFn = Apollo.MutationFunction<CreateTRBAdminNoteGuidanceLetterMutation, CreateTRBAdminNoteGuidanceLetterMutationVariables>;

/**
 * __useCreateTRBAdminNoteGuidanceLetterMutation__
 *
 * To run a mutation, you first call `useCreateTRBAdminNoteGuidanceLetterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBAdminNoteGuidanceLetterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbAdminNoteGuidanceLetterMutation, { data, loading, error }] = useCreateTRBAdminNoteGuidanceLetterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBAdminNoteGuidanceLetterMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBAdminNoteGuidanceLetterMutation, CreateTRBAdminNoteGuidanceLetterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBAdminNoteGuidanceLetterMutation, CreateTRBAdminNoteGuidanceLetterMutationVariables>(CreateTRBAdminNoteGuidanceLetterDocument, options);
      }
export type CreateTRBAdminNoteGuidanceLetterMutationHookResult = ReturnType<typeof useCreateTRBAdminNoteGuidanceLetterMutation>;
export type CreateTRBAdminNoteGuidanceLetterMutationResult = Apollo.MutationResult<CreateTRBAdminNoteGuidanceLetterMutation>;
export type CreateTRBAdminNoteGuidanceLetterMutationOptions = Apollo.BaseMutationOptions<CreateTRBAdminNoteGuidanceLetterMutation, CreateTRBAdminNoteGuidanceLetterMutationVariables>;
export const CreateTRBAdminNoteInitialRequestFormDocument = gql`
    mutation CreateTRBAdminNoteInitialRequestForm($input: CreateTRBAdminNoteInitialRequestFormInput!) {
  createTRBAdminNoteInitialRequestForm(input: $input) {
    ...TRBAdminNote
  }
}
    ${TRBAdminNoteFragmentDoc}`;
export type CreateTRBAdminNoteInitialRequestFormMutationFn = Apollo.MutationFunction<CreateTRBAdminNoteInitialRequestFormMutation, CreateTRBAdminNoteInitialRequestFormMutationVariables>;

/**
 * __useCreateTRBAdminNoteInitialRequestFormMutation__
 *
 * To run a mutation, you first call `useCreateTRBAdminNoteInitialRequestFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBAdminNoteInitialRequestFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbAdminNoteInitialRequestFormMutation, { data, loading, error }] = useCreateTRBAdminNoteInitialRequestFormMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBAdminNoteInitialRequestFormMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBAdminNoteInitialRequestFormMutation, CreateTRBAdminNoteInitialRequestFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBAdminNoteInitialRequestFormMutation, CreateTRBAdminNoteInitialRequestFormMutationVariables>(CreateTRBAdminNoteInitialRequestFormDocument, options);
      }
export type CreateTRBAdminNoteInitialRequestFormMutationHookResult = ReturnType<typeof useCreateTRBAdminNoteInitialRequestFormMutation>;
export type CreateTRBAdminNoteInitialRequestFormMutationResult = Apollo.MutationResult<CreateTRBAdminNoteInitialRequestFormMutation>;
export type CreateTRBAdminNoteInitialRequestFormMutationOptions = Apollo.BaseMutationOptions<CreateTRBAdminNoteInitialRequestFormMutation, CreateTRBAdminNoteInitialRequestFormMutationVariables>;
export const CreateTRBAdminNoteSupportingDocumentsDocument = gql`
    mutation CreateTRBAdminNoteSupportingDocuments($input: CreateTRBAdminNoteSupportingDocumentsInput!) {
  createTRBAdminNoteSupportingDocuments(input: $input) {
    ...TRBAdminNote
  }
}
    ${TRBAdminNoteFragmentDoc}`;
export type CreateTRBAdminNoteSupportingDocumentsMutationFn = Apollo.MutationFunction<CreateTRBAdminNoteSupportingDocumentsMutation, CreateTRBAdminNoteSupportingDocumentsMutationVariables>;

/**
 * __useCreateTRBAdminNoteSupportingDocumentsMutation__
 *
 * To run a mutation, you first call `useCreateTRBAdminNoteSupportingDocumentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBAdminNoteSupportingDocumentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbAdminNoteSupportingDocumentsMutation, { data, loading, error }] = useCreateTRBAdminNoteSupportingDocumentsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBAdminNoteSupportingDocumentsMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBAdminNoteSupportingDocumentsMutation, CreateTRBAdminNoteSupportingDocumentsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBAdminNoteSupportingDocumentsMutation, CreateTRBAdminNoteSupportingDocumentsMutationVariables>(CreateTRBAdminNoteSupportingDocumentsDocument, options);
      }
export type CreateTRBAdminNoteSupportingDocumentsMutationHookResult = ReturnType<typeof useCreateTRBAdminNoteSupportingDocumentsMutation>;
export type CreateTRBAdminNoteSupportingDocumentsMutationResult = Apollo.MutationResult<CreateTRBAdminNoteSupportingDocumentsMutation>;
export type CreateTRBAdminNoteSupportingDocumentsMutationOptions = Apollo.BaseMutationOptions<CreateTRBAdminNoteSupportingDocumentsMutation, CreateTRBAdminNoteSupportingDocumentsMutationVariables>;
export const GetTRBAdminNotesDocument = gql`
    query GetTRBAdminNotes($id: UUID!) {
  trbRequest(id: $id) {
    id
    adminNotes {
      ...TRBAdminNote
    }
  }
}
    ${TRBAdminNoteFragmentDoc}`;

/**
 * __useGetTRBAdminNotesQuery__
 *
 * To run a query within a React component, call `useGetTRBAdminNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBAdminNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBAdminNotesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBAdminNotesQuery(baseOptions: Apollo.QueryHookOptions<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables> & ({ variables: GetTRBAdminNotesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables>(GetTRBAdminNotesDocument, options);
      }
export function useGetTRBAdminNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables>(GetTRBAdminNotesDocument, options);
        }
export function useGetTRBAdminNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables>(GetTRBAdminNotesDocument, options);
        }
export type GetTRBAdminNotesQueryHookResult = ReturnType<typeof useGetTRBAdminNotesQuery>;
export type GetTRBAdminNotesLazyQueryHookResult = ReturnType<typeof useGetTRBAdminNotesLazyQuery>;
export type GetTRBAdminNotesSuspenseQueryHookResult = ReturnType<typeof useGetTRBAdminNotesSuspenseQuery>;
export type GetTRBAdminNotesQueryResult = Apollo.QueryResult<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables>;
export const CreateTRBRequestAttendeeDocument = gql`
    mutation CreateTRBRequestAttendee($input: CreateTRBRequestAttendeeInput!) {
  createTRBRequestAttendee(input: $input) {
    ...TRBAttendeeFragment
  }
}
    ${TRBAttendeeFragmentFragmentDoc}`;
export type CreateTRBRequestAttendeeMutationFn = Apollo.MutationFunction<CreateTRBRequestAttendeeMutation, CreateTRBRequestAttendeeMutationVariables>;

/**
 * __useCreateTRBRequestAttendeeMutation__
 *
 * To run a mutation, you first call `useCreateTRBRequestAttendeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBRequestAttendeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbRequestAttendeeMutation, { data, loading, error }] = useCreateTRBRequestAttendeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBRequestAttendeeMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBRequestAttendeeMutation, CreateTRBRequestAttendeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBRequestAttendeeMutation, CreateTRBRequestAttendeeMutationVariables>(CreateTRBRequestAttendeeDocument, options);
      }
export type CreateTRBRequestAttendeeMutationHookResult = ReturnType<typeof useCreateTRBRequestAttendeeMutation>;
export type CreateTRBRequestAttendeeMutationResult = Apollo.MutationResult<CreateTRBRequestAttendeeMutation>;
export type CreateTRBRequestAttendeeMutationOptions = Apollo.BaseMutationOptions<CreateTRBRequestAttendeeMutation, CreateTRBRequestAttendeeMutationVariables>;
export const DeleteTRBRequestAttendeeDocument = gql`
    mutation DeleteTRBRequestAttendee($id: UUID!) {
  deleteTRBRequestAttendee(id: $id) {
    ...TRBAttendeeFragment
  }
}
    ${TRBAttendeeFragmentFragmentDoc}`;
export type DeleteTRBRequestAttendeeMutationFn = Apollo.MutationFunction<DeleteTRBRequestAttendeeMutation, DeleteTRBRequestAttendeeMutationVariables>;

/**
 * __useDeleteTRBRequestAttendeeMutation__
 *
 * To run a mutation, you first call `useDeleteTRBRequestAttendeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTRBRequestAttendeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTrbRequestAttendeeMutation, { data, loading, error }] = useDeleteTRBRequestAttendeeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTRBRequestAttendeeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTRBRequestAttendeeMutation, DeleteTRBRequestAttendeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTRBRequestAttendeeMutation, DeleteTRBRequestAttendeeMutationVariables>(DeleteTRBRequestAttendeeDocument, options);
      }
export type DeleteTRBRequestAttendeeMutationHookResult = ReturnType<typeof useDeleteTRBRequestAttendeeMutation>;
export type DeleteTRBRequestAttendeeMutationResult = Apollo.MutationResult<DeleteTRBRequestAttendeeMutation>;
export type DeleteTRBRequestAttendeeMutationOptions = Apollo.BaseMutationOptions<DeleteTRBRequestAttendeeMutation, DeleteTRBRequestAttendeeMutationVariables>;
export const GetTRBRequestAttendeesDocument = gql`
    query GetTRBRequestAttendees($id: UUID!) {
  trbRequest(id: $id) {
    id
    attendees {
      ...TRBAttendeeFragment
    }
  }
}
    ${TRBAttendeeFragmentFragmentDoc}`;

/**
 * __useGetTRBRequestAttendeesQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestAttendeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestAttendeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestAttendeesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestAttendeesQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestAttendeesQuery, GetTRBRequestAttendeesQueryVariables> & ({ variables: GetTRBRequestAttendeesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestAttendeesQuery, GetTRBRequestAttendeesQueryVariables>(GetTRBRequestAttendeesDocument, options);
      }
export function useGetTRBRequestAttendeesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestAttendeesQuery, GetTRBRequestAttendeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestAttendeesQuery, GetTRBRequestAttendeesQueryVariables>(GetTRBRequestAttendeesDocument, options);
        }
export function useGetTRBRequestAttendeesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestAttendeesQuery, GetTRBRequestAttendeesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestAttendeesQuery, GetTRBRequestAttendeesQueryVariables>(GetTRBRequestAttendeesDocument, options);
        }
export type GetTRBRequestAttendeesQueryHookResult = ReturnType<typeof useGetTRBRequestAttendeesQuery>;
export type GetTRBRequestAttendeesLazyQueryHookResult = ReturnType<typeof useGetTRBRequestAttendeesLazyQuery>;
export type GetTRBRequestAttendeesSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestAttendeesSuspenseQuery>;
export type GetTRBRequestAttendeesQueryResult = Apollo.QueryResult<GetTRBRequestAttendeesQuery, GetTRBRequestAttendeesQueryVariables>;
export const UpdateTRBRequestAttendeeDocument = gql`
    mutation UpdateTRBRequestAttendee($input: UpdateTRBRequestAttendeeInput!) {
  updateTRBRequestAttendee(input: $input) {
    ...TRBAttendeeFragment
  }
}
    ${TRBAttendeeFragmentFragmentDoc}`;
export type UpdateTRBRequestAttendeeMutationFn = Apollo.MutationFunction<UpdateTRBRequestAttendeeMutation, UpdateTRBRequestAttendeeMutationVariables>;

/**
 * __useUpdateTRBRequestAttendeeMutation__
 *
 * To run a mutation, you first call `useUpdateTRBRequestAttendeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBRequestAttendeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestAttendeeMutation, { data, loading, error }] = useUpdateTRBRequestAttendeeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTRBRequestAttendeeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBRequestAttendeeMutation, UpdateTRBRequestAttendeeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBRequestAttendeeMutation, UpdateTRBRequestAttendeeMutationVariables>(UpdateTRBRequestAttendeeDocument, options);
      }
export type UpdateTRBRequestAttendeeMutationHookResult = ReturnType<typeof useUpdateTRBRequestAttendeeMutation>;
export type UpdateTRBRequestAttendeeMutationResult = Apollo.MutationResult<UpdateTRBRequestAttendeeMutation>;
export type UpdateTRBRequestAttendeeMutationOptions = Apollo.BaseMutationOptions<UpdateTRBRequestAttendeeMutation, UpdateTRBRequestAttendeeMutationVariables>;
export const CreateTRBGuidanceLetterDocument = gql`
    mutation CreateTRBGuidanceLetter($trbRequestId: UUID!) {
  createTRBGuidanceLetter(trbRequestId: $trbRequestId) {
    ...TRBGuidanceLetter
  }
}
    ${TRBGuidanceLetterFragmentDoc}`;
export type CreateTRBGuidanceLetterMutationFn = Apollo.MutationFunction<CreateTRBGuidanceLetterMutation, CreateTRBGuidanceLetterMutationVariables>;

/**
 * __useCreateTRBGuidanceLetterMutation__
 *
 * To run a mutation, you first call `useCreateTRBGuidanceLetterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBGuidanceLetterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbGuidanceLetterMutation, { data, loading, error }] = useCreateTRBGuidanceLetterMutation({
 *   variables: {
 *      trbRequestId: // value for 'trbRequestId'
 *   },
 * });
 */
export function useCreateTRBGuidanceLetterMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBGuidanceLetterMutation, CreateTRBGuidanceLetterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBGuidanceLetterMutation, CreateTRBGuidanceLetterMutationVariables>(CreateTRBGuidanceLetterDocument, options);
      }
export type CreateTRBGuidanceLetterMutationHookResult = ReturnType<typeof useCreateTRBGuidanceLetterMutation>;
export type CreateTRBGuidanceLetterMutationResult = Apollo.MutationResult<CreateTRBGuidanceLetterMutation>;
export type CreateTRBGuidanceLetterMutationOptions = Apollo.BaseMutationOptions<CreateTRBGuidanceLetterMutation, CreateTRBGuidanceLetterMutationVariables>;
export const CreateTRBGuidanceLetterInsightDocument = gql`
    mutation CreateTRBGuidanceLetterInsight($input: CreateTRBGuidanceLetterInsightInput!) {
  createTRBGuidanceLetterInsight(input: $input) {
    ...TRBGuidanceLetterInsight
  }
}
    ${TRBGuidanceLetterInsightFragmentDoc}`;
export type CreateTRBGuidanceLetterInsightMutationFn = Apollo.MutationFunction<CreateTRBGuidanceLetterInsightMutation, CreateTRBGuidanceLetterInsightMutationVariables>;

/**
 * __useCreateTRBGuidanceLetterInsightMutation__
 *
 * To run a mutation, you first call `useCreateTRBGuidanceLetterInsightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBGuidanceLetterInsightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbGuidanceLetterInsightMutation, { data, loading, error }] = useCreateTRBGuidanceLetterInsightMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBGuidanceLetterInsightMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBGuidanceLetterInsightMutation, CreateTRBGuidanceLetterInsightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBGuidanceLetterInsightMutation, CreateTRBGuidanceLetterInsightMutationVariables>(CreateTRBGuidanceLetterInsightDocument, options);
      }
export type CreateTRBGuidanceLetterInsightMutationHookResult = ReturnType<typeof useCreateTRBGuidanceLetterInsightMutation>;
export type CreateTRBGuidanceLetterInsightMutationResult = Apollo.MutationResult<CreateTRBGuidanceLetterInsightMutation>;
export type CreateTRBGuidanceLetterInsightMutationOptions = Apollo.BaseMutationOptions<CreateTRBGuidanceLetterInsightMutation, CreateTRBGuidanceLetterInsightMutationVariables>;
export const DeleteTRBGuidanceLetterInsightDocument = gql`
    mutation DeleteTRBGuidanceLetterInsight($id: UUID!) {
  deleteTRBGuidanceLetterInsight(id: $id) {
    ...TRBGuidanceLetterInsight
  }
}
    ${TRBGuidanceLetterInsightFragmentDoc}`;
export type DeleteTRBGuidanceLetterInsightMutationFn = Apollo.MutationFunction<DeleteTRBGuidanceLetterInsightMutation, DeleteTRBGuidanceLetterInsightMutationVariables>;

/**
 * __useDeleteTRBGuidanceLetterInsightMutation__
 *
 * To run a mutation, you first call `useDeleteTRBGuidanceLetterInsightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTRBGuidanceLetterInsightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTrbGuidanceLetterInsightMutation, { data, loading, error }] = useDeleteTRBGuidanceLetterInsightMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTRBGuidanceLetterInsightMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTRBGuidanceLetterInsightMutation, DeleteTRBGuidanceLetterInsightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTRBGuidanceLetterInsightMutation, DeleteTRBGuidanceLetterInsightMutationVariables>(DeleteTRBGuidanceLetterInsightDocument, options);
      }
export type DeleteTRBGuidanceLetterInsightMutationHookResult = ReturnType<typeof useDeleteTRBGuidanceLetterInsightMutation>;
export type DeleteTRBGuidanceLetterInsightMutationResult = Apollo.MutationResult<DeleteTRBGuidanceLetterInsightMutation>;
export type DeleteTRBGuidanceLetterInsightMutationOptions = Apollo.BaseMutationOptions<DeleteTRBGuidanceLetterInsightMutation, DeleteTRBGuidanceLetterInsightMutationVariables>;
export const GetTRBGuidanceLetterDocument = gql`
    query GetTRBGuidanceLetter($id: UUID!) {
  trbRequest(id: $id) {
    id
    name
    type
    createdAt
    consultMeetingTime
    taskStatuses {
      guidanceLetterStatus
    }
    guidanceLetter {
      ...TRBGuidanceLetter
    }
  }
}
    ${TRBGuidanceLetterFragmentDoc}`;

/**
 * __useGetTRBGuidanceLetterQuery__
 *
 * To run a query within a React component, call `useGetTRBGuidanceLetterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBGuidanceLetterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBGuidanceLetterQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBGuidanceLetterQuery(baseOptions: Apollo.QueryHookOptions<GetTRBGuidanceLetterQuery, GetTRBGuidanceLetterQueryVariables> & ({ variables: GetTRBGuidanceLetterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBGuidanceLetterQuery, GetTRBGuidanceLetterQueryVariables>(GetTRBGuidanceLetterDocument, options);
      }
export function useGetTRBGuidanceLetterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBGuidanceLetterQuery, GetTRBGuidanceLetterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBGuidanceLetterQuery, GetTRBGuidanceLetterQueryVariables>(GetTRBGuidanceLetterDocument, options);
        }
export function useGetTRBGuidanceLetterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBGuidanceLetterQuery, GetTRBGuidanceLetterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBGuidanceLetterQuery, GetTRBGuidanceLetterQueryVariables>(GetTRBGuidanceLetterDocument, options);
        }
export type GetTRBGuidanceLetterQueryHookResult = ReturnType<typeof useGetTRBGuidanceLetterQuery>;
export type GetTRBGuidanceLetterLazyQueryHookResult = ReturnType<typeof useGetTRBGuidanceLetterLazyQuery>;
export type GetTRBGuidanceLetterSuspenseQueryHookResult = ReturnType<typeof useGetTRBGuidanceLetterSuspenseQuery>;
export type GetTRBGuidanceLetterQueryResult = Apollo.QueryResult<GetTRBGuidanceLetterQuery, GetTRBGuidanceLetterQueryVariables>;
export const GetTRBGuidanceLetterInsightsDocument = gql`
    query GetTRBGuidanceLetterInsights($id: UUID!) {
  trbRequest(id: $id) {
    guidanceLetter {
      insights {
        ...TRBGuidanceLetterInsight
      }
    }
  }
}
    ${TRBGuidanceLetterInsightFragmentDoc}`;

/**
 * __useGetTRBGuidanceLetterInsightsQuery__
 *
 * To run a query within a React component, call `useGetTRBGuidanceLetterInsightsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBGuidanceLetterInsightsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBGuidanceLetterInsightsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBGuidanceLetterInsightsQuery(baseOptions: Apollo.QueryHookOptions<GetTRBGuidanceLetterInsightsQuery, GetTRBGuidanceLetterInsightsQueryVariables> & ({ variables: GetTRBGuidanceLetterInsightsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBGuidanceLetterInsightsQuery, GetTRBGuidanceLetterInsightsQueryVariables>(GetTRBGuidanceLetterInsightsDocument, options);
      }
export function useGetTRBGuidanceLetterInsightsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBGuidanceLetterInsightsQuery, GetTRBGuidanceLetterInsightsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBGuidanceLetterInsightsQuery, GetTRBGuidanceLetterInsightsQueryVariables>(GetTRBGuidanceLetterInsightsDocument, options);
        }
export function useGetTRBGuidanceLetterInsightsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBGuidanceLetterInsightsQuery, GetTRBGuidanceLetterInsightsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBGuidanceLetterInsightsQuery, GetTRBGuidanceLetterInsightsQueryVariables>(GetTRBGuidanceLetterInsightsDocument, options);
        }
export type GetTRBGuidanceLetterInsightsQueryHookResult = ReturnType<typeof useGetTRBGuidanceLetterInsightsQuery>;
export type GetTRBGuidanceLetterInsightsLazyQueryHookResult = ReturnType<typeof useGetTRBGuidanceLetterInsightsLazyQuery>;
export type GetTRBGuidanceLetterInsightsSuspenseQueryHookResult = ReturnType<typeof useGetTRBGuidanceLetterInsightsSuspenseQuery>;
export type GetTRBGuidanceLetterInsightsQueryResult = Apollo.QueryResult<GetTRBGuidanceLetterInsightsQuery, GetTRBGuidanceLetterInsightsQueryVariables>;
export const GetTRBPublicGuidanceLetterDocument = gql`
    query GetTRBPublicGuidanceLetter($id: UUID!) {
  trbRequest(id: $id) {
    id
    name
    requesterInfo {
      commonName
    }
    requesterComponent
    form {
      id
      submittedAt
      component
      needsAssistanceWith
    }
    type
    consultMeetingTime
    guidanceLetter {
      id
      meetingSummary
      nextSteps
      isFollowupRecommended
      dateSent
      followupPoint
      insights {
        ...TRBGuidanceLetterInsight
      }
      author {
        euaUserId
        commonName
      }
      createdAt
      modifiedAt
    }
    taskStatuses {
      guidanceLetterStatus
    }
  }
}
    ${TRBGuidanceLetterInsightFragmentDoc}`;

/**
 * __useGetTRBPublicGuidanceLetterQuery__
 *
 * To run a query within a React component, call `useGetTRBPublicGuidanceLetterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBPublicGuidanceLetterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBPublicGuidanceLetterQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBPublicGuidanceLetterQuery(baseOptions: Apollo.QueryHookOptions<GetTRBPublicGuidanceLetterQuery, GetTRBPublicGuidanceLetterQueryVariables> & ({ variables: GetTRBPublicGuidanceLetterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBPublicGuidanceLetterQuery, GetTRBPublicGuidanceLetterQueryVariables>(GetTRBPublicGuidanceLetterDocument, options);
      }
export function useGetTRBPublicGuidanceLetterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBPublicGuidanceLetterQuery, GetTRBPublicGuidanceLetterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBPublicGuidanceLetterQuery, GetTRBPublicGuidanceLetterQueryVariables>(GetTRBPublicGuidanceLetterDocument, options);
        }
export function useGetTRBPublicGuidanceLetterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBPublicGuidanceLetterQuery, GetTRBPublicGuidanceLetterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBPublicGuidanceLetterQuery, GetTRBPublicGuidanceLetterQueryVariables>(GetTRBPublicGuidanceLetterDocument, options);
        }
export type GetTRBPublicGuidanceLetterQueryHookResult = ReturnType<typeof useGetTRBPublicGuidanceLetterQuery>;
export type GetTRBPublicGuidanceLetterLazyQueryHookResult = ReturnType<typeof useGetTRBPublicGuidanceLetterLazyQuery>;
export type GetTRBPublicGuidanceLetterSuspenseQueryHookResult = ReturnType<typeof useGetTRBPublicGuidanceLetterSuspenseQuery>;
export type GetTRBPublicGuidanceLetterQueryResult = Apollo.QueryResult<GetTRBPublicGuidanceLetterQuery, GetTRBPublicGuidanceLetterQueryVariables>;
export const RequestReviewForTRBGuidanceLetterDocument = gql`
    mutation RequestReviewForTRBGuidanceLetter($id: UUID!) {
  requestReviewForTRBGuidanceLetter(id: $id) {
    id
  }
}
    `;
export type RequestReviewForTRBGuidanceLetterMutationFn = Apollo.MutationFunction<RequestReviewForTRBGuidanceLetterMutation, RequestReviewForTRBGuidanceLetterMutationVariables>;

/**
 * __useRequestReviewForTRBGuidanceLetterMutation__
 *
 * To run a mutation, you first call `useRequestReviewForTRBGuidanceLetterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestReviewForTRBGuidanceLetterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestReviewForTrbGuidanceLetterMutation, { data, loading, error }] = useRequestReviewForTRBGuidanceLetterMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRequestReviewForTRBGuidanceLetterMutation(baseOptions?: Apollo.MutationHookOptions<RequestReviewForTRBGuidanceLetterMutation, RequestReviewForTRBGuidanceLetterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestReviewForTRBGuidanceLetterMutation, RequestReviewForTRBGuidanceLetterMutationVariables>(RequestReviewForTRBGuidanceLetterDocument, options);
      }
export type RequestReviewForTRBGuidanceLetterMutationHookResult = ReturnType<typeof useRequestReviewForTRBGuidanceLetterMutation>;
export type RequestReviewForTRBGuidanceLetterMutationResult = Apollo.MutationResult<RequestReviewForTRBGuidanceLetterMutation>;
export type RequestReviewForTRBGuidanceLetterMutationOptions = Apollo.BaseMutationOptions<RequestReviewForTRBGuidanceLetterMutation, RequestReviewForTRBGuidanceLetterMutationVariables>;
export const SendTRBGuidanceLetterDocument = gql`
    mutation SendTRBGuidanceLetter($input: SendTRBGuidanceLetterInput!) {
  sendTRBGuidanceLetter(input: $input) {
    id
  }
}
    `;
export type SendTRBGuidanceLetterMutationFn = Apollo.MutationFunction<SendTRBGuidanceLetterMutation, SendTRBGuidanceLetterMutationVariables>;

/**
 * __useSendTRBGuidanceLetterMutation__
 *
 * To run a mutation, you first call `useSendTRBGuidanceLetterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendTRBGuidanceLetterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendTrbGuidanceLetterMutation, { data, loading, error }] = useSendTRBGuidanceLetterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendTRBGuidanceLetterMutation(baseOptions?: Apollo.MutationHookOptions<SendTRBGuidanceLetterMutation, SendTRBGuidanceLetterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendTRBGuidanceLetterMutation, SendTRBGuidanceLetterMutationVariables>(SendTRBGuidanceLetterDocument, options);
      }
export type SendTRBGuidanceLetterMutationHookResult = ReturnType<typeof useSendTRBGuidanceLetterMutation>;
export type SendTRBGuidanceLetterMutationResult = Apollo.MutationResult<SendTRBGuidanceLetterMutation>;
export type SendTRBGuidanceLetterMutationOptions = Apollo.BaseMutationOptions<SendTRBGuidanceLetterMutation, SendTRBGuidanceLetterMutationVariables>;
export const UpdateTRBGuidanceLetterDocument = gql`
    mutation UpdateTRBGuidanceLetter($input: UpdateTRBGuidanceLetterInput!) {
  updateTRBGuidanceLetter(input: $input) {
    ...TRBGuidanceLetter
  }
}
    ${TRBGuidanceLetterFragmentDoc}`;
export type UpdateTRBGuidanceLetterMutationFn = Apollo.MutationFunction<UpdateTRBGuidanceLetterMutation, UpdateTRBGuidanceLetterMutationVariables>;

/**
 * __useUpdateTRBGuidanceLetterMutation__
 *
 * To run a mutation, you first call `useUpdateTRBGuidanceLetterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBGuidanceLetterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbGuidanceLetterMutation, { data, loading, error }] = useUpdateTRBGuidanceLetterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTRBGuidanceLetterMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBGuidanceLetterMutation, UpdateTRBGuidanceLetterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBGuidanceLetterMutation, UpdateTRBGuidanceLetterMutationVariables>(UpdateTRBGuidanceLetterDocument, options);
      }
export type UpdateTRBGuidanceLetterMutationHookResult = ReturnType<typeof useUpdateTRBGuidanceLetterMutation>;
export type UpdateTRBGuidanceLetterMutationResult = Apollo.MutationResult<UpdateTRBGuidanceLetterMutation>;
export type UpdateTRBGuidanceLetterMutationOptions = Apollo.BaseMutationOptions<UpdateTRBGuidanceLetterMutation, UpdateTRBGuidanceLetterMutationVariables>;
export const UpdateTRBGuidanceLetterInsightDocument = gql`
    mutation UpdateTRBGuidanceLetterInsight($input: UpdateTRBGuidanceLetterInsightInput!) {
  updateTRBGuidanceLetterInsight(input: $input) {
    ...TRBGuidanceLetterInsight
  }
}
    ${TRBGuidanceLetterInsightFragmentDoc}`;
export type UpdateTRBGuidanceLetterInsightMutationFn = Apollo.MutationFunction<UpdateTRBGuidanceLetterInsightMutation, UpdateTRBGuidanceLetterInsightMutationVariables>;

/**
 * __useUpdateTRBGuidanceLetterInsightMutation__
 *
 * To run a mutation, you first call `useUpdateTRBGuidanceLetterInsightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBGuidanceLetterInsightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbGuidanceLetterInsightMutation, { data, loading, error }] = useUpdateTRBGuidanceLetterInsightMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTRBGuidanceLetterInsightMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBGuidanceLetterInsightMutation, UpdateTRBGuidanceLetterInsightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBGuidanceLetterInsightMutation, UpdateTRBGuidanceLetterInsightMutationVariables>(UpdateTRBGuidanceLetterInsightDocument, options);
      }
export type UpdateTRBGuidanceLetterInsightMutationHookResult = ReturnType<typeof useUpdateTRBGuidanceLetterInsightMutation>;
export type UpdateTRBGuidanceLetterInsightMutationResult = Apollo.MutationResult<UpdateTRBGuidanceLetterInsightMutation>;
export type UpdateTRBGuidanceLetterInsightMutationOptions = Apollo.BaseMutationOptions<UpdateTRBGuidanceLetterInsightMutation, UpdateTRBGuidanceLetterInsightMutationVariables>;
export const UpdateTRBGuidanceLetterInsightOrderDocument = gql`
    mutation UpdateTRBGuidanceLetterInsightOrder($input: UpdateTRBGuidanceLetterInsightOrderInput!) {
  updateTRBGuidanceLetterInsightOrder(input: $input) {
    ...TRBGuidanceLetterInsight
  }
}
    ${TRBGuidanceLetterInsightFragmentDoc}`;
export type UpdateTRBGuidanceLetterInsightOrderMutationFn = Apollo.MutationFunction<UpdateTRBGuidanceLetterInsightOrderMutation, UpdateTRBGuidanceLetterInsightOrderMutationVariables>;

/**
 * __useUpdateTRBGuidanceLetterInsightOrderMutation__
 *
 * To run a mutation, you first call `useUpdateTRBGuidanceLetterInsightOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBGuidanceLetterInsightOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbGuidanceLetterInsightOrderMutation, { data, loading, error }] = useUpdateTRBGuidanceLetterInsightOrderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTRBGuidanceLetterInsightOrderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBGuidanceLetterInsightOrderMutation, UpdateTRBGuidanceLetterInsightOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBGuidanceLetterInsightOrderMutation, UpdateTRBGuidanceLetterInsightOrderMutationVariables>(UpdateTRBGuidanceLetterInsightOrderDocument, options);
      }
export type UpdateTRBGuidanceLetterInsightOrderMutationHookResult = ReturnType<typeof useUpdateTRBGuidanceLetterInsightOrderMutation>;
export type UpdateTRBGuidanceLetterInsightOrderMutationResult = Apollo.MutationResult<UpdateTRBGuidanceLetterInsightOrderMutation>;
export type UpdateTRBGuidanceLetterInsightOrderMutationOptions = Apollo.BaseMutationOptions<UpdateTRBGuidanceLetterInsightOrderMutation, UpdateTRBGuidanceLetterInsightOrderMutationVariables>;
export const CloseTRBRequestDocument = gql`
    mutation CloseTRBRequest($input: CloseTRBRequestInput!) {
  closeTRBRequest(input: $input) {
    id
  }
}
    `;
export type CloseTRBRequestMutationFn = Apollo.MutationFunction<CloseTRBRequestMutation, CloseTRBRequestMutationVariables>;

/**
 * __useCloseTRBRequestMutation__
 *
 * To run a mutation, you first call `useCloseTRBRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCloseTRBRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closeTrbRequestMutation, { data, loading, error }] = useCloseTRBRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCloseTRBRequestMutation(baseOptions?: Apollo.MutationHookOptions<CloseTRBRequestMutation, CloseTRBRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CloseTRBRequestMutation, CloseTRBRequestMutationVariables>(CloseTRBRequestDocument, options);
      }
export type CloseTRBRequestMutationHookResult = ReturnType<typeof useCloseTRBRequestMutation>;
export type CloseTRBRequestMutationResult = Apollo.MutationResult<CloseTRBRequestMutation>;
export type CloseTRBRequestMutationOptions = Apollo.BaseMutationOptions<CloseTRBRequestMutation, CloseTRBRequestMutationVariables>;
export const CreateTRBRequestDocument = gql`
    mutation CreateTRBRequest($requestType: TRBRequestType!) {
  createTRBRequest(requestType: $requestType) {
    ...TrbRequestFormFieldsFragment
  }
}
    ${TrbRequestFormFieldsFragmentFragmentDoc}`;
export type CreateTRBRequestMutationFn = Apollo.MutationFunction<CreateTRBRequestMutation, CreateTRBRequestMutationVariables>;

/**
 * __useCreateTRBRequestMutation__
 *
 * To run a mutation, you first call `useCreateTRBRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbRequestMutation, { data, loading, error }] = useCreateTRBRequestMutation({
 *   variables: {
 *      requestType: // value for 'requestType'
 *   },
 * });
 */
export function useCreateTRBRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBRequestMutation, CreateTRBRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBRequestMutation, CreateTRBRequestMutationVariables>(CreateTRBRequestDocument, options);
      }
export type CreateTRBRequestMutationHookResult = ReturnType<typeof useCreateTRBRequestMutation>;
export type CreateTRBRequestMutationResult = Apollo.MutationResult<CreateTRBRequestMutation>;
export type CreateTRBRequestMutationOptions = Apollo.BaseMutationOptions<CreateTRBRequestMutation, CreateTRBRequestMutationVariables>;
export const CreateTRBRequestDocumentDocument = gql`
    mutation CreateTRBRequestDocument($input: CreateTRBRequestDocumentInput!) {
  createTRBRequestDocument(input: $input) {
    document {
      id
      documentType {
        commonType
        otherTypeDescription
      }
      fileName
    }
  }
}
    `;
export type CreateTRBRequestDocumentMutationFn = Apollo.MutationFunction<CreateTRBRequestDocumentMutation, CreateTRBRequestDocumentMutationVariables>;

/**
 * __useCreateTRBRequestDocumentMutation__
 *
 * To run a mutation, you first call `useCreateTRBRequestDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBRequestDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbRequestDocumentMutation, { data, loading, error }] = useCreateTRBRequestDocumentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBRequestDocumentMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBRequestDocumentMutation, CreateTRBRequestDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBRequestDocumentMutation, CreateTRBRequestDocumentMutationVariables>(CreateTRBRequestDocumentDocument, options);
      }
export type CreateTRBRequestDocumentMutationHookResult = ReturnType<typeof useCreateTRBRequestDocumentMutation>;
export type CreateTRBRequestDocumentMutationResult = Apollo.MutationResult<CreateTRBRequestDocumentMutation>;
export type CreateTRBRequestDocumentMutationOptions = Apollo.BaseMutationOptions<CreateTRBRequestDocumentMutation, CreateTRBRequestDocumentMutationVariables>;
export const CreateTRBRequestFeedbackDocument = gql`
    mutation CreateTRBRequestFeedback($input: CreateTRBRequestFeedbackInput!) {
  createTRBRequestFeedback(input: $input) {
    id
  }
}
    `;
export type CreateTRBRequestFeedbackMutationFn = Apollo.MutationFunction<CreateTRBRequestFeedbackMutation, CreateTRBRequestFeedbackMutationVariables>;

/**
 * __useCreateTRBRequestFeedbackMutation__
 *
 * To run a mutation, you first call `useCreateTRBRequestFeedbackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTRBRequestFeedbackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrbRequestFeedbackMutation, { data, loading, error }] = useCreateTRBRequestFeedbackMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTRBRequestFeedbackMutation(baseOptions?: Apollo.MutationHookOptions<CreateTRBRequestFeedbackMutation, CreateTRBRequestFeedbackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTRBRequestFeedbackMutation, CreateTRBRequestFeedbackMutationVariables>(CreateTRBRequestFeedbackDocument, options);
      }
export type CreateTRBRequestFeedbackMutationHookResult = ReturnType<typeof useCreateTRBRequestFeedbackMutation>;
export type CreateTRBRequestFeedbackMutationResult = Apollo.MutationResult<CreateTRBRequestFeedbackMutation>;
export type CreateTRBRequestFeedbackMutationOptions = Apollo.BaseMutationOptions<CreateTRBRequestFeedbackMutation, CreateTRBRequestFeedbackMutationVariables>;
export const DeleteTRBRequestDocumentDocument = gql`
    mutation DeleteTRBRequestDocument($id: UUID!) {
  deleteTRBRequestDocument(id: $id) {
    document {
      fileName
    }
  }
}
    `;
export type DeleteTRBRequestDocumentMutationFn = Apollo.MutationFunction<DeleteTRBRequestDocumentMutation, DeleteTRBRequestDocumentMutationVariables>;

/**
 * __useDeleteTRBRequestDocumentMutation__
 *
 * To run a mutation, you first call `useDeleteTRBRequestDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTRBRequestDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTrbRequestDocumentMutation, { data, loading, error }] = useDeleteTRBRequestDocumentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTRBRequestDocumentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTRBRequestDocumentMutation, DeleteTRBRequestDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTRBRequestDocumentMutation, DeleteTRBRequestDocumentMutationVariables>(DeleteTRBRequestDocumentDocument, options);
      }
export type DeleteTRBRequestDocumentMutationHookResult = ReturnType<typeof useDeleteTRBRequestDocumentMutation>;
export type DeleteTRBRequestDocumentMutationResult = Apollo.MutationResult<DeleteTRBRequestDocumentMutation>;
export type DeleteTRBRequestDocumentMutationOptions = Apollo.BaseMutationOptions<DeleteTRBRequestDocumentMutation, DeleteTRBRequestDocumentMutationVariables>;
export const DeleteTRBRequestFundingSourceDocument = gql`
    mutation DeleteTRBRequestFundingSource($input: DeleteTRBRequestFundingSourcesInput!) {
  deleteTRBRequestFundingSources(input: $input) {
    id
  }
}
    `;
export type DeleteTRBRequestFundingSourceMutationFn = Apollo.MutationFunction<DeleteTRBRequestFundingSourceMutation, DeleteTRBRequestFundingSourceMutationVariables>;

/**
 * __useDeleteTRBRequestFundingSourceMutation__
 *
 * To run a mutation, you first call `useDeleteTRBRequestFundingSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTRBRequestFundingSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTrbRequestFundingSourceMutation, { data, loading, error }] = useDeleteTRBRequestFundingSourceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteTRBRequestFundingSourceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTRBRequestFundingSourceMutation, DeleteTRBRequestFundingSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTRBRequestFundingSourceMutation, DeleteTRBRequestFundingSourceMutationVariables>(DeleteTRBRequestFundingSourceDocument, options);
      }
export type DeleteTRBRequestFundingSourceMutationHookResult = ReturnType<typeof useDeleteTRBRequestFundingSourceMutation>;
export type DeleteTRBRequestFundingSourceMutationResult = Apollo.MutationResult<DeleteTRBRequestFundingSourceMutation>;
export type DeleteTRBRequestFundingSourceMutationOptions = Apollo.BaseMutationOptions<DeleteTRBRequestFundingSourceMutation, DeleteTRBRequestFundingSourceMutationVariables>;
export const GetTRBLeadOptionsDocument = gql`
    query GetTRBLeadOptions {
  trbLeadOptions {
    euaUserId
    commonName
  }
}
    `;

/**
 * __useGetTRBLeadOptionsQuery__
 *
 * To run a query within a React component, call `useGetTRBLeadOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBLeadOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBLeadOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTRBLeadOptionsQuery(baseOptions?: Apollo.QueryHookOptions<GetTRBLeadOptionsQuery, GetTRBLeadOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBLeadOptionsQuery, GetTRBLeadOptionsQueryVariables>(GetTRBLeadOptionsDocument, options);
      }
export function useGetTRBLeadOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBLeadOptionsQuery, GetTRBLeadOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBLeadOptionsQuery, GetTRBLeadOptionsQueryVariables>(GetTRBLeadOptionsDocument, options);
        }
export function useGetTRBLeadOptionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBLeadOptionsQuery, GetTRBLeadOptionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBLeadOptionsQuery, GetTRBLeadOptionsQueryVariables>(GetTRBLeadOptionsDocument, options);
        }
export type GetTRBLeadOptionsQueryHookResult = ReturnType<typeof useGetTRBLeadOptionsQuery>;
export type GetTRBLeadOptionsLazyQueryHookResult = ReturnType<typeof useGetTRBLeadOptionsLazyQuery>;
export type GetTRBLeadOptionsSuspenseQueryHookResult = ReturnType<typeof useGetTRBLeadOptionsSuspenseQuery>;
export type GetTRBLeadOptionsQueryResult = Apollo.QueryResult<GetTRBLeadOptionsQuery, GetTRBLeadOptionsQueryVariables>;
export const GetTRBRequestDocument = gql`
    query GetTRBRequest($id: UUID!) {
  trbRequest(id: $id) {
    ...TrbRequestFormFieldsFragment
  }
}
    ${TrbRequestFormFieldsFragmentFragmentDoc}`;

/**
 * __useGetTRBRequestQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestQuery, GetTRBRequestQueryVariables> & ({ variables: GetTRBRequestQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestQuery, GetTRBRequestQueryVariables>(GetTRBRequestDocument, options);
      }
export function useGetTRBRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestQuery, GetTRBRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestQuery, GetTRBRequestQueryVariables>(GetTRBRequestDocument, options);
        }
export function useGetTRBRequestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestQuery, GetTRBRequestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestQuery, GetTRBRequestQueryVariables>(GetTRBRequestDocument, options);
        }
export type GetTRBRequestQueryHookResult = ReturnType<typeof useGetTRBRequestQuery>;
export type GetTRBRequestLazyQueryHookResult = ReturnType<typeof useGetTRBRequestLazyQuery>;
export type GetTRBRequestSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestSuspenseQuery>;
export type GetTRBRequestQueryResult = Apollo.QueryResult<GetTRBRequestQuery, GetTRBRequestQueryVariables>;
export const GetTRBRequestConsultMeetingDocument = gql`
    query GetTRBRequestConsultMeeting($id: UUID!) {
  trbRequest(id: $id) {
    id
    consultMeetingTime
  }
}
    `;

/**
 * __useGetTRBRequestConsultMeetingQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestConsultMeetingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestConsultMeetingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestConsultMeetingQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestConsultMeetingQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestConsultMeetingQuery, GetTRBRequestConsultMeetingQueryVariables> & ({ variables: GetTRBRequestConsultMeetingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestConsultMeetingQuery, GetTRBRequestConsultMeetingQueryVariables>(GetTRBRequestConsultMeetingDocument, options);
      }
export function useGetTRBRequestConsultMeetingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestConsultMeetingQuery, GetTRBRequestConsultMeetingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestConsultMeetingQuery, GetTRBRequestConsultMeetingQueryVariables>(GetTRBRequestConsultMeetingDocument, options);
        }
export function useGetTRBRequestConsultMeetingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestConsultMeetingQuery, GetTRBRequestConsultMeetingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestConsultMeetingQuery, GetTRBRequestConsultMeetingQueryVariables>(GetTRBRequestConsultMeetingDocument, options);
        }
export type GetTRBRequestConsultMeetingQueryHookResult = ReturnType<typeof useGetTRBRequestConsultMeetingQuery>;
export type GetTRBRequestConsultMeetingLazyQueryHookResult = ReturnType<typeof useGetTRBRequestConsultMeetingLazyQuery>;
export type GetTRBRequestConsultMeetingSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestConsultMeetingSuspenseQuery>;
export type GetTRBRequestConsultMeetingQueryResult = Apollo.QueryResult<GetTRBRequestConsultMeetingQuery, GetTRBRequestConsultMeetingQueryVariables>;
export const GetTRBRequestDocumentUrlsDocument = gql`
    query GetTRBRequestDocumentUrls($id: UUID!) {
  trbRequest(id: $id) {
    id
    documents {
      id
      url
      fileName
    }
  }
}
    `;

/**
 * __useGetTRBRequestDocumentUrlsQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestDocumentUrlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestDocumentUrlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestDocumentUrlsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestDocumentUrlsQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestDocumentUrlsQuery, GetTRBRequestDocumentUrlsQueryVariables> & ({ variables: GetTRBRequestDocumentUrlsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestDocumentUrlsQuery, GetTRBRequestDocumentUrlsQueryVariables>(GetTRBRequestDocumentUrlsDocument, options);
      }
export function useGetTRBRequestDocumentUrlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestDocumentUrlsQuery, GetTRBRequestDocumentUrlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestDocumentUrlsQuery, GetTRBRequestDocumentUrlsQueryVariables>(GetTRBRequestDocumentUrlsDocument, options);
        }
export function useGetTRBRequestDocumentUrlsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestDocumentUrlsQuery, GetTRBRequestDocumentUrlsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestDocumentUrlsQuery, GetTRBRequestDocumentUrlsQueryVariables>(GetTRBRequestDocumentUrlsDocument, options);
        }
export type GetTRBRequestDocumentUrlsQueryHookResult = ReturnType<typeof useGetTRBRequestDocumentUrlsQuery>;
export type GetTRBRequestDocumentUrlsLazyQueryHookResult = ReturnType<typeof useGetTRBRequestDocumentUrlsLazyQuery>;
export type GetTRBRequestDocumentUrlsSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestDocumentUrlsSuspenseQuery>;
export type GetTRBRequestDocumentUrlsQueryResult = Apollo.QueryResult<GetTRBRequestDocumentUrlsQuery, GetTRBRequestDocumentUrlsQueryVariables>;
export const GetTRBRequestDocumentsDocument = gql`
    query GetTRBRequestDocuments($id: UUID!) {
  trbRequest(id: $id) {
    id
    documents {
      id
      fileName
      documentType {
        commonType
        otherTypeDescription
      }
      status
      uploadedAt
    }
  }
}
    `;

/**
 * __useGetTRBRequestDocumentsQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestDocumentsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestDocumentsQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestDocumentsQuery, GetTRBRequestDocumentsQueryVariables> & ({ variables: GetTRBRequestDocumentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestDocumentsQuery, GetTRBRequestDocumentsQueryVariables>(GetTRBRequestDocumentsDocument, options);
      }
export function useGetTRBRequestDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestDocumentsQuery, GetTRBRequestDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestDocumentsQuery, GetTRBRequestDocumentsQueryVariables>(GetTRBRequestDocumentsDocument, options);
        }
export function useGetTRBRequestDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestDocumentsQuery, GetTRBRequestDocumentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestDocumentsQuery, GetTRBRequestDocumentsQueryVariables>(GetTRBRequestDocumentsDocument, options);
        }
export type GetTRBRequestDocumentsQueryHookResult = ReturnType<typeof useGetTRBRequestDocumentsQuery>;
export type GetTRBRequestDocumentsLazyQueryHookResult = ReturnType<typeof useGetTRBRequestDocumentsLazyQuery>;
export type GetTRBRequestDocumentsSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestDocumentsSuspenseQuery>;
export type GetTRBRequestDocumentsQueryResult = Apollo.QueryResult<GetTRBRequestDocumentsQuery, GetTRBRequestDocumentsQueryVariables>;
export const GetTRBRequestFeedbackDocument = gql`
    query GetTRBRequestFeedback($id: UUID!) {
  trbRequest(id: $id) {
    id
    feedback {
      id
      action
      feedbackMessage
      author {
        commonName
      }
      createdAt
    }
  }
}
    `;

/**
 * __useGetTRBRequestFeedbackQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestFeedbackQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestFeedbackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestFeedbackQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestFeedbackQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestFeedbackQuery, GetTRBRequestFeedbackQueryVariables> & ({ variables: GetTRBRequestFeedbackQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestFeedbackQuery, GetTRBRequestFeedbackQueryVariables>(GetTRBRequestFeedbackDocument, options);
      }
export function useGetTRBRequestFeedbackLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestFeedbackQuery, GetTRBRequestFeedbackQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestFeedbackQuery, GetTRBRequestFeedbackQueryVariables>(GetTRBRequestFeedbackDocument, options);
        }
export function useGetTRBRequestFeedbackSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestFeedbackQuery, GetTRBRequestFeedbackQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestFeedbackQuery, GetTRBRequestFeedbackQueryVariables>(GetTRBRequestFeedbackDocument, options);
        }
export type GetTRBRequestFeedbackQueryHookResult = ReturnType<typeof useGetTRBRequestFeedbackQuery>;
export type GetTRBRequestFeedbackLazyQueryHookResult = ReturnType<typeof useGetTRBRequestFeedbackLazyQuery>;
export type GetTRBRequestFeedbackSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestFeedbackSuspenseQuery>;
export type GetTRBRequestFeedbackQueryResult = Apollo.QueryResult<GetTRBRequestFeedbackQuery, GetTRBRequestFeedbackQueryVariables>;
export const GetTRBRequestHomeDocument = gql`
    query GetTRBRequestHome($id: UUID!) {
  trbRequest(id: $id) {
    id
    consultMeetingTime
    taskStatuses {
      formStatus
      guidanceLetterStatus
    }
    form {
      id
      modifiedAt
    }
    guidanceLetter {
      id
      modifiedAt
    }
    trbLeadInfo {
      commonName
      email
    }
    documents {
      id
    }
    adminNotes {
      id
    }
  }
}
    `;

/**
 * __useGetTRBRequestHomeQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestHomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestHomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestHomeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestHomeQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestHomeQuery, GetTRBRequestHomeQueryVariables> & ({ variables: GetTRBRequestHomeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestHomeQuery, GetTRBRequestHomeQueryVariables>(GetTRBRequestHomeDocument, options);
      }
export function useGetTRBRequestHomeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestHomeQuery, GetTRBRequestHomeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestHomeQuery, GetTRBRequestHomeQueryVariables>(GetTRBRequestHomeDocument, options);
        }
export function useGetTRBRequestHomeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestHomeQuery, GetTRBRequestHomeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestHomeQuery, GetTRBRequestHomeQueryVariables>(GetTRBRequestHomeDocument, options);
        }
export type GetTRBRequestHomeQueryHookResult = ReturnType<typeof useGetTRBRequestHomeQuery>;
export type GetTRBRequestHomeLazyQueryHookResult = ReturnType<typeof useGetTRBRequestHomeLazyQuery>;
export type GetTRBRequestHomeSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestHomeSuspenseQuery>;
export type GetTRBRequestHomeQueryResult = Apollo.QueryResult<GetTRBRequestHomeQuery, GetTRBRequestHomeQueryVariables>;
export const GetTRBRequestRelatedRequestsDocument = gql`
    query GetTRBRequestRelatedRequests($trbRequestID: UUID!) {
  trbRequest(id: $trbRequestID) {
    id
    relatedIntakes {
      id
      requestName
      contractNumbers {
        contractNumber
      }
      statusAdmin
      statusRequester
      submittedAt
      lcid
    }
    relatedTRBRequests {
      id
      name
      contractNumbers {
        contractNumber
      }
      status
      createdAt
    }
  }
}
    `;

/**
 * __useGetTRBRequestRelatedRequestsQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestRelatedRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestRelatedRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestRelatedRequestsQuery({
 *   variables: {
 *      trbRequestID: // value for 'trbRequestID'
 *   },
 * });
 */
export function useGetTRBRequestRelatedRequestsQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables> & ({ variables: GetTRBRequestRelatedRequestsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables>(GetTRBRequestRelatedRequestsDocument, options);
      }
export function useGetTRBRequestRelatedRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables>(GetTRBRequestRelatedRequestsDocument, options);
        }
export function useGetTRBRequestRelatedRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables>(GetTRBRequestRelatedRequestsDocument, options);
        }
export type GetTRBRequestRelatedRequestsQueryHookResult = ReturnType<typeof useGetTRBRequestRelatedRequestsQuery>;
export type GetTRBRequestRelatedRequestsLazyQueryHookResult = ReturnType<typeof useGetTRBRequestRelatedRequestsLazyQuery>;
export type GetTRBRequestRelatedRequestsSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestRelatedRequestsSuspenseQuery>;
export type GetTRBRequestRelatedRequestsQueryResult = Apollo.QueryResult<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables>;
export const GetTRBRequestRelationDocument = gql`
    query GetTRBRequestRelation($id: UUID!) {
  trbRequest(id: $id) {
    id
    relationType
    contractName
    contractNumbers {
      contractNumber
    }
    systems {
      id
      name
      acronym
    }
  }
  cedarSystems {
    id
    name
    acronym
  }
}
    `;

/**
 * __useGetTRBRequestRelationQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestRelationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestRelationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestRelationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestRelationQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestRelationQuery, GetTRBRequestRelationQueryVariables> & ({ variables: GetTRBRequestRelationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestRelationQuery, GetTRBRequestRelationQueryVariables>(GetTRBRequestRelationDocument, options);
      }
export function useGetTRBRequestRelationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestRelationQuery, GetTRBRequestRelationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestRelationQuery, GetTRBRequestRelationQueryVariables>(GetTRBRequestRelationDocument, options);
        }
export function useGetTRBRequestRelationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestRelationQuery, GetTRBRequestRelationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestRelationQuery, GetTRBRequestRelationQueryVariables>(GetTRBRequestRelationDocument, options);
        }
export type GetTRBRequestRelationQueryHookResult = ReturnType<typeof useGetTRBRequestRelationQuery>;
export type GetTRBRequestRelationLazyQueryHookResult = ReturnType<typeof useGetTRBRequestRelationLazyQuery>;
export type GetTRBRequestRelationSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestRelationSuspenseQuery>;
export type GetTRBRequestRelationQueryResult = Apollo.QueryResult<GetTRBRequestRelationQuery, GetTRBRequestRelationQueryVariables>;
export const GetTRBRequestSummaryDocument = gql`
    query GetTRBRequestSummary($id: UUID!) {
  trbRequest(id: $id) {
    id
    name
    type
    state
    status
    trbLeadInfo {
      commonName
    }
    createdAt
    taskStatuses {
      formStatus
      feedbackStatus
      consultPrepStatus
      attendConsultStatus
      guidanceLetterStatus
    }
    adminNotes {
      id
    }
    relationType
    contractName
    contractNumbers {
      id
      contractNumber
    }
    systems {
      id
      name
      description
      acronym
      businessOwnerOrg
      businessOwnerRoles {
        objectID
        assigneeFirstName
        assigneeLastName
      }
    }
  }
}
    `;

/**
 * __useGetTRBRequestSummaryQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestSummaryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBRequestSummaryQuery(baseOptions: Apollo.QueryHookOptions<GetTRBRequestSummaryQuery, GetTRBRequestSummaryQueryVariables> & ({ variables: GetTRBRequestSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestSummaryQuery, GetTRBRequestSummaryQueryVariables>(GetTRBRequestSummaryDocument, options);
      }
export function useGetTRBRequestSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestSummaryQuery, GetTRBRequestSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestSummaryQuery, GetTRBRequestSummaryQueryVariables>(GetTRBRequestSummaryDocument, options);
        }
export function useGetTRBRequestSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestSummaryQuery, GetTRBRequestSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestSummaryQuery, GetTRBRequestSummaryQueryVariables>(GetTRBRequestSummaryDocument, options);
        }
export type GetTRBRequestSummaryQueryHookResult = ReturnType<typeof useGetTRBRequestSummaryQuery>;
export type GetTRBRequestSummaryLazyQueryHookResult = ReturnType<typeof useGetTRBRequestSummaryLazyQuery>;
export type GetTRBRequestSummarySuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestSummarySuspenseQuery>;
export type GetTRBRequestSummaryQueryResult = Apollo.QueryResult<GetTRBRequestSummaryQuery, GetTRBRequestSummaryQueryVariables>;
export const GetTRBRequestsDocument = gql`
    query GetTRBRequests {
  myTrbRequests(archived: false) {
    id
    name
    status
    state
    createdAt
    form {
      submittedAt
    }
  }
}
    `;

/**
 * __useGetTRBRequestsQuery__
 *
 * To run a query within a React component, call `useGetTRBRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTRBRequestsQuery(baseOptions?: Apollo.QueryHookOptions<GetTRBRequestsQuery, GetTRBRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBRequestsQuery, GetTRBRequestsQueryVariables>(GetTRBRequestsDocument, options);
      }
export function useGetTRBRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBRequestsQuery, GetTRBRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBRequestsQuery, GetTRBRequestsQueryVariables>(GetTRBRequestsDocument, options);
        }
export function useGetTRBRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBRequestsQuery, GetTRBRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBRequestsQuery, GetTRBRequestsQueryVariables>(GetTRBRequestsDocument, options);
        }
export type GetTRBRequestsQueryHookResult = ReturnType<typeof useGetTRBRequestsQuery>;
export type GetTRBRequestsLazyQueryHookResult = ReturnType<typeof useGetTRBRequestsLazyQuery>;
export type GetTRBRequestsSuspenseQueryHookResult = ReturnType<typeof useGetTRBRequestsSuspenseQuery>;
export type GetTRBRequestsQueryResult = Apollo.QueryResult<GetTRBRequestsQuery, GetTRBRequestsQueryVariables>;
export const GetTRBTasklistDocument = gql`
    query GetTRBTasklist($id: UUID!) {
  trbRequest(id: $id) {
    name
    type
    form {
      status
    }
    taskStatuses {
      formStatus
      feedbackStatus
      consultPrepStatus
      attendConsultStatus
      guidanceLetterStatusTaskList
    }
    feedback {
      id
    }
    consultMeetingTime
    relationType
    contractName
    contractNumbers {
      contractNumber
    }
    systems {
      id
      name
      acronym
    }
  }
}
    `;

/**
 * __useGetTRBTasklistQuery__
 *
 * To run a query within a React component, call `useGetTRBTasklistQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTRBTasklistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTRBTasklistQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTRBTasklistQuery(baseOptions: Apollo.QueryHookOptions<GetTRBTasklistQuery, GetTRBTasklistQueryVariables> & ({ variables: GetTRBTasklistQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTRBTasklistQuery, GetTRBTasklistQueryVariables>(GetTRBTasklistDocument, options);
      }
export function useGetTRBTasklistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTRBTasklistQuery, GetTRBTasklistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTRBTasklistQuery, GetTRBTasklistQueryVariables>(GetTRBTasklistDocument, options);
        }
export function useGetTRBTasklistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTRBTasklistQuery, GetTRBTasklistQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTRBTasklistQuery, GetTRBTasklistQueryVariables>(GetTRBTasklistDocument, options);
        }
export type GetTRBTasklistQueryHookResult = ReturnType<typeof useGetTRBTasklistQuery>;
export type GetTRBTasklistLazyQueryHookResult = ReturnType<typeof useGetTRBTasklistLazyQuery>;
export type GetTRBTasklistSuspenseQueryHookResult = ReturnType<typeof useGetTRBTasklistSuspenseQuery>;
export type GetTRBTasklistQueryResult = Apollo.QueryResult<GetTRBTasklistQuery, GetTRBTasklistQueryVariables>;
export const ReopenTRBRequestDocument = gql`
    mutation ReopenTRBRequest($input: ReopenTRBRequestInput!) {
  reopenTrbRequest(input: $input) {
    id
  }
}
    `;
export type ReopenTRBRequestMutationFn = Apollo.MutationFunction<ReopenTRBRequestMutation, ReopenTRBRequestMutationVariables>;

/**
 * __useReopenTRBRequestMutation__
 *
 * To run a mutation, you first call `useReopenTRBRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReopenTRBRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reopenTrbRequestMutation, { data, loading, error }] = useReopenTRBRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReopenTRBRequestMutation(baseOptions?: Apollo.MutationHookOptions<ReopenTRBRequestMutation, ReopenTRBRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReopenTRBRequestMutation, ReopenTRBRequestMutationVariables>(ReopenTRBRequestDocument, options);
      }
export type ReopenTRBRequestMutationHookResult = ReturnType<typeof useReopenTRBRequestMutation>;
export type ReopenTRBRequestMutationResult = Apollo.MutationResult<ReopenTRBRequestMutation>;
export type ReopenTRBRequestMutationOptions = Apollo.BaseMutationOptions<ReopenTRBRequestMutation, ReopenTRBRequestMutationVariables>;
export const UpdateTRBFormDocument = gql`
    mutation UpdateTRBForm($input: UpdateTRBRequestFormInput!) {
  updateTRBRequestForm(input: $input) {
    id
  }
}
    `;
export type UpdateTRBFormMutationFn = Apollo.MutationFunction<UpdateTRBFormMutation, UpdateTRBFormMutationVariables>;

/**
 * __useUpdateTRBFormMutation__
 *
 * To run a mutation, you first call `useUpdateTRBFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbFormMutation, { data, loading, error }] = useUpdateTRBFormMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTRBFormMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBFormMutation, UpdateTRBFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBFormMutation, UpdateTRBFormMutationVariables>(UpdateTRBFormDocument, options);
      }
export type UpdateTRBFormMutationHookResult = ReturnType<typeof useUpdateTRBFormMutation>;
export type UpdateTRBFormMutationResult = Apollo.MutationResult<UpdateTRBFormMutation>;
export type UpdateTRBFormMutationOptions = Apollo.BaseMutationOptions<UpdateTRBFormMutation, UpdateTRBFormMutationVariables>;
export const UpdateTRBRequestAndFormDocument = gql`
    mutation UpdateTRBRequestAndForm($input: UpdateTRBRequestFormInput!, $id: UUID!, $changes: TRBRequestChanges) {
  updateTRBRequestForm(input: $input) {
    id
  }
  updateTRBRequest(id: $id, changes: $changes) {
    ...TrbRequestFormFieldsFragment
  }
}
    ${TrbRequestFormFieldsFragmentFragmentDoc}`;
export type UpdateTRBRequestAndFormMutationFn = Apollo.MutationFunction<UpdateTRBRequestAndFormMutation, UpdateTRBRequestAndFormMutationVariables>;

/**
 * __useUpdateTRBRequestAndFormMutation__
 *
 * To run a mutation, you first call `useUpdateTRBRequestAndFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBRequestAndFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestAndFormMutation, { data, loading, error }] = useUpdateTRBRequestAndFormMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdateTRBRequestAndFormMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBRequestAndFormMutation, UpdateTRBRequestAndFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBRequestAndFormMutation, UpdateTRBRequestAndFormMutationVariables>(UpdateTRBRequestAndFormDocument, options);
      }
export type UpdateTRBRequestAndFormMutationHookResult = ReturnType<typeof useUpdateTRBRequestAndFormMutation>;
export type UpdateTRBRequestAndFormMutationResult = Apollo.MutationResult<UpdateTRBRequestAndFormMutation>;
export type UpdateTRBRequestAndFormMutationOptions = Apollo.BaseMutationOptions<UpdateTRBRequestAndFormMutation, UpdateTRBRequestAndFormMutationVariables>;
export const UpdateTRBRequestArchivedDocument = gql`
    mutation UpdateTRBRequestArchived($id: UUID!, $archived: Boolean!) {
  updateTRBRequest(id: $id, changes: {archived: $archived}) {
    id
    archived
  }
}
    `;
export type UpdateTRBRequestArchivedMutationFn = Apollo.MutationFunction<UpdateTRBRequestArchivedMutation, UpdateTRBRequestArchivedMutationVariables>;

/**
 * __useUpdateTRBRequestArchivedMutation__
 *
 * To run a mutation, you first call `useUpdateTRBRequestArchivedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBRequestArchivedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestArchivedMutation, { data, loading, error }] = useUpdateTRBRequestArchivedMutation({
 *   variables: {
 *      id: // value for 'id'
 *      archived: // value for 'archived'
 *   },
 * });
 */
export function useUpdateTRBRequestArchivedMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBRequestArchivedMutation, UpdateTRBRequestArchivedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBRequestArchivedMutation, UpdateTRBRequestArchivedMutationVariables>(UpdateTRBRequestArchivedDocument, options);
      }
export type UpdateTRBRequestArchivedMutationHookResult = ReturnType<typeof useUpdateTRBRequestArchivedMutation>;
export type UpdateTRBRequestArchivedMutationResult = Apollo.MutationResult<UpdateTRBRequestArchivedMutation>;
export type UpdateTRBRequestArchivedMutationOptions = Apollo.BaseMutationOptions<UpdateTRBRequestArchivedMutation, UpdateTRBRequestArchivedMutationVariables>;
export const UpdateTRBRequestConsultMeetingDocument = gql`
    mutation UpdateTRBRequestConsultMeeting($input: UpdateTRBRequestConsultMeetingTimeInput!) {
  updateTRBRequestConsultMeetingTime(input: $input) {
    id
    consultMeetingTime
  }
}
    `;
export type UpdateTRBRequestConsultMeetingMutationFn = Apollo.MutationFunction<UpdateTRBRequestConsultMeetingMutation, UpdateTRBRequestConsultMeetingMutationVariables>;

/**
 * __useUpdateTRBRequestConsultMeetingMutation__
 *
 * To run a mutation, you first call `useUpdateTRBRequestConsultMeetingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBRequestConsultMeetingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestConsultMeetingMutation, { data, loading, error }] = useUpdateTRBRequestConsultMeetingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTRBRequestConsultMeetingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBRequestConsultMeetingMutation, UpdateTRBRequestConsultMeetingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBRequestConsultMeetingMutation, UpdateTRBRequestConsultMeetingMutationVariables>(UpdateTRBRequestConsultMeetingDocument, options);
      }
export type UpdateTRBRequestConsultMeetingMutationHookResult = ReturnType<typeof useUpdateTRBRequestConsultMeetingMutation>;
export type UpdateTRBRequestConsultMeetingMutationResult = Apollo.MutationResult<UpdateTRBRequestConsultMeetingMutation>;
export type UpdateTRBRequestConsultMeetingMutationOptions = Apollo.BaseMutationOptions<UpdateTRBRequestConsultMeetingMutation, UpdateTRBRequestConsultMeetingMutationVariables>;
export const UpdateTRBRequestFormStatusDocument = gql`
    mutation UpdateTRBRequestFormStatus($isSubmitted: Boolean!, $trbRequestId: UUID!) {
  updateTRBRequestForm(
    input: {isSubmitted: $isSubmitted, trbRequestId: $trbRequestId}
  ) {
    status
  }
}
    `;
export type UpdateTRBRequestFormStatusMutationFn = Apollo.MutationFunction<UpdateTRBRequestFormStatusMutation, UpdateTRBRequestFormStatusMutationVariables>;

/**
 * __useUpdateTRBRequestFormStatusMutation__
 *
 * To run a mutation, you first call `useUpdateTRBRequestFormStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBRequestFormStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestFormStatusMutation, { data, loading, error }] = useUpdateTRBRequestFormStatusMutation({
 *   variables: {
 *      isSubmitted: // value for 'isSubmitted'
 *      trbRequestId: // value for 'trbRequestId'
 *   },
 * });
 */
export function useUpdateTRBRequestFormStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBRequestFormStatusMutation, UpdateTRBRequestFormStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBRequestFormStatusMutation, UpdateTRBRequestFormStatusMutationVariables>(UpdateTRBRequestFormStatusDocument, options);
      }
export type UpdateTRBRequestFormStatusMutationHookResult = ReturnType<typeof useUpdateTRBRequestFormStatusMutation>;
export type UpdateTRBRequestFormStatusMutationResult = Apollo.MutationResult<UpdateTRBRequestFormStatusMutation>;
export type UpdateTRBRequestFormStatusMutationOptions = Apollo.BaseMutationOptions<UpdateTRBRequestFormStatusMutation, UpdateTRBRequestFormStatusMutationVariables>;
export const UpdateTRBRequestFundingSourcesDocument = gql`
    mutation UpdateTRBRequestFundingSources($input: UpdateTRBRequestFundingSourcesInput!) {
  updateTRBRequestFundingSources(input: $input) {
    source
    fundingNumber
    id
    createdAt
  }
}
    `;
export type UpdateTRBRequestFundingSourcesMutationFn = Apollo.MutationFunction<UpdateTRBRequestFundingSourcesMutation, UpdateTRBRequestFundingSourcesMutationVariables>;

/**
 * __useUpdateTRBRequestFundingSourcesMutation__
 *
 * To run a mutation, you first call `useUpdateTRBRequestFundingSourcesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBRequestFundingSourcesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestFundingSourcesMutation, { data, loading, error }] = useUpdateTRBRequestFundingSourcesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTRBRequestFundingSourcesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBRequestFundingSourcesMutation, UpdateTRBRequestFundingSourcesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBRequestFundingSourcesMutation, UpdateTRBRequestFundingSourcesMutationVariables>(UpdateTRBRequestFundingSourcesDocument, options);
      }
export type UpdateTRBRequestFundingSourcesMutationHookResult = ReturnType<typeof useUpdateTRBRequestFundingSourcesMutation>;
export type UpdateTRBRequestFundingSourcesMutationResult = Apollo.MutationResult<UpdateTRBRequestFundingSourcesMutation>;
export type UpdateTRBRequestFundingSourcesMutationOptions = Apollo.BaseMutationOptions<UpdateTRBRequestFundingSourcesMutation, UpdateTRBRequestFundingSourcesMutationVariables>;
export const UpdateTRBRequestLeadDocument = gql`
    mutation UpdateTRBRequestLead($input: UpdateTRBRequestTRBLeadInput!) {
  updateTRBRequestTRBLead(input: $input) {
    id
    trbLead
    trbLeadInfo {
      commonName
      email
      euaUserId
    }
  }
}
    `;
export type UpdateTRBRequestLeadMutationFn = Apollo.MutationFunction<UpdateTRBRequestLeadMutation, UpdateTRBRequestLeadMutationVariables>;

/**
 * __useUpdateTRBRequestLeadMutation__
 *
 * To run a mutation, you first call `useUpdateTRBRequestLeadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBRequestLeadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestLeadMutation, { data, loading, error }] = useUpdateTRBRequestLeadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTRBRequestLeadMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBRequestLeadMutation, UpdateTRBRequestLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBRequestLeadMutation, UpdateTRBRequestLeadMutationVariables>(UpdateTRBRequestLeadDocument, options);
      }
export type UpdateTRBRequestLeadMutationHookResult = ReturnType<typeof useUpdateTRBRequestLeadMutation>;
export type UpdateTRBRequestLeadMutationResult = Apollo.MutationResult<UpdateTRBRequestLeadMutation>;
export type UpdateTRBRequestLeadMutationOptions = Apollo.BaseMutationOptions<UpdateTRBRequestLeadMutation, UpdateTRBRequestLeadMutationVariables>;
export const UpdateTRBRequestTypeDocument = gql`
    mutation UpdateTRBRequestType($id: UUID!, $type: TRBRequestType!) {
  updateTRBRequest(id: $id, changes: {type: $type}) {
    id
    type
  }
}
    `;
export type UpdateTRBRequestTypeMutationFn = Apollo.MutationFunction<UpdateTRBRequestTypeMutation, UpdateTRBRequestTypeMutationVariables>;

/**
 * __useUpdateTRBRequestTypeMutation__
 *
 * To run a mutation, you first call `useUpdateTRBRequestTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTRBRequestTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestTypeMutation, { data, loading, error }] = useUpdateTRBRequestTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useUpdateTRBRequestTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTRBRequestTypeMutation, UpdateTRBRequestTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTRBRequestTypeMutation, UpdateTRBRequestTypeMutationVariables>(UpdateTRBRequestTypeDocument, options);
      }
export type UpdateTRBRequestTypeMutationHookResult = ReturnType<typeof useUpdateTRBRequestTypeMutation>;
export type UpdateTRBRequestTypeMutationResult = Apollo.MutationResult<UpdateTRBRequestTypeMutation>;
export type UpdateTRBRequestTypeMutationOptions = Apollo.BaseMutationOptions<UpdateTRBRequestTypeMutation, UpdateTRBRequestTypeMutationVariables>;
export const TypedCedarRoleFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CedarRoleFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CedarRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"application"}},{"kind":"Field","name":{"kind":"Name","value":"objectID"}},{"kind":"Field","name":{"kind":"Name","value":"roleTypeID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeType"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeUsername"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeEmail"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeOrgID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeOrgName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeLastName"}},{"kind":"Field","name":{"kind":"Name","value":"roleTypeName"}},{"kind":"Field","name":{"kind":"Name","value":"roleID"}}]}}]} as unknown as DocumentNode<CedarRoleFragmentFragment, unknown>;
export const TypedCedarRoleTypeFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CedarRoleTypeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CedarRoleType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<CedarRoleTypeFragmentFragment, unknown>;
export const TypedSystemIntakeContactFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeContactFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AugmentedSystemIntakeContact"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<SystemIntakeContactFragmentFragment, unknown>;
export const TypedGovernanceRequestFeedbackFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceRequestFeedbackFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceRequestFeedback"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"targetForm"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GovernanceRequestFeedbackFragmentFragment, unknown>;
export const TypedFundingSourceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingSourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeFundingSource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<FundingSourceFragmentFragment, unknown>;
export const TypedSystemIntakeDocumentFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}}]}}]} as unknown as DocumentNode<SystemIntakeDocumentFragmentFragment, unknown>;
export const TypedSystemIntakeGRBPresentationLinksFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinksFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordingLink"}},{"kind":"Field","name":{"kind":"Name","value":"recordingPasscode"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileName"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileURL"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptLink"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileName"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileURL"}}]}}]} as unknown as DocumentNode<SystemIntakeGRBPresentationLinksFragmentFragment, unknown>;
export const TypedSystemIntakeFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"adminLead"}},{"kind":"Field","name":{"kind":"Name","value":"businessNeed"}},{"kind":"Field","name":{"kind":"Name","value":"businessSolution"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractor"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasContract"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vehicle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isExpectingIncrease"}},{"kind":"Field","name":{"kind":"Name","value":"expectedIncreaseAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"annualSpending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentAnnualSpending"}},{"kind":"Field","name":{"kind":"Name","value":"currentAnnualSpendingITPortion"}},{"kind":"Field","name":{"kind":"Name","value":"plannedYearOneSpending"}},{"kind":"Field","name":{"kind":"Name","value":"plannedYearOneSpendingITPortion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentStage"}},{"kind":"Field","name":{"kind":"Name","value":"decisionNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grtDate"}},{"kind":"Field","name":{"kind":"Name","value":"governanceRequestFeedbacks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GovernanceRequestFeedbackFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"governanceTeams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPresent"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"collaborator"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isso"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPresent"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"existingFunding"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingSourceFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}},{"kind":"Field","name":{"kind":"Name","value":"lcidIssuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcidExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcidRetiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcidScope"}},{"kind":"Field","name":{"kind":"Name","value":"lcidCostBaseline"}},{"kind":"Field","name":{"kind":"Name","value":"lcidStatus"}},{"kind":"Field","name":{"kind":"Name","value":"needsEaSupport"}},{"kind":"Field","name":{"kind":"Name","value":"productManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"requester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"requestType"}},{"kind":"Field","name":{"kind":"Name","value":"statusAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"statusRequester"}},{"kind":"Field","name":{"kind":"Name","value":"grtReviewEmailBody"}},{"kind":"Field","name":{"kind":"Name","value":"decidedAt"}},{"kind":"Field","name":{"kind":"Name","value":"businessCaseId"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"hasUiChanges"}},{"kind":"Field","name":{"kind":"Name","value":"usesAiTech"}},{"kind":"Field","name":{"kind":"Name","value":"usingSoftware"}},{"kind":"Field","name":{"kind":"Name","value":"acquisitionMethods"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"trbFollowUpRecommendation"}},{"kind":"Field","name":{"kind":"Name","value":"requestFormState"}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeLastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewType"}},{"kind":"Field","name":{"kind":"Name","value":"grbPresentationLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinksFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceRequestFeedbackFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceRequestFeedback"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"targetForm"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingSourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeFundingSource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinksFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordingLink"}},{"kind":"Field","name":{"kind":"Name","value":"recordingPasscode"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileName"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileURL"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptLink"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileName"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileURL"}}]}}]} as unknown as DocumentNode<SystemIntakeFragmentFragment, unknown>;
export const TypedSystemIntakeGRBReviewerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<SystemIntakeGRBReviewerFragment, unknown>;
export const TypedSystemIntakeGRBPresentationLinksFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordingLink"}},{"kind":"Field","name":{"kind":"Name","value":"recordingPasscode"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileName"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileURL"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptLink"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileName"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileURL"}}]}}]} as unknown as DocumentNode<SystemIntakeGRBPresentationLinksFragment, unknown>;
export const TypedSystemIntakeGRBReviewFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewStartedAt"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewType"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewAsyncRecordingTime"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grbPresentationLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordingLink"}},{"kind":"Field","name":{"kind":"Name","value":"recordingPasscode"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileName"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileURL"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptLink"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileName"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileURL"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}}]}}]} as unknown as DocumentNode<SystemIntakeGRBReviewFragment, unknown>;
export const TypedTRBAttendeeFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAttendeeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestAttendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trbRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"userInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<TRBAttendeeFragmentFragment, unknown>;
export const TypedTrbRequestFormFieldsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrbRequestFormFieldsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formStatus"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackStatus"}},{"kind":"Field","name":{"kind":"Name","value":"consultPrepStatus"}},{"kind":"Field","name":{"kind":"Name","value":"attendConsultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"needsAssistanceWith"}},{"kind":"Field","name":{"kind":"Name","value":"hasSolutionInMind"}},{"kind":"Field","name":{"kind":"Name","value":"proposedSolution"}},{"kind":"Field","name":{"kind":"Name","value":"whereInProcess"}},{"kind":"Field","name":{"kind":"Name","value":"whereInProcessOther"}},{"kind":"Field","name":{"kind":"Name","value":"hasExpectedStartEndDates"}},{"kind":"Field","name":{"kind":"Name","value":"expectedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"expectedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"collabGroups"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateSecurity"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateEnterpriseArchitecture"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateCloud"}},{"kind":"Field","name":{"kind":"Name","value":"collabDatePrivacyAdvisor"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateGovernanceReviewBoard"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateOther"}},{"kind":"Field","name":{"kind":"Name","value":"collabGroupOther"}},{"kind":"Field","name":{"kind":"Name","value":"collabGRBConsultRequested"}},{"kind":"Field","name":{"kind":"Name","value":"subjectAreaOptions"}},{"kind":"Field","name":{"kind":"Name","value":"subjectAreaOptionOther"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackMessage"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]} as unknown as DocumentNode<TrbRequestFormFieldsFragmentFragment, unknown>;
export const TypedSystemIntakeWithReviewRequestedFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeWithReviewRequested"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterComponent"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}}]}}]} as unknown as DocumentNode<SystemIntakeWithReviewRequestedFragment, unknown>;
export const TypedSystemIntakeGRBReviewDiscussionPostFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SystemIntakeGRBReviewDiscussionPostFragment, unknown>;
export const TypedSystemIntakeGRBReviewDiscussionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussion"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initialPost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<SystemIntakeGRBReviewDiscussionFragment, unknown>;
export const TypedTRBAdminNoteInitialRequestFormCategoryDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToBasicRequestDetails"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToSubjectAreas"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToAttendees"}}]}}]} as unknown as DocumentNode<TRBAdminNoteInitialRequestFormCategoryDataFragment, unknown>;
export const TypedTRBAdminNoteSupportingDocumentsCategoryDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<TRBAdminNoteSupportingDocumentsCategoryDataFragment, unknown>;
export const TypedTRBAdminNoteGuidanceLetterCategoryDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToMeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<TRBAdminNoteGuidanceLetterCategoryDataFragment, unknown>;
export const TypedTRBAdminNoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"categorySpecificData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToBasicRequestDetails"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToSubjectAreas"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToAttendees"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToMeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<TRBAdminNoteFragment, unknown>;
export const TypedTRBGuidanceLetterInsightFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}}]} as unknown as DocumentNode<TRBGuidanceLetterInsightFragment, unknown>;
export const TypedTRBGuidanceLetterFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"nextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowupRecommended"}},{"kind":"Field","name":{"kind":"Name","value":"dateSent"}},{"kind":"Field","name":{"kind":"Name","value":"followupPoint"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}}]} as unknown as DocumentNode<TRBGuidanceLetterFragment, unknown>;
export const TypedSendFeedbackEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendFeedbackEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendFeedbackEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendFeedbackEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendFeedbackEmailMutation, SendFeedbackEmailMutationVariables>;
export const TypedSendReportAProblemEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendReportAProblemEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendReportAProblemEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendReportAProblemEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendReportAProblemEmailMutation, SendReportAProblemEmailMutationVariables>;
export const TypedCreateSystemIntakeActionChangeLCIDRetirementDateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionChangeLCIDRetirementDate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeChangeLCIDRetirementDateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionChangeLCIDRetirementDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionChangeLCIDRetirementDateMutation, CreateSystemIntakeActionChangeLCIDRetirementDateMutationVariables>;
export const TypedCreateSystemIntakeActionCloseRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionCloseRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeCloseRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionCloseRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionCloseRequestMutation, CreateSystemIntakeActionCloseRequestMutationVariables>;
export const TypedCreateSystemIntakeActionConfirmLCIDDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionConfirmLCID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeConfirmLCIDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionConfirmLCID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionConfirmLCIDMutation, CreateSystemIntakeActionConfirmLCIDMutationVariables>;
export const TypedCreateSystemIntakeActionExpireLCIDDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionExpireLCID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeExpireLCIDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionExpireLCID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionExpireLCIDMutation, CreateSystemIntakeActionExpireLCIDMutationVariables>;
export const TypedCreateSystemIntakeActionIssueLCIDDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionIssueLCID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeIssueLCIDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionIssueLCID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionIssueLCIDMutation, CreateSystemIntakeActionIssueLCIDMutationVariables>;
export const TypedCreateSystemIntakeActionNotITGovRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionNotITGovRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeNotITGovReqInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionNotITGovRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionNotITGovRequestMutation, CreateSystemIntakeActionNotITGovRequestMutationVariables>;
export const TypedCreateSystemIntakeActionProgressToNewStepDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionProgressToNewStep"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeProgressToNewStepsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionProgressToNewStep"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionProgressToNewStepMutation, CreateSystemIntakeActionProgressToNewStepMutationVariables>;
export const TypedCreateSystemIntakeActionRejectIntakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionRejectIntake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeRejectIntakeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionRejectIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionRejectIntakeMutation, CreateSystemIntakeActionRejectIntakeMutationVariables>;
export const TypedCreateSystemIntakeActionReopenRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionReopenRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeReopenRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionReopenRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionReopenRequestMutation, CreateSystemIntakeActionReopenRequestMutationVariables>;
export const TypedCreateSystemIntakeActionRequestEditsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionRequestEdits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeRequestEditsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionRequestEdits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionRequestEditsMutation, CreateSystemIntakeActionRequestEditsMutationVariables>;
export const TypedCreateSystemIntakeActionRetireLcidDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionRetireLcid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeRetireLCIDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionRetireLCID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionRetireLcidMutation, CreateSystemIntakeActionRetireLcidMutationVariables>;
export const TypedCreateSystemIntakeActionUnretireLCIDDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionUnretireLCID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeUnretireLCIDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionUnretireLCID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionUnretireLCIDMutation, CreateSystemIntakeActionUnretireLCIDMutationVariables>;
export const TypedCreateSystemIntakeActionUpdateLCIDDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeActionUpdateLCID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeUpdateLCIDInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeActionUpdateLCID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeActionUpdateLCIDMutation, CreateSystemIntakeActionUpdateLCIDMutationVariables>;
export const TypedGetAdminNotesAndActionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminNotesAndActions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}},{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"editor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"eua"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"lcidExpirationChange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previousDate"}},{"kind":"Field","name":{"kind":"Name","value":"newDate"}},{"kind":"Field","name":{"kind":"Name","value":"previousScope"}},{"kind":"Field","name":{"kind":"Name","value":"newScope"}},{"kind":"Field","name":{"kind":"Name","value":"previousNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"newNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"previousCostBaseline"}},{"kind":"Field","name":{"kind":"Name","value":"newCostBaseline"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAdminNotesAndActionsQuery, GetAdminNotesAndActionsQueryVariables>;
export const TypedGetSystemIntakeContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeContacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakeContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakeContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeContactFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeContactFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AugmentedSystemIntakeContact"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<GetSystemIntakeContactsQuery, GetSystemIntakeContactsQueryVariables>;
export const TypedCreateSystemIntakeContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSystemIntakeContactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakeContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeContactMutation, CreateSystemIntakeContactMutationVariables>;
export const TypedUpdateSystemIntakeContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeContactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakeContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeContactMutation, UpdateSystemIntakeContactMutationVariables>;
export const TypedDeleteSystemIntakeContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSystemIntakeContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSystemIntakeContactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSystemIntakeContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakeContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteSystemIntakeContactMutation, DeleteSystemIntakeContactMutationVariables>;
export const TypedCreateSystemIntakeDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSystemIntakeDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}}]}}]} as unknown as DocumentNode<CreateSystemIntakeDocumentMutation, CreateSystemIntakeDocumentMutationVariables>;
export const TypedDeleteSystemIntakeDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSystemIntakeDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSystemIntakeDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}}]}}]} as unknown as DocumentNode<DeleteSystemIntakeDocumentMutation, DeleteSystemIntakeDocumentMutationVariables>;
export const TypedGetSystemIntakeDocumentUrlsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeDocumentUrls"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeDocumentUrlsQuery, GetSystemIntakeDocumentUrlsQueryVariables>;
export const TypedCreateSystemIntakeGRBDiscussionPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeGRBDiscussionPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createSystemIntakeGRBDiscussionPostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeGRBDiscussionPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<CreateSystemIntakeGRBDiscussionPostMutation, CreateSystemIntakeGRBDiscussionPostMutationVariables>;
export const TypedCreateSystemIntakeGRBDiscussionReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeGRBDiscussionReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createSystemIntakeGRBDiscussionReplyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeGRBDiscussionReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<CreateSystemIntakeGRBDiscussionReplyMutation, CreateSystemIntakeGRBDiscussionReplyMutationVariables>;
export const TypedCreateSystemIntakeGRBReviewersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeGRBReviewers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSystemIntakeGRBReviewersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeGRBReviewers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeGRBReviewersMutation, CreateSystemIntakeGRBReviewersMutationVariables>;
export const TypedDeleteSystemIntakeGRBPresentationLinksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSystemIntakeGRBPresentationLinks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSystemIntakeGRBPresentationLinksInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSystemIntakeGRBPresentationLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteSystemIntakeGRBPresentationLinksMutation, DeleteSystemIntakeGRBPresentationLinksMutationVariables>;
export const TypedDeleteSystemIntakeGRBReviewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSystemIntakeGRBReviewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSystemIntakeGRBReviewerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSystemIntakeGRBReviewer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteSystemIntakeGRBReviewerMutation, DeleteSystemIntakeGRBReviewerMutationVariables>;
export const TypedgetGRBReviewersComparisonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGRBReviewersComparisons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compareGRBReviewersByIntakeID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"reviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isCurrentReviewer"}}]}}]}}]}}]} as unknown as DocumentNode<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables>;
export const TypedGetSystemIntakeGRBDiscussionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeGRBDiscussions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbDiscussions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussion"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussion"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initialPost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewDiscussionPost"}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeGRBDiscussionsQuery, GetSystemIntakeGRBDiscussionsQueryVariables>;
export const TypedGetSystemIntakeGRBReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeGRBReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReview"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordingLink"}},{"kind":"Field","name":{"kind":"Name","value":"recordingPasscode"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileName"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileURL"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptLink"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileName"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileURL"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewStartedAt"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewType"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewAsyncRecordingTime"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grbPresentationLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeGRBReviewQuery, GetSystemIntakeGRBReviewQueryVariables>;
export const TypedGetSystemIntakesWithReviewRequestedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakesWithReviewRequested"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakesWithReviewRequested"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeWithReviewRequested"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeWithReviewRequested"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterComponent"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}}]}}]} as unknown as DocumentNode<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>;
export const TypedSendPresentationDeckReminderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendPresentationDeckReminder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systemIntakeID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendGRBReviewPresentationDeckReminderEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"systemIntakeID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemIntakeID"}}}]}]}}]} as unknown as DocumentNode<SendPresentationDeckReminderMutation, SendPresentationDeckReminderMutationVariables>;
export const TypedSetSystemIntakeGRBPresentationLinksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSystemIntakeGRBPresentationLinks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinksInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSystemIntakeGRBPresentationLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<SetSystemIntakeGRBPresentationLinksMutation, SetSystemIntakeGRBPresentationLinksMutationVariables>;
export const TypedStartGRBReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartGRBReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartGRBReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGRBReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<StartGRBReviewMutation, StartGRBReviewMutationVariables>;
export const TypedUpdateSystemIntakeGRBReviewTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeGRBReviewType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"updateSystemIntakeGRBReviewTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeGRBReviewType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReview"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordingLink"}},{"kind":"Field","name":{"kind":"Name","value":"recordingPasscode"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileName"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileURL"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptLink"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileName"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileURL"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewStartedAt"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewType"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewAsyncRecordingTime"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grbPresentationLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeGRBReviewTypeMutation, UpdateSystemIntakeGRBReviewTypeMutationVariables>;
export const TypedUpdateSystemIntakeGRBReviewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeGRBReviewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeGRBReviewerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeGRBReviewer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeGRBReviewerMutation, UpdateSystemIntakeGRBReviewerMutationVariables>;
export const TypedUploadSystemIntakeGRBPresentationDeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadSystemIntakeGRBPresentationDeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadSystemIntakeGRBPresentationDeckInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadSystemIntakeGRBPresentationDeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<UploadSystemIntakeGRBPresentationDeckMutation, UploadSystemIntakeGRBPresentationDeckMutationVariables>;
export const TypedArchiveSystemIntakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveSystemIntake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveSystemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}}]} as unknown as DocumentNode<ArchiveSystemIntakeMutation, ArchiveSystemIntakeMutationVariables>;
export const TypedCreateSystemIntakeNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSystemIntakeNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"eua"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeNoteMutation, CreateSystemIntakeNoteMutationVariables>;
export const TypedGetGovernanceRequestFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGovernanceRequestFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"intakeID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"intakeID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"governanceRequestFeedbacks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GovernanceRequestFeedbackFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceRequestFeedbackFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceRequestFeedback"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"targetForm"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetGovernanceRequestFeedbackQuery, GetGovernanceRequestFeedbackQueryVariables>;
export const TypedGetGovernanceTaskListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGovernanceTaskList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"itGovTaskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intakeFormStatus"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackFromInitialReviewStatus"}},{"kind":"Field","name":{"kind":"Name","value":"bizCaseDraftStatus"}},{"kind":"Field","name":{"kind":"Name","value":"grtMeetingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"bizCaseFinalStatus"}},{"kind":"Field","name":{"kind":"Name","value":"grbMeetingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"decisionAndNextStepsStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"governanceRequestFeedbacks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"targetForm"}}]}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"grtDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewType"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewStartedAt"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewAsyncEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewAsyncGRBMeetingTime"}},{"kind":"Field","name":{"kind":"Name","value":"step"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"businessCase"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grbPresentationLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileName"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileURL"}}]}}]}}]}}]} as unknown as DocumentNode<GetGovernanceTaskListQuery, GetGovernanceTaskListQueryVariables>;
export const TypedGetSystemIntakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GovernanceRequestFeedbackFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GovernanceRequestFeedback"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"targetForm"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingSourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeFundingSource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"canView"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinksFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinks"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordingLink"}},{"kind":"Field","name":{"kind":"Name","value":"recordingPasscode"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileName"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptFileURL"}},{"kind":"Field","name":{"kind":"Name","value":"transcriptLink"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileName"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileStatus"}},{"kind":"Field","name":{"kind":"Name","value":"presentationDeckFileURL"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"adminLead"}},{"kind":"Field","name":{"kind":"Name","value":"businessNeed"}},{"kind":"Field","name":{"kind":"Name","value":"businessSolution"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractor"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasContract"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vehicle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isExpectingIncrease"}},{"kind":"Field","name":{"kind":"Name","value":"expectedIncreaseAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"annualSpending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentAnnualSpending"}},{"kind":"Field","name":{"kind":"Name","value":"currentAnnualSpendingITPortion"}},{"kind":"Field","name":{"kind":"Name","value":"plannedYearOneSpending"}},{"kind":"Field","name":{"kind":"Name","value":"plannedYearOneSpendingITPortion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentStage"}},{"kind":"Field","name":{"kind":"Name","value":"decisionNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grtDate"}},{"kind":"Field","name":{"kind":"Name","value":"governanceRequestFeedbacks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GovernanceRequestFeedbackFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"governanceTeams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPresent"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"collaborator"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isso"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPresent"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"existingFunding"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingSourceFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}},{"kind":"Field","name":{"kind":"Name","value":"lcidIssuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcidExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcidRetiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcidScope"}},{"kind":"Field","name":{"kind":"Name","value":"lcidCostBaseline"}},{"kind":"Field","name":{"kind":"Name","value":"lcidStatus"}},{"kind":"Field","name":{"kind":"Name","value":"needsEaSupport"}},{"kind":"Field","name":{"kind":"Name","value":"productManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rejectionReason"}},{"kind":"Field","name":{"kind":"Name","value":"requester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"requestType"}},{"kind":"Field","name":{"kind":"Name","value":"statusAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"statusRequester"}},{"kind":"Field","name":{"kind":"Name","value":"grtReviewEmailBody"}},{"kind":"Field","name":{"kind":"Name","value":"decidedAt"}},{"kind":"Field","name":{"kind":"Name","value":"businessCaseId"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"hasUiChanges"}},{"kind":"Field","name":{"kind":"Name","value":"usesAiTech"}},{"kind":"Field","name":{"kind":"Name","value":"usingSoftware"}},{"kind":"Field","name":{"kind":"Name","value":"acquisitionMethods"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeDocumentFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"trbFollowUpRecommendation"}},{"kind":"Field","name":{"kind":"Name","value":"requestFormState"}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeLastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewType"}},{"kind":"Field","name":{"kind":"Name","value":"grbPresentationLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBPresentationLinksFragment"}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeQuery, GetSystemIntakeQueryVariables>;
export const TypedGetSystemIntakeRelatedRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeRelatedRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systemIntakeID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemIntakeID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"statusRequester"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables>;
export const TypedGetSystemIntakeRelationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeRelation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables>;
export const TypedGetSystemIntakesTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakesTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"openRequests"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"openRequests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"openRequests"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"statusAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterComponent"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"component"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"component"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isso"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trbCollaboratorName"}},{"kind":"Field","name":{"kind":"Name","value":"oitSecurityCollaboratorName"}},{"kind":"Field","name":{"kind":"Name","value":"eaCollaboratorName"}},{"kind":"Field","name":{"kind":"Name","value":"existingFunding"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingSourceFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"annualSpending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentAnnualSpending"}},{"kind":"Field","name":{"kind":"Name","value":"currentAnnualSpendingITPortion"}},{"kind":"Field","name":{"kind":"Name","value":"plannedYearOneSpending"}},{"kind":"Field","name":{"kind":"Name","value":"plannedYearOneSpendingITPortion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasContract"}},{"kind":"Field","name":{"kind":"Name","value":"contractor"}},{"kind":"Field","name":{"kind":"Name","value":"vehicle"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"endDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"businessNeed"}},{"kind":"Field","name":{"kind":"Name","value":"businessSolution"}},{"kind":"Field","name":{"kind":"Name","value":"currentStage"}},{"kind":"Field","name":{"kind":"Name","value":"needsEaSupport"}},{"kind":"Field","name":{"kind":"Name","value":"grtDate"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}},{"kind":"Field","name":{"kind":"Name","value":"lcidScope"}},{"kind":"Field","name":{"kind":"Name","value":"lcidExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"adminLead"}},{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasUiChanges"}},{"kind":"Field","name":{"kind":"Name","value":"usesAiTech"}},{"kind":"Field","name":{"kind":"Name","value":"usingSoftware"}},{"kind":"Field","name":{"kind":"Name","value":"acquisitionMethods"}},{"kind":"Field","name":{"kind":"Name","value":"decidedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingSourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeFundingSource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<GetSystemIntakesTableQuery, GetSystemIntakesTableQueryVariables>;
export const TypedGetSystemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"openRequests"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"openRequests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"openRequests"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"component"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemsQuery, GetSystemsQueryVariables>;
export const TypedSetSystemIntakeRelationNewSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSystemIntakeRelationNewSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetSystemIntakeRelationNewSystemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSystemIntakeRelationNewSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SetSystemIntakeRelationNewSystemMutation, SetSystemIntakeRelationNewSystemMutationVariables>;
export const TypedSetSystemIntakeRelationExistingSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSystemIntakeRelationExistingSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetSystemIntakeRelationExistingSystemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSystemIntakeRelationExistingSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SetSystemIntakeRelationExistingSystemMutation, SetSystemIntakeRelationExistingSystemMutationVariables>;
export const TypedSetSystemIntakeRelationExistingServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSystemIntakeRelationExistingService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetSystemIntakeRelationExistingServiceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSystemIntakeRelationExistingService"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SetSystemIntakeRelationExistingServiceMutation, SetSystemIntakeRelationExistingServiceMutationVariables>;
export const TypedUnlinkSystemIntakeRelationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlinkSystemIntakeRelation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"intakeID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlinkSystemIntakeRelation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"intakeID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"intakeID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UnlinkSystemIntakeRelationMutation, UnlinkSystemIntakeRelationMutationVariables>;
export const TypedSetTrbRequestRelationNewSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetTrbRequestRelationNewSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetTRBRequestRelationNewSystemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTRBRequestRelationNewSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetTrbRequestRelationNewSystemMutation, SetTrbRequestRelationNewSystemMutationVariables>;
export const TypedSetTrbRequestRelationExistingSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetTrbRequestRelationExistingSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetTRBRequestRelationExistingSystemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTRBRequestRelationExistingSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetTrbRequestRelationExistingSystemMutation, SetTrbRequestRelationExistingSystemMutationVariables>;
export const TypedSetTrbRequestRelationExistingServiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetTrbRequestRelationExistingService"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetTRBRequestRelationExistingServiceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTRBRequestRelationExistingService"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetTrbRequestRelationExistingServiceMutation, SetTrbRequestRelationExistingServiceMutationVariables>;
export const TypedUnlinkTrbRequestRelationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlinkTrbRequestRelation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlinkTRBRequestRelation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"trbRequestID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UnlinkTrbRequestRelationMutation, UnlinkTrbRequestRelationMutationVariables>;
export const TypedCreateSystemIntakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSystemIntakeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestType"}},{"kind":"Field","name":{"kind":"Name","value":"requester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeMutation, CreateSystemIntakeMutationVariables>;
export const TypedUpdateSystemIntakeContractDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeContractDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeContractDetailsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeContractDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentStage"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FundingSourceFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"costs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expectedIncreaseAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"annualSpending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentAnnualSpending"}},{"kind":"Field","name":{"kind":"Name","value":"currentAnnualSpendingITPortion"}},{"kind":"Field","name":{"kind":"Name","value":"plannedYearOneSpending"}},{"kind":"Field","name":{"kind":"Name","value":"plannedYearOneSpendingITPortion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contract"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractor"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasContract"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakeID"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FundingSourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeFundingSource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeContractDetailsMutation, UpdateSystemIntakeContractDetailsMutationVariables>;
export const TypedUpdateSystemIntakeRequestDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeRequestDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeRequestDetailsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeRequestDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"businessNeed"}},{"kind":"Field","name":{"kind":"Name","value":"businessSolution"}},{"kind":"Field","name":{"kind":"Name","value":"needsEaSupport"}},{"kind":"Field","name":{"kind":"Name","value":"hasUiChanges"}},{"kind":"Field","name":{"kind":"Name","value":"usesAiTech"}},{"kind":"Field","name":{"kind":"Name","value":"usingSoftware"}},{"kind":"Field","name":{"kind":"Name","value":"acquisitionMethods"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeRequestDetailsMutation, UpdateSystemIntakeRequestDetailsMutationVariables>;
export const TypedUpdateSystemIntakeContactDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeContactDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeContactDetailsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeContactDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"governanceTeams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPresent"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"collaborator"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isso"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPresent"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeContactDetailsMutation, UpdateSystemIntakeContactDetailsMutationVariables>;
export const TypedUpdateSystemIntakeRequestTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeRequestType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeRequestType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeRequestType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"newType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeRequestTypeMutation, UpdateSystemIntakeRequestTypeMutationVariables>;
export const TypedSubmitIntakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitIntake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitIntakeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SubmitIntakeMutation, SubmitIntakeMutationVariables>;
export const TypedUpdateSystemIntakeAdminLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeAdminLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeAdminLeadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeAdminLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminLead"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeAdminLeadMutation, UpdateSystemIntakeAdminLeadMutationVariables>;
export const TypedUpdateSystemIntakeNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeNoteMutation, UpdateSystemIntakeNoteMutationVariables>;
export const TypedUpdateSystemIntakeReviewDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeReviewDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeReviewDatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeReviewDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grtDate"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeReviewDatesMutation, UpdateSystemIntakeReviewDatesMutationVariables>;
export const TypedGetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"launchDarkly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userKey"}},{"kind":"Field","name":{"kind":"Name","value":"signedHash"}}]}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const TypedGetLinkedRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLinkedRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systemIntakeState"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeState"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestState"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestState"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystemDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"linkedSystemIntakes"},"name":{"kind":"Name","value":"linkedSystemIntakes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemIntakeState"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"name"},"name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","alias":{"kind":"Name","value":"status"},"name":{"kind":"Name","value":"statusRequester"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"nextMeetingDate"}},{"kind":"Field","name":{"kind":"Name","value":"lastMeetingDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedTrbRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestState"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"requesterInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextMeetingDate"}},{"kind":"Field","name":{"kind":"Name","value":"lastMeetingDate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetLinkedRequestsQuery, GetLinkedRequestsQueryVariables>;
export const TypedGetRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySystemIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"statusRequester"}},{"kind":"Field","name":{"kind":"Name","value":"statusAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}},{"kind":"Field","name":{"kind":"Name","value":"grtDate"}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}},{"kind":"Field","name":{"kind":"Name","value":"nextMeetingDate"}},{"kind":"Field","name":{"kind":"Name","value":"lastMeetingDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myTrbRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"archived"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"submittedAt"},"name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"nextMeetingDate"},"name":{"kind":"Name","value":"consultMeetingTime"}},{"kind":"Field","name":{"kind":"Name","value":"lastMeetingDate"}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetRequestsQuery, GetRequestsQueryVariables>;
export const TypedGetCedarRoleTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCedarRoleTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CedarRoleTypeFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CedarRoleTypeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CedarRoleType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<GetCedarRoleTypesQuery, GetCedarRoleTypesQueryVariables>;
export const TypedSetRolesForUserOnSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetRolesForUserOnSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetRolesForUserOnSystemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setRolesForUserOnSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SetRolesForUserOnSystemMutation, SetRolesForUserOnSystemMutationVariables>;
export const TypedCreateCedarSystemBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCedarSystemBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCedarSystemBookmarkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCedarSystemBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystemBookmark"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystemId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCedarSystemBookmarkMutation, CreateCedarSystemBookmarkMutationVariables>;
export const TypedDeleteCedarSystemBookmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCedarSystemBookmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCedarSystemBookmarkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCedarSystemBookmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystemId"}}]}}]}}]} as unknown as DocumentNode<DeleteCedarSystemBookmarkMutation, DeleteCedarSystemBookmarkMutationVariables>;
export const TypedGetCedarContactsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCedarContacts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commonName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarPersonsByCommonName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commonName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commonName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}}]}}]} as unknown as DocumentNode<GetCedarContactsQuery, GetCedarContactsQueryVariables>;
export const TypedGetCedarSubSystemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCedarSubSystems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSubSystems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetCedarSubSystemsQuery, GetCedarSubSystemsQueryVariables>;
export const TypedGetCedarSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCedarSystem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrgComp"}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerOrgComp"}},{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"}}]}}]}}]} as unknown as DocumentNode<GetCedarSystemQuery, GetCedarSystemQueryVariables>;
export const TypedGetCedarSystemIDsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCedarSystemIDs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCedarSystemIDsQuery, GetCedarSystemIDsQueryVariables>;
export const TypedGetCedarSystemIsBookmarkedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCedarSystemIsBookmarked"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"}}]}}]}}]} as unknown as DocumentNode<GetCedarSystemIsBookmarkedQuery, GetCedarSystemIsBookmarkedQueryVariables>;
export const TypedGetCedarSystemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrgComp"}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerOrgComp"}},{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"}},{"kind":"Field","name":{"kind":"Name","value":"atoExpirationDate"}},{"kind":"Field","name":{"kind":"Name","value":"linkedTrbRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"EnumValue","value":"OPEN"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedSystemIntakes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"EnumValue","value":"OPEN"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetCedarSystemsQuery, GetCedarSystemsQueryVariables>;
export const TypedGetMyCedarSystemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyCedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrgComp"}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerOrgComp"}},{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"}},{"kind":"Field","name":{"kind":"Name","value":"atoExpirationDate"}},{"kind":"Field","name":{"kind":"Name","value":"linkedSystemIntakes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"EnumValue","value":"OPEN"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedTrbRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"EnumValue","value":"OPEN"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyCedarSystemsQuery, GetMyCedarSystemsQueryVariables>;
export const TypedGetSystemIntakesWithLCIDSDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakesWithLCIDS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakesWithLcids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"lcidExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcidScope"}},{"kind":"Field","name":{"kind":"Name","value":"decisionNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"trbFollowUpRecommendation"}},{"kind":"Field","name":{"kind":"Name","value":"lcidCostBaseline"}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakesWithLCIDSQuery, GetSystemIntakesWithLCIDSQueryVariables>;
export const TypedGetSystemProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarAuthorityToOperate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"actualDispositionDate"}},{"kind":"Field","name":{"kind":"Name","value":"containsPersonallyIdentifiableInformation"}},{"kind":"Field","name":{"kind":"Name","value":"countOfTotalNonPrivilegedUserPopulation"}},{"kind":"Field","name":{"kind":"Name","value":"countOfOpenPoams"}},{"kind":"Field","name":{"kind":"Name","value":"countOfTotalPrivilegedUserPopulation"}},{"kind":"Field","name":{"kind":"Name","value":"dateAuthorizationMemoExpires"}},{"kind":"Field","name":{"kind":"Name","value":"dateAuthorizationMemoSigned"}},{"kind":"Field","name":{"kind":"Name","value":"eAuthenticationLevel"}},{"kind":"Field","name":{"kind":"Name","value":"fips199OverallImpactRating"}},{"kind":"Field","name":{"kind":"Name","value":"fismaSystemAcronym"}},{"kind":"Field","name":{"kind":"Name","value":"fismaSystemName"}},{"kind":"Field","name":{"kind":"Name","value":"isAccessedByNonOrganizationalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"isPiiLimitedToUserNameAndPass"}},{"kind":"Field","name":{"kind":"Name","value":"isProtectedHealthInformation"}},{"kind":"Field","name":{"kind":"Name","value":"lastActScaDate"}},{"kind":"Field","name":{"kind":"Name","value":"lastAssessmentDate"}},{"kind":"Field","name":{"kind":"Name","value":"lastContingencyPlanCompletionDate"}},{"kind":"Field","name":{"kind":"Name","value":"lastPenTestDate"}},{"kind":"Field","name":{"kind":"Name","value":"piaCompletionDate"}},{"kind":"Field","name":{"kind":"Name","value":"primaryCyberRiskAdvisor"}},{"kind":"Field","name":{"kind":"Name","value":"privacySubjectMatterExpert"}},{"kind":"Field","name":{"kind":"Name","value":"recoveryPointObjective"}},{"kind":"Field","name":{"kind":"Name","value":"recoveryTimeObjective"}},{"kind":"Field","name":{"kind":"Name","value":"systemOfRecordsNotice"}},{"kind":"Field","name":{"kind":"Name","value":"tlcPhase"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectionFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"containsHealthDisparityData"}},{"kind":"Field","name":{"kind":"Name","value":"containsPhi"}},{"kind":"Field","name":{"kind":"Name","value":"dataExchangeAgreement"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeDescription"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeDirection"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeId"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeName"}},{"kind":"Field","name":{"kind":"Name","value":"numOfRecords"}},{"kind":"Field","name":{"kind":"Name","value":"sharedViaApi"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarBudget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fiscalYear"}},{"kind":"Field","name":{"kind":"Name","value":"funding"}},{"kind":"Field","name":{"kind":"Name","value":"fundingId"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSource"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"projectTitle"}},{"kind":"Field","name":{"kind":"Name","value":"systemId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarBudgetSystemCost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetActualCost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actualSystemCost"}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYear"}},{"kind":"Field","name":{"kind":"Name","value":"systemId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarThreat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daysOpen"}},{"kind":"Field","name":{"kind":"Name","value":"weaknessRiskLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSoftwareProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiSolnCatg"}},{"kind":"Field","name":{"kind":"Name","value":"aiSolnCatgOther"}},{"kind":"Field","name":{"kind":"Name","value":"apiDataArea"}},{"kind":"Field","name":{"kind":"Name","value":"apiDescPubLocation"}},{"kind":"Field","name":{"kind":"Name","value":"apiDescPublished"}},{"kind":"Field","name":{"kind":"Name","value":"apiFHIRUse"}},{"kind":"Field","name":{"kind":"Name","value":"apiFHIRUseOther"}},{"kind":"Field","name":{"kind":"Name","value":"apiHasPortal"}},{"kind":"Field","name":{"kind":"Name","value":"apisAccessibility"}},{"kind":"Field","name":{"kind":"Name","value":"apisDeveloped"}},{"kind":"Field","name":{"kind":"Name","value":"developmentStage"}},{"kind":"Field","name":{"kind":"Name","value":"softwareProducts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiGatewayUse"}},{"kind":"Field","name":{"kind":"Name","value":"elaPurchase"}},{"kind":"Field","name":{"kind":"Name","value":"elaVendorId"}},{"kind":"Field","name":{"kind":"Name","value":"providesAiCapability"}},{"kind":"Field","name":{"kind":"Name","value":"refstr"}},{"kind":"Field","name":{"kind":"Name","value":"softwareCatagoryConnectionGuid"}},{"kind":"Field","name":{"kind":"Name","value":"softwareVendorConnectionGuid"}},{"kind":"Field","name":{"kind":"Name","value":"softwareCost"}},{"kind":"Field","name":{"kind":"Name","value":"softwareElaOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"softwareName"}},{"kind":"Field","name":{"kind":"Name","value":"systemSoftwareConnectionGuid"}},{"kind":"Field","name":{"kind":"Name","value":"technopediaCategory"}},{"kind":"Field","name":{"kind":"Name","value":"technopediaID"}},{"kind":"Field","name":{"kind":"Name","value":"vendorName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemHasAPIGateway"}},{"kind":"Field","name":{"kind":"Name","value":"usesAiTech"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarContractsBySystem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemID"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"serviceProvided"}},{"kind":"Field","name":{"kind":"Name","value":"isDeliveryOrg"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSystemDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isMySystem"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isCmsOwned"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfContractorFte"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfFederalFte"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSupportedUsersPerMonth"}},{"kind":"Field","name":{"kind":"Name","value":"storesBeneficiaryAddress"}},{"kind":"Field","name":{"kind":"Name","value":"storesBankingData"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrgComp"}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerOrgComp"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deployments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"dataCenter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deploymentType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CedarRoleFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"isAPIEndpoint"}},{"kind":"Field","name":{"kind":"Name","value":"isBehindWebApplicationFirewall"}},{"kind":"Field","name":{"kind":"Name","value":"isVersionCodeRepository"}},{"kind":"Field","name":{"kind":"Name","value":"urlHostingEnv"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemMaintainerInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agileUsed"}},{"kind":"Field","name":{"kind":"Name","value":"deploymentFrequency"}},{"kind":"Field","name":{"kind":"Name","value":"devCompletionPercent"}},{"kind":"Field","name":{"kind":"Name","value":"devWorkDescription"}},{"kind":"Field","name":{"kind":"Name","value":"ecapParticipation"}},{"kind":"Field","name":{"kind":"Name","value":"frontendAccessType"}},{"kind":"Field","name":{"kind":"Name","value":"hardCodedIPAddress"}},{"kind":"Field","name":{"kind":"Name","value":"ip6EnabledAssetPercent"}},{"kind":"Field","name":{"kind":"Name","value":"ip6TransitionPlan"}},{"kind":"Field","name":{"kind":"Name","value":"ipEnabledAssetCount"}},{"kind":"Field","name":{"kind":"Name","value":"netAccessibility"}},{"kind":"Field","name":{"kind":"Name","value":"plansToRetireReplace"}},{"kind":"Field","name":{"kind":"Name","value":"quarterToRetireReplace"}},{"kind":"Field","name":{"kind":"Name","value":"systemCustomization"}},{"kind":"Field","name":{"kind":"Name","value":"yearToRetireReplace"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSubSystems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CedarRoleFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CedarRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"application"}},{"kind":"Field","name":{"kind":"Name","value":"objectID"}},{"kind":"Field","name":{"kind":"Name","value":"roleTypeID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeType"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeUsername"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeEmail"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeOrgID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeOrgName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeLastName"}},{"kind":"Field","name":{"kind":"Name","value":"roleTypeName"}},{"kind":"Field","name":{"kind":"Name","value":"roleID"}}]}}]} as unknown as DocumentNode<GetSystemProfileQuery, GetSystemProfileQueryVariables>;
export const TypedGetSystemWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cedarAuthorityToOperate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"tlcPhase"}},{"kind":"Field","name":{"kind":"Name","value":"dateAuthorizationMemoExpires"}},{"kind":"Field","name":{"kind":"Name","value":"countOfOpenPoams"}},{"kind":"Field","name":{"kind":"Name","value":"lastAssessmentDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSystemDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cedarSystemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cedarSystemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isMySystem"}},{"kind":"Field","name":{"kind":"Name","value":"cedarSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"}},{"kind":"Field","name":{"kind":"Name","value":"linkedTrbRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"EnumValue","value":"OPEN"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedSystemIntakes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"EnumValue","value":"OPEN"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CedarRoleFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CedarRoleFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CedarRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"application"}},{"kind":"Field","name":{"kind":"Name","value":"objectID"}},{"kind":"Field","name":{"kind":"Name","value":"roleTypeID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeType"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeUsername"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeEmail"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeOrgID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeOrgName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeLastName"}},{"kind":"Field","name":{"kind":"Name","value":"roleTypeName"}},{"kind":"Field","name":{"kind":"Name","value":"roleID"}}]}}]} as unknown as DocumentNode<GetSystemWorkspaceQuery, GetSystemWorkspaceQueryVariables>;
export const TypedGetTRBAdminHomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBAdminHome"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"archived"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isRecent"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"consultMeetingTime"}},{"kind":"Field","name":{"kind":"Name","value":"trbLeadInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterComponent"}},{"kind":"Field","name":{"kind":"Name","value":"requesterInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formStatus"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackStatus"}},{"kind":"Field","name":{"kind":"Name","value":"consultPrepStatus"}},{"kind":"Field","name":{"kind":"Name","value":"attendConsultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBAdminHomeQuery, GetTRBAdminHomeQueryVariables>;
export const TypedCreateTRBAdminNoteConsultSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBAdminNoteConsultSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBAdminNoteConsultSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBAdminNoteConsultSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToBasicRequestDetails"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToSubjectAreas"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToAttendees"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToMeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"categorySpecificData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTRBAdminNoteConsultSessionMutation, CreateTRBAdminNoteConsultSessionMutationVariables>;
export const TypedCreateTRBAdminNoteGeneralRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBAdminNoteGeneralRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBAdminNoteGeneralRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBAdminNoteGeneralRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToBasicRequestDetails"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToSubjectAreas"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToAttendees"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToMeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"categorySpecificData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTRBAdminNoteGeneralRequestMutation, CreateTRBAdminNoteGeneralRequestMutationVariables>;
export const TypedCreateTRBAdminNoteGuidanceLetterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBAdminNoteGuidanceLetter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBAdminNoteGuidanceLetterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBAdminNoteGuidanceLetter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToBasicRequestDetails"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToSubjectAreas"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToAttendees"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToMeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"categorySpecificData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTRBAdminNoteGuidanceLetterMutation, CreateTRBAdminNoteGuidanceLetterMutationVariables>;
export const TypedCreateTRBAdminNoteInitialRequestFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBAdminNoteInitialRequestForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBAdminNoteInitialRequestFormInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBAdminNoteInitialRequestForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToBasicRequestDetails"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToSubjectAreas"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToAttendees"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToMeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"categorySpecificData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTRBAdminNoteInitialRequestFormMutation, CreateTRBAdminNoteInitialRequestFormMutationVariables>;
export const TypedCreateTRBAdminNoteSupportingDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBAdminNoteSupportingDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBAdminNoteSupportingDocumentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBAdminNoteSupportingDocuments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNote"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToBasicRequestDetails"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToSubjectAreas"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToAttendees"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToMeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"categorySpecificData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTRBAdminNoteSupportingDocumentsMutation, CreateTRBAdminNoteSupportingDocumentsMutationVariables>;
export const TypedGetTRBAdminNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBAdminNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"adminNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNote"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToBasicRequestDetails"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToSubjectAreas"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToAttendees"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appliesToMeetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"appliesToNextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAdminNote"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"categorySpecificData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteInitialRequestFormCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteSupportingDocumentsCategoryData"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAdminNoteGuidanceLetterCategoryData"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables>;
export const TypedCreateTRBRequestAttendeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBRequestAttendee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBRequestAttendeeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBRequestAttendee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAttendeeFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAttendeeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestAttendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trbRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"userInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<CreateTRBRequestAttendeeMutation, CreateTRBRequestAttendeeMutationVariables>;
export const TypedDeleteTRBRequestAttendeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTRBRequestAttendee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTRBRequestAttendee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAttendeeFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAttendeeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestAttendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trbRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"userInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<DeleteTRBRequestAttendeeMutation, DeleteTRBRequestAttendeeMutationVariables>;
export const TypedGetTRBRequestAttendeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestAttendees"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAttendeeFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAttendeeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestAttendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trbRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"userInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetTRBRequestAttendeesQuery, GetTRBRequestAttendeesQueryVariables>;
export const TypedUpdateTRBRequestAttendeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBRequestAttendee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBRequestAttendeeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestAttendee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBAttendeeFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBAttendeeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestAttendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trbRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"userInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<UpdateTRBRequestAttendeeMutation, UpdateTRBRequestAttendeeMutationVariables>;
export const TypedCreateTRBGuidanceLetterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBGuidanceLetter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBGuidanceLetter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"trbRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetter"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"nextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowupRecommended"}},{"kind":"Field","name":{"kind":"Name","value":"dateSent"}},{"kind":"Field","name":{"kind":"Name","value":"followupPoint"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]} as unknown as DocumentNode<CreateTRBGuidanceLetterMutation, CreateTRBGuidanceLetterMutationVariables>;
export const TypedCreateTRBGuidanceLetterInsightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBGuidanceLetterInsight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBGuidanceLetterInsightInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBGuidanceLetterInsight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}}]} as unknown as DocumentNode<CreateTRBGuidanceLetterInsightMutation, CreateTRBGuidanceLetterInsightMutationVariables>;
export const TypedDeleteTRBGuidanceLetterInsightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTRBGuidanceLetterInsight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTRBGuidanceLetterInsight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}}]} as unknown as DocumentNode<DeleteTRBGuidanceLetterInsightMutation, DeleteTRBGuidanceLetterInsightMutationVariables>;
export const TypedGetTRBGuidanceLetterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBGuidanceLetter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"consultMeetingTime"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetter"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"nextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowupRecommended"}},{"kind":"Field","name":{"kind":"Name","value":"dateSent"}},{"kind":"Field","name":{"kind":"Name","value":"followupPoint"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]} as unknown as DocumentNode<GetTRBGuidanceLetterQuery, GetTRBGuidanceLetterQueryVariables>;
export const TypedGetTRBGuidanceLetterInsightsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBGuidanceLetterInsights"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guidanceLetter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}}]} as unknown as DocumentNode<GetTRBGuidanceLetterInsightsQuery, GetTRBGuidanceLetterInsightsQueryVariables>;
export const TypedGetTRBPublicGuidanceLetterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBPublicGuidanceLetter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"requesterInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterComponent"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"needsAssistanceWith"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"consultMeetingTime"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"nextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowupRecommended"}},{"kind":"Field","name":{"kind":"Name","value":"dateSent"}},{"kind":"Field","name":{"kind":"Name","value":"followupPoint"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}}]} as unknown as DocumentNode<GetTRBPublicGuidanceLetterQuery, GetTRBPublicGuidanceLetterQueryVariables>;
export const TypedRequestReviewForTRBGuidanceLetterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestReviewForTRBGuidanceLetter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestReviewForTRBGuidanceLetter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RequestReviewForTRBGuidanceLetterMutation, RequestReviewForTRBGuidanceLetterMutationVariables>;
export const TypedSendTRBGuidanceLetterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendTRBGuidanceLetter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendTRBGuidanceLetterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendTRBGuidanceLetter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SendTRBGuidanceLetterMutation, SendTRBGuidanceLetterMutationVariables>;
export const TypedUpdateTRBGuidanceLetterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBGuidanceLetter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBGuidanceLetterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBGuidanceLetter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetter"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meetingSummary"}},{"kind":"Field","name":{"kind":"Name","value":"nextSteps"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowupRecommended"}},{"kind":"Field","name":{"kind":"Name","value":"dateSent"}},{"kind":"Field","name":{"kind":"Name","value":"followupPoint"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]} as unknown as DocumentNode<UpdateTRBGuidanceLetterMutation, UpdateTRBGuidanceLetterMutationVariables>;
export const TypedUpdateTRBGuidanceLetterInsightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBGuidanceLetterInsight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBGuidanceLetterInsightInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBGuidanceLetterInsight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}}]} as unknown as DocumentNode<UpdateTRBGuidanceLetterInsightMutation, UpdateTRBGuidanceLetterInsightMutationVariables>;
export const TypedUpdateTRBGuidanceLetterInsightOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBGuidanceLetterInsightOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBGuidanceLetterInsightOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBGuidanceLetterInsightOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBGuidanceLetterInsight"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"insight"}},{"kind":"Field","name":{"kind":"Name","value":"links"}}]}}]} as unknown as DocumentNode<UpdateTRBGuidanceLetterInsightOrderMutation, UpdateTRBGuidanceLetterInsightOrderMutationVariables>;
export const TypedCloseTRBRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CloseTRBRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CloseTRBRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closeTRBRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CloseTRBRequestMutation, CloseTRBRequestMutationVariables>;
export const TypedCreateTRBRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrbRequestFormFieldsFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrbRequestFormFieldsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formStatus"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackStatus"}},{"kind":"Field","name":{"kind":"Name","value":"consultPrepStatus"}},{"kind":"Field","name":{"kind":"Name","value":"attendConsultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"needsAssistanceWith"}},{"kind":"Field","name":{"kind":"Name","value":"hasSolutionInMind"}},{"kind":"Field","name":{"kind":"Name","value":"proposedSolution"}},{"kind":"Field","name":{"kind":"Name","value":"whereInProcess"}},{"kind":"Field","name":{"kind":"Name","value":"whereInProcessOther"}},{"kind":"Field","name":{"kind":"Name","value":"hasExpectedStartEndDates"}},{"kind":"Field","name":{"kind":"Name","value":"expectedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"expectedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"collabGroups"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateSecurity"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateEnterpriseArchitecture"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateCloud"}},{"kind":"Field","name":{"kind":"Name","value":"collabDatePrivacyAdvisor"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateGovernanceReviewBoard"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateOther"}},{"kind":"Field","name":{"kind":"Name","value":"collabGroupOther"}},{"kind":"Field","name":{"kind":"Name","value":"collabGRBConsultRequested"}},{"kind":"Field","name":{"kind":"Name","value":"subjectAreaOptions"}},{"kind":"Field","name":{"kind":"Name","value":"subjectAreaOptionOther"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackMessage"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTRBRequestMutation, CreateTRBRequestMutationVariables>;
export const TypedCreateTRBRequestDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBRequestDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBRequestDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBRequestDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTRBRequestDocumentMutation, CreateTRBRequestDocumentMutationVariables>;
export const TypedCreateTRBRequestFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTRBRequestFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTRBRequestFeedbackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTRBRequestFeedback"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateTRBRequestFeedbackMutation, CreateTRBRequestFeedbackMutationVariables>;
export const TypedDeleteTRBRequestDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTRBRequestDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTRBRequestDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileName"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTRBRequestDocumentMutation, DeleteTRBRequestDocumentMutationVariables>;
export const TypedDeleteTRBRequestFundingSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTRBRequestFundingSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTRBRequestFundingSourcesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTRBRequestFundingSources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteTRBRequestFundingSourceMutation, DeleteTRBRequestFundingSourceMutationVariables>;
export const TypedGetTRBLeadOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBLeadOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbLeadOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}}]}}]} as unknown as DocumentNode<GetTRBLeadOptionsQuery, GetTRBLeadOptionsQueryVariables>;
export const TypedGetTRBRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrbRequestFormFieldsFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrbRequestFormFieldsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formStatus"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackStatus"}},{"kind":"Field","name":{"kind":"Name","value":"consultPrepStatus"}},{"kind":"Field","name":{"kind":"Name","value":"attendConsultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"needsAssistanceWith"}},{"kind":"Field","name":{"kind":"Name","value":"hasSolutionInMind"}},{"kind":"Field","name":{"kind":"Name","value":"proposedSolution"}},{"kind":"Field","name":{"kind":"Name","value":"whereInProcess"}},{"kind":"Field","name":{"kind":"Name","value":"whereInProcessOther"}},{"kind":"Field","name":{"kind":"Name","value":"hasExpectedStartEndDates"}},{"kind":"Field","name":{"kind":"Name","value":"expectedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"expectedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"collabGroups"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateSecurity"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateEnterpriseArchitecture"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateCloud"}},{"kind":"Field","name":{"kind":"Name","value":"collabDatePrivacyAdvisor"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateGovernanceReviewBoard"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateOther"}},{"kind":"Field","name":{"kind":"Name","value":"collabGroupOther"}},{"kind":"Field","name":{"kind":"Name","value":"collabGRBConsultRequested"}},{"kind":"Field","name":{"kind":"Name","value":"subjectAreaOptions"}},{"kind":"Field","name":{"kind":"Name","value":"subjectAreaOptionOther"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackMessage"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestQuery, GetTRBRequestQueryVariables>;
export const TypedGetTRBRequestConsultMeetingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestConsultMeeting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"consultMeetingTime"}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestConsultMeetingQuery, GetTRBRequestConsultMeetingQueryVariables>;
export const TypedGetTRBRequestDocumentUrlsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestDocumentUrls"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestDocumentUrlsQuery, GetTRBRequestDocumentUrlsQueryVariables>;
export const TypedGetTRBRequestDocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestDocuments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonType"}},{"kind":"Field","name":{"kind":"Name","value":"otherTypeDescription"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestDocumentsQuery, GetTRBRequestDocumentsQueryVariables>;
export const TypedGetTRBRequestFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackMessage"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestFeedbackQuery, GetTRBRequestFeedbackQueryVariables>;
export const TypedGetTRBRequestHomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestHome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"consultMeetingTime"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formStatus"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trbLeadInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"adminNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestHomeQuery, GetTRBRequestHomeQueryVariables>;
export const TypedGetTRBRequestRelatedRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestRelatedRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"statusRequester"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables>;
export const TypedGetTRBRequestRelationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestRelation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestRelationQuery, GetTRBRequestRelationQueryVariables>;
export const TypedGetTRBRequestSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"trbLeadInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formStatus"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackStatus"}},{"kind":"Field","name":{"kind":"Name","value":"consultPrepStatus"}},{"kind":"Field","name":{"kind":"Name","value":"attendConsultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"adminNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerOrg"}},{"kind":"Field","name":{"kind":"Name","value":"businessOwnerRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectID"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeLastName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestSummaryQuery, GetTRBRequestSummaryQueryVariables>;
export const TypedGetTRBRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myTrbRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"archived"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestsQuery, GetTRBRequestsQueryVariables>;
export const TypedGetTRBTasklistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBTasklist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formStatus"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackStatus"}},{"kind":"Field","name":{"kind":"Name","value":"consultPrepStatus"}},{"kind":"Field","name":{"kind":"Name","value":"attendConsultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatusTaskList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"consultMeetingTime"}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBTasklistQuery, GetTRBTasklistQueryVariables>;
export const TypedReopenTRBRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReopenTRBRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReopenTRBRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reopenTrbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ReopenTRBRequestMutation, ReopenTRBRequestMutationVariables>;
export const TypedUpdateTRBFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBRequestFormInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateTRBFormMutation, UpdateTRBFormMutationVariables>;
export const TypedUpdateTRBRequestAndFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBRequestAndForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBRequestFormInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestChanges"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"changes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrbRequestFormFieldsFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrbRequestFormFieldsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formStatus"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackStatus"}},{"kind":"Field","name":{"kind":"Name","value":"consultPrepStatus"}},{"kind":"Field","name":{"kind":"Name","value":"attendConsultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"guidanceLetterStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"needsAssistanceWith"}},{"kind":"Field","name":{"kind":"Name","value":"hasSolutionInMind"}},{"kind":"Field","name":{"kind":"Name","value":"proposedSolution"}},{"kind":"Field","name":{"kind":"Name","value":"whereInProcess"}},{"kind":"Field","name":{"kind":"Name","value":"whereInProcessOther"}},{"kind":"Field","name":{"kind":"Name","value":"hasExpectedStartEndDates"}},{"kind":"Field","name":{"kind":"Name","value":"expectedStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"expectedEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"collabGroups"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateSecurity"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateEnterpriseArchitecture"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateCloud"}},{"kind":"Field","name":{"kind":"Name","value":"collabDatePrivacyAdvisor"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateGovernanceReviewBoard"}},{"kind":"Field","name":{"kind":"Name","value":"collabDateOther"}},{"kind":"Field","name":{"kind":"Name","value":"collabGroupOther"}},{"kind":"Field","name":{"kind":"Name","value":"collabGRBConsultRequested"}},{"kind":"Field","name":{"kind":"Name","value":"subjectAreaOptions"}},{"kind":"Field","name":{"kind":"Name","value":"subjectAreaOptionOther"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"feedbackMessage"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"decisionState"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTRBRequestAndFormMutation, UpdateTRBRequestAndFormMutationVariables>;
export const TypedUpdateTRBRequestArchivedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBRequestArchived"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"archived"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"changes"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"archived"},"value":{"kind":"Variable","name":{"kind":"Name","value":"archived"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}}]}}]}}]} as unknown as DocumentNode<UpdateTRBRequestArchivedMutation, UpdateTRBRequestArchivedMutationVariables>;
export const TypedUpdateTRBRequestConsultMeetingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBRequestConsultMeeting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBRequestConsultMeetingTimeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestConsultMeetingTime"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"consultMeetingTime"}}]}}]}}]} as unknown as DocumentNode<UpdateTRBRequestConsultMeetingMutation, UpdateTRBRequestConsultMeetingMutationVariables>;
export const TypedUpdateTRBRequestFormStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBRequestFormStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isSubmitted"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isSubmitted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isSubmitted"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"trbRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateTRBRequestFormStatusMutation, UpdateTRBRequestFormStatusMutationVariables>;
export const TypedUpdateTRBRequestFundingSourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBRequestFundingSources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBRequestFundingSourcesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestFundingSources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"fundingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTRBRequestFundingSourcesMutation, UpdateTRBRequestFundingSourcesMutationVariables>;
export const TypedUpdateTRBRequestLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBRequestLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBRequestTRBLeadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestTRBLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trbLead"}},{"kind":"Field","name":{"kind":"Name","value":"trbLeadInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTRBRequestLeadMutation, UpdateTRBRequestLeadMutationVariables>;
export const TypedUpdateTRBRequestTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTRBRequestType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TRBRequestType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"changes"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<UpdateTRBRequestTypeMutation, UpdateTRBRequestTypeMutationVariables>;