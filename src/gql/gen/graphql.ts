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
 * A business case associated with an system IT governence request; contains
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

/** A solution proposal within a business case */
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

/** The status of a business case associated with an system IT governence request */
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

/** BusinessOwnerInformation contains information about the business owner for a CEDAR system */
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

export type CreateSystemIntakeGRBDiscussionPostPayload = {
  __typename: 'CreateSystemIntakeGRBDiscussionPostPayload';
  post?: Maybe<SystemIntakeGRBReviewDiscussionPost>;
  userErrors?: Maybe<Array<UserError>>;
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

/** The data needed to create a TRB admin note with the Advice Letter category */
export type CreateTRBAdminNoteAdviceLetterInput = {
  appliesToMeetingSummary: Scalars['Boolean']['input'];
  appliesToNextSteps: Scalars['Boolean']['input'];
  noteText: Scalars['HTML']['input'];
  recommendationIDs: Array<Scalars['UUID']['input']>;
  trbRequestId: Scalars['UUID']['input'];
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

/** The input required to add a recommendation & links to a TRB advice letter */
export type CreateTRBAdviceLetterRecommendationInput = {
  links: Array<Scalars['String']['input']>;
  recommendation: Scalars['HTML']['input'];
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

/** The requester view of the IT gov draft business case step status */
export enum ITGovDraftBusinessCaseStatus {
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The draft business case has been completed and the intake is on a further step */
  DONE = 'DONE',
  /** This draft business case has edits requested */
  EDITS_REQUESTED = 'EDITS_REQUESTED',
  /** The form has started to be filled out */
  IN_PROGRESS = 'IN_PROGRESS',
  /** This step is no longer needed */
  NOT_NEEDED = 'NOT_NEEDED',
  /** Ready to begin filling out */
  READY = 'READY',
  /** The draft business case has been submitted and it is waiting for feedback from the governance team */
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
  /** The business case has been completed and the intake is on a further step */
  DONE = 'DONE',
  /** This business case has edits requested */
  EDITS_REQUESTED = 'EDITS_REQUESTED',
  /** The form has started to be filled out */
  IN_PROGRESS = 'IN_PROGRESS',
  /** This step is not needed and has been skipped */
  NOT_NEEDED = 'NOT_NEEDED',
  /** Ready to begin filling out */
  READY = 'READY',
  /** The business case has been submitted and it is waiting for feedback from the governance team */
  SUBMITTED = 'SUBMITTED'
}

/** The requester view of the IT Gov GRB step status */
export enum ITGovGRBStatus {
  /** The GRT meeting has already happened, and an outcome hasn't been noted yet */
  AWAITING_DECISION = 'AWAITING_DECISION',
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The step is completed */
  COMPLETED = 'COMPLETED',
  /** This step is not needed and has been skipped */
  NOT_NEEDED = 'NOT_NEEDED',
  /** The GRB meeting is waiting to be scheduled */
  READY_TO_SCHEDULE = 'READY_TO_SCHEDULE',
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

/** The type of a lifecycle cost solution, part of a business case */
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
  createSystemIntakeActionUpdateLCID?: Maybe<UpdateSystemIntakePayload>;
  createSystemIntakeContact?: Maybe<CreateSystemIntakeContactPayload>;
  createSystemIntakeDocument?: Maybe<CreateSystemIntakeDocumentPayload>;
  createSystemIntakeGRBDiscussionPost?: Maybe<CreateSystemIntakeGRBDiscussionPostPayload>;
  createSystemIntakeGRBDiscussionReply?: Maybe<CreateSystemIntakeGRBDiscussionPostPayload>;
  createSystemIntakeGRBReviewers?: Maybe<CreateSystemIntakeGRBReviewersPayload>;
  createSystemIntakeNote?: Maybe<SystemIntakeNote>;
  createTRBAdminNoteAdviceLetter: TRBAdminNote;
  createTRBAdminNoteConsultSession: TRBAdminNote;
  createTRBAdminNoteGeneralRequest: TRBAdminNote;
  createTRBAdminNoteInitialRequestForm: TRBAdminNote;
  createTRBAdminNoteSupportingDocuments: TRBAdminNote;
  createTRBAdviceLetter: TRBAdviceLetter;
  createTRBAdviceLetterRecommendation: TRBAdviceLetterRecommendation;
  createTRBRequest: TRBRequest;
  createTRBRequestAttendee: TRBRequestAttendee;
  createTRBRequestDocument?: Maybe<CreateTRBRequestDocumentPayload>;
  createTRBRequestFeedback: TRBRequestFeedback;
  createTrbLeadOption: UserInfo;
  deleteCedarSystemBookmark?: Maybe<DeleteCedarSystemBookmarkPayload>;
  deleteSystemIntakeContact?: Maybe<DeleteSystemIntakeContactPayload>;
  deleteSystemIntakeDocument?: Maybe<DeleteSystemIntakeDocumentPayload>;
  deleteSystemIntakeGRBReviewer: Scalars['UUID']['output'];
  deleteTRBAdviceLetterRecommendation: TRBAdviceLetterRecommendation;
  deleteTRBRequestAttendee: TRBRequestAttendee;
  deleteTRBRequestDocument?: Maybe<DeleteTRBRequestDocumentPayload>;
  deleteTRBRequestFundingSources: Array<TRBFundingSource>;
  deleteTrbLeadOption: Scalars['Boolean']['output'];
  reopenTrbRequest: TRBRequest;
  requestReviewForTRBAdviceLetter: TRBAdviceLetter;
  sendCantFindSomethingEmail?: Maybe<Scalars['String']['output']>;
  sendFeedbackEmail?: Maybe<Scalars['String']['output']>;
  sendReportAProblemEmail?: Maybe<Scalars['String']['output']>;
  sendTRBAdviceLetter: TRBAdviceLetter;
  setRolesForUserOnSystem?: Maybe<Scalars['String']['output']>;
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
  updateSystemIntakeGRBReviewer: SystemIntakeGRBReviewer;
  updateSystemIntakeLinkedCedarSystem?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeNote: SystemIntakeNote;
  updateSystemIntakeRequestDetails?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeRequestType: SystemIntake;
  updateSystemIntakeReviewDates?: Maybe<UpdateSystemIntakePayload>;
  updateTRBAdviceLetter: TRBAdviceLetter;
  updateTRBAdviceLetterRecommendation: TRBAdviceLetterRecommendation;
  updateTRBAdviceLetterRecommendationOrder: Array<TRBAdviceLetterRecommendation>;
  updateTRBRequest: TRBRequest;
  updateTRBRequestAttendee: TRBRequestAttendee;
  updateTRBRequestConsultMeetingTime: TRBRequest;
  updateTRBRequestForm: TRBRequestForm;
  updateTRBRequestFundingSources: Array<TRBFundingSource>;
  updateTRBRequestTRBLead: TRBRequest;
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
export type MutationCreateTRBAdminNoteAdviceLetterArgs = {
  input: CreateTRBAdminNoteAdviceLetterInput;
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
export type MutationCreateTRBAdminNoteInitialRequestFormArgs = {
  input: CreateTRBAdminNoteInitialRequestFormInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBAdminNoteSupportingDocumentsArgs = {
  input: CreateTRBAdminNoteSupportingDocumentsInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTRBAdviceLetterArgs = {
  trbRequestId: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationCreateTRBAdviceLetterRecommendationArgs = {
  input: CreateTRBAdviceLetterRecommendationInput;
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
export type MutationDeleteSystemIntakeGRBReviewerArgs = {
  input: DeleteSystemIntakeGRBReviewerInput;
};


/** Defines the mutations for the schema */
export type MutationDeleteTRBAdviceLetterRecommendationArgs = {
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
export type MutationRequestReviewForTRBAdviceLetterArgs = {
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
export type MutationSendReportAProblemEmailArgs = {
  input: SendReportAProblemEmailInput;
};


/** Defines the mutations for the schema */
export type MutationSendTRBAdviceLetterArgs = {
  input: SendTRBAdviceLetterInput;
};


/** Defines the mutations for the schema */
export type MutationSetRolesForUserOnSystemArgs = {
  input: SetRolesForUserOnSystemInput;
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
export type MutationUpdateTRBAdviceLetterArgs = {
  input: UpdateTRBAdviceLetterInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBAdviceLetterRecommendationArgs = {
  input: UpdateTRBAdviceLetterRecommendationInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTRBAdviceLetterRecommendationOrderArgs = {
  input: UpdateTRBAdviceLetterRecommendationOrderInput;
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
   * Requests fetches a requester's own intake requests
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

/** The data needed to send a TRB advice letter, including who to notify */
export type SendTRBAdviceLetterInput = {
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
  grbReviewStartedAt?: Maybe<Scalars['Time']['output']>;
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

/** Represents the OIT business owner of a system */
export type SystemIntakeBusinessOwner = {
  __typename: 'SystemIntakeBusinessOwner';
  component?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** The input data used to set the CMS business owner of a system */
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

/** GRB Reviewers for a system intake request */
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

/** This represents the (calculated) statuses that a requester view of a system intake request can show as part of the IT Gov v2 workflow */
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

/**
 * Data specific to admin notes in the Advice Letter category
 * The "recommendations" property _will_ return deleted recommendations so that UI can reference the recommendation title
 */
export type TRBAdminNoteAdviceLetterCategoryData = {
  __typename: 'TRBAdminNoteAdviceLetterCategoryData';
  appliesToMeetingSummary: Scalars['Boolean']['output'];
  appliesToNextSteps: Scalars['Boolean']['output'];
  recommendations: Array<TRBAdviceLetterRecommendation>;
};

/** Represents the category of a single TRB admin note */
export enum TRBAdminNoteCategory {
  ADVICE_LETTER = 'ADVICE_LETTER',
  CONSULT_SESSION = 'CONSULT_SESSION',
  GENERAL_REQUEST = 'GENERAL_REQUEST',
  INITIAL_REQUEST_FORM = 'INITIAL_REQUEST_FORM',
  SUPPORTING_DOCUMENTS = 'SUPPORTING_DOCUMENTS'
}

export type TRBAdminNoteCategorySpecificData = TRBAdminNoteAdviceLetterCategoryData | TRBAdminNoteConsultSessionCategoryData | TRBAdminNoteGeneralRequestCategoryData | TRBAdminNoteInitialRequestFormCategoryData | TRBAdminNoteSupportingDocumentsCategoryData;

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

/** Represents an advice letter for a TRB request */
export type TRBAdviceLetter = {
  __typename: 'TRBAdviceLetter';
  author: UserInfo;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  dateSent?: Maybe<Scalars['Time']['output']>;
  followupPoint?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isFollowupRecommended?: Maybe<Scalars['Boolean']['output']>;
  meetingSummary?: Maybe<Scalars['HTML']['output']>;
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  nextSteps?: Maybe<Scalars['HTML']['output']>;
  /** List of recommendations in the order specified by users */
  recommendations: Array<TRBAdviceLetterRecommendation>;
  trbRequestId: Scalars['UUID']['output'];
};

/** Represents a recommendation and links that have been added to a TRB advice letter */
export type TRBAdviceLetterRecommendation = {
  __typename: 'TRBAdviceLetterRecommendation';
  author: UserInfo;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  id: Scalars['UUID']['output'];
  links: Array<Scalars['String']['output']>;
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  recommendation: Scalars['HTML']['output'];
  title: Scalars['String']['output'];
  trbRequestId: Scalars['UUID']['output'];
};

/** Represents the status of the TRB advice letter step */
export enum TRBAdviceLetterStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW',
  READY_TO_START = 'READY_TO_START'
}

/** Represents the status of the TRB advice letter step */
export enum TRBAdviceLetterStatusTaskList {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  IN_REVIEW = 'IN_REVIEW'
}

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

/** Represents a request for support from the Technical Review Board (TRB) */
export type TRBRequest = {
  __typename: 'TRBRequest';
  adminNotes: Array<TRBAdminNote>;
  adviceLetter?: Maybe<TRBAdviceLetter>;
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
  ADVICE_LETTER_IN_REVIEW = 'ADVICE_LETTER_IN_REVIEW',
  ADVICE_LETTER_SENT = 'ADVICE_LETTER_SENT',
  CONSULT_COMPLETE = 'CONSULT_COMPLETE',
  CONSULT_SCHEDULED = 'CONSULT_SCHEDULED',
  DRAFT_ADVICE_LETTER = 'DRAFT_ADVICE_LETTER',
  DRAFT_REQUEST_FORM = 'DRAFT_REQUEST_FORM',
  FOLLOW_UP_REQUESTED = 'FOLLOW_UP_REQUESTED',
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
  adviceLetterStatus: TRBAdviceLetterStatus;
  adviceLetterStatusTaskList: TRBAdviceLetterStatusTaskList;
  attendConsultStatus: TRBAttendConsultStatus;
  consultPrepStatus: TRBConsultPrepStatus;
  feedbackStatus: TRBFeedbackStatus;
  formStatus: TRBFormStatus;
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

/** The data needed to update a TRB advice letter */
export type UpdateTRBAdviceLetterInput = {
  followupPoint?: InputMaybe<Scalars['String']['input']>;
  isFollowupRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  meetingSummary?: InputMaybe<Scalars['HTML']['input']>;
  nextSteps?: InputMaybe<Scalars['HTML']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** The input required to update a recommendation to a TRB advice letter */
export type UpdateTRBAdviceLetterRecommendationInput = {
  id: Scalars['UUID']['input'];
  links?: InputMaybe<Array<Scalars['String']['input']>>;
  recommendation?: InputMaybe<Scalars['HTML']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTRBAdviceLetterRecommendationOrderInput = {
  /** List of the recommendation IDs in the new order they should be displayed */
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
  content: Scalars['HTML']['input'];
  systemIntakeID: Scalars['UUID']['input'];
};

export type CreateSystemIntakeGRBDiscussionReplyInput = {
  content: Scalars['HTML']['input'];
  initialPostID: Scalars['UUID']['input'];
};

export type CreateSystemIntakeGRBReviewersMutationVariables = Exact<{
  input: CreateSystemIntakeGRBReviewersInput;
}>;


export type CreateSystemIntakeGRBReviewersMutation = { __typename: 'Mutation', createSystemIntakeGRBReviewers?: { __typename: 'CreateSystemIntakeGRBReviewersPayload', reviewers: Array<{ __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } }> } | null };

export type DeleteSystemIntakeGRBReviewerMutationVariables = Exact<{
  input: DeleteSystemIntakeGRBReviewerInput;
}>;


export type DeleteSystemIntakeGRBReviewerMutation = { __typename: 'Mutation', deleteSystemIntakeGRBReviewer: UUID };

export type GetGRBReviewersComparisonsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetGRBReviewersComparisonsQuery = { __typename: 'Query', compareGRBReviewersByIntakeID: Array<{ __typename: 'GRBReviewerComparisonIntake', id: UUID, requestName: string, reviewers: Array<{ __typename: 'GRBReviewerComparison', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, isCurrentReviewer: boolean, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } }> }> };

export type GetSystemIntakeGRBReviewersQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeGRBReviewersQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, grbReviewStartedAt?: Time | null, grbReviewers: Array<{ __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } }> } | null };

export type SystemIntakeWithReviewRequestedFragment = { __typename: 'SystemIntake', id: UUID, requestName?: string | null, requesterName?: string | null, requesterComponent?: string | null, grbDate?: Time | null };

export type GetSystemIntakesWithReviewRequestedQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemIntakesWithReviewRequestedQuery = { __typename: 'Query', systemIntakesWithReviewRequested: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, requesterName?: string | null, requesterComponent?: string | null, grbDate?: Time | null }> };

export type StartGRBReviewMutationVariables = Exact<{
  input: StartGRBReviewInput;
}>;


export type StartGRBReviewMutation = { __typename: 'Mutation', startGRBReview?: string | null };

export type SystemIntakeGRBReviewerFragment = { __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } };

export type UpdateSystemIntakeGRBReviewerMutationVariables = Exact<{
  input: UpdateSystemIntakeGRBReviewerInput;
}>;


export type UpdateSystemIntakeGRBReviewerMutation = { __typename: 'Mutation', updateSystemIntakeGRBReviewer: { __typename: 'SystemIntakeGRBReviewer', id: UUID, grbRole: SystemIntakeGRBReviewerRole, votingRole: SystemIntakeGRBReviewerVotingRole, userAccount: { __typename: 'UserAccount', id: UUID, username: string, commonName: string, email: string } } };

export type ArchiveSystemIntakeMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type ArchiveSystemIntakeMutation = { __typename: 'Mutation', archiveSystemIntake: { __typename: 'SystemIntake', id: UUID, archivedAt?: Time | null } };

export type GetSystemIntakeRelatedRequestsQueryVariables = Exact<{
  systemIntakeID: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeRelatedRequestsQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, statusAdmin: SystemIntakeStatusAdmin, statusRequester: SystemIntakeStatusRequester, submittedAt?: Time | null, lcid?: string | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }> } | null };

export type GetSystemIntakeRelationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSystemIntakeRelationQuery = { __typename: 'Query', systemIntake?: { __typename: 'SystemIntake', id: UUID, relationType?: RequestRelationType | null, contractName?: string | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> } | null, cedarSystems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> };

export type GetTrbLeadOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTrbLeadOptionsQuery = { __typename: 'Query', trbLeadOptions: Array<{ __typename: 'UserInfo', euaUserId: string, commonName: string }> };

export type GetTRBRequestRelatedRequestsQueryVariables = Exact<{
  trbRequestID: Scalars['UUID']['input'];
}>;


export type GetTRBRequestRelatedRequestsQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, relatedIntakes: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, statusAdmin: SystemIntakeStatusAdmin, statusRequester: SystemIntakeStatusRequester, submittedAt?: Time | null, lcid?: string | null, contractNumbers: Array<{ __typename: 'SystemIntakeContractNumber', contractNumber: string }> }>, relatedTRBRequests: Array<{ __typename: 'TRBRequest', id: UUID, name?: string | null, status: TRBRequestStatus, createdAt: Time, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }> }> } };

export type GetTrbRequestRelationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTrbRequestRelationQuery = { __typename: 'Query', trbRequest: { __typename: 'TRBRequest', id: UUID, relationType?: RequestRelationType | null, contractName?: string | null, contractNumbers: Array<{ __typename: 'TRBRequestContractNumber', contractNumber: string }>, systems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> }, cedarSystems: Array<{ __typename: 'CedarSystem', id: string, name: string, acronym?: string | null }> };

export type UpdateTrbRequestFormStatusMutationVariables = Exact<{
  isSubmitted: Scalars['Boolean']['input'];
  trbRequestId: Scalars['UUID']['input'];
}>;


export type UpdateTrbRequestFormStatusMutation = { __typename: 'Mutation', updateTRBRequestForm: { __typename: 'TRBRequestForm', status: TRBFormStatus } };

export type UpdateTrbRequestLeadMutationVariables = Exact<{
  input: UpdateTRBRequestTRBLeadInput;
}>;


export type UpdateTrbRequestLeadMutation = { __typename: 'Mutation', updateTRBRequestTRBLead: { __typename: 'TRBRequest', id: UUID, trbLead?: string | null, trbLeadInfo: { __typename: 'UserInfo', commonName: string, email: EmailAddress, euaUserId: string } } };

export const SystemIntakeWithReviewRequestedFragmentDoc = gql`
    fragment SystemIntakeWithReviewRequested on SystemIntake {
  id
  requestName
  requesterName
  requesterComponent
  grbDate
}
    `;
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
export const GetSystemIntakeGRBReviewersDocument = gql`
    query GetSystemIntakeGRBReviewers($id: UUID!) {
  systemIntake(id: $id) {
    id
    grbReviewStartedAt
    grbReviewers {
      ...SystemIntakeGRBReviewer
    }
  }
}
    ${SystemIntakeGRBReviewerFragmentDoc}`;

/**
 * __useGetSystemIntakeGRBReviewersQuery__
 *
 * To run a query within a React component, call `useGetSystemIntakeGRBReviewersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemIntakeGRBReviewersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemIntakeGRBReviewersQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemIntakeGRBReviewersQuery(baseOptions: Apollo.QueryHookOptions<GetSystemIntakeGRBReviewersQuery, GetSystemIntakeGRBReviewersQueryVariables> & ({ variables: GetSystemIntakeGRBReviewersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemIntakeGRBReviewersQuery, GetSystemIntakeGRBReviewersQueryVariables>(GetSystemIntakeGRBReviewersDocument, options);
      }
export function useGetSystemIntakeGRBReviewersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemIntakeGRBReviewersQuery, GetSystemIntakeGRBReviewersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemIntakeGRBReviewersQuery, GetSystemIntakeGRBReviewersQueryVariables>(GetSystemIntakeGRBReviewersDocument, options);
        }
export function useGetSystemIntakeGRBReviewersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemIntakeGRBReviewersQuery, GetSystemIntakeGRBReviewersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakeGRBReviewersQuery, GetSystemIntakeGRBReviewersQueryVariables>(GetSystemIntakeGRBReviewersDocument, options);
        }
export type GetSystemIntakeGRBReviewersQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBReviewersQuery>;
export type GetSystemIntakeGRBReviewersLazyQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBReviewersLazyQuery>;
export type GetSystemIntakeGRBReviewersSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakeGRBReviewersSuspenseQuery>;
export type GetSystemIntakeGRBReviewersQueryResult = Apollo.QueryResult<GetSystemIntakeGRBReviewersQuery, GetSystemIntakeGRBReviewersQueryVariables>;
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
export const GetTrbLeadOptionsDocument = gql`
    query GetTrbLeadOptions {
  trbLeadOptions {
    euaUserId
    commonName
  }
}
    `;

/**
 * __useGetTrbLeadOptionsQuery__
 *
 * To run a query within a React component, call `useGetTrbLeadOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrbLeadOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrbLeadOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTrbLeadOptionsQuery(baseOptions?: Apollo.QueryHookOptions<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>(GetTrbLeadOptionsDocument, options);
      }
export function useGetTrbLeadOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>(GetTrbLeadOptionsDocument, options);
        }
export function useGetTrbLeadOptionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>(GetTrbLeadOptionsDocument, options);
        }
export type GetTrbLeadOptionsQueryHookResult = ReturnType<typeof useGetTrbLeadOptionsQuery>;
export type GetTrbLeadOptionsLazyQueryHookResult = ReturnType<typeof useGetTrbLeadOptionsLazyQuery>;
export type GetTrbLeadOptionsSuspenseQueryHookResult = ReturnType<typeof useGetTrbLeadOptionsSuspenseQuery>;
export type GetTrbLeadOptionsQueryResult = Apollo.QueryResult<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>;
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
export const GetTrbRequestRelationDocument = gql`
    query GetTrbRequestRelation($id: UUID!) {
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
 * __useGetTrbRequestRelationQuery__
 *
 * To run a query within a React component, call `useGetTrbRequestRelationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrbRequestRelationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrbRequestRelationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTrbRequestRelationQuery(baseOptions: Apollo.QueryHookOptions<GetTrbRequestRelationQuery, GetTrbRequestRelationQueryVariables> & ({ variables: GetTrbRequestRelationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrbRequestRelationQuery, GetTrbRequestRelationQueryVariables>(GetTrbRequestRelationDocument, options);
      }
export function useGetTrbRequestRelationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrbRequestRelationQuery, GetTrbRequestRelationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrbRequestRelationQuery, GetTrbRequestRelationQueryVariables>(GetTrbRequestRelationDocument, options);
        }
export function useGetTrbRequestRelationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTrbRequestRelationQuery, GetTrbRequestRelationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTrbRequestRelationQuery, GetTrbRequestRelationQueryVariables>(GetTrbRequestRelationDocument, options);
        }
export type GetTrbRequestRelationQueryHookResult = ReturnType<typeof useGetTrbRequestRelationQuery>;
export type GetTrbRequestRelationLazyQueryHookResult = ReturnType<typeof useGetTrbRequestRelationLazyQuery>;
export type GetTrbRequestRelationSuspenseQueryHookResult = ReturnType<typeof useGetTrbRequestRelationSuspenseQuery>;
export type GetTrbRequestRelationQueryResult = Apollo.QueryResult<GetTrbRequestRelationQuery, GetTrbRequestRelationQueryVariables>;
export const UpdateTrbRequestFormStatusDocument = gql`
    mutation UpdateTrbRequestFormStatus($isSubmitted: Boolean!, $trbRequestId: UUID!) {
  updateTRBRequestForm(
    input: {isSubmitted: $isSubmitted, trbRequestId: $trbRequestId}
  ) {
    status
  }
}
    `;
export type UpdateTrbRequestFormStatusMutationFn = Apollo.MutationFunction<UpdateTrbRequestFormStatusMutation, UpdateTrbRequestFormStatusMutationVariables>;

/**
 * __useUpdateTrbRequestFormStatusMutation__
 *
 * To run a mutation, you first call `useUpdateTrbRequestFormStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTrbRequestFormStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestFormStatusMutation, { data, loading, error }] = useUpdateTrbRequestFormStatusMutation({
 *   variables: {
 *      isSubmitted: // value for 'isSubmitted'
 *      trbRequestId: // value for 'trbRequestId'
 *   },
 * });
 */
export function useUpdateTrbRequestFormStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTrbRequestFormStatusMutation, UpdateTrbRequestFormStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTrbRequestFormStatusMutation, UpdateTrbRequestFormStatusMutationVariables>(UpdateTrbRequestFormStatusDocument, options);
      }
export type UpdateTrbRequestFormStatusMutationHookResult = ReturnType<typeof useUpdateTrbRequestFormStatusMutation>;
export type UpdateTrbRequestFormStatusMutationResult = Apollo.MutationResult<UpdateTrbRequestFormStatusMutation>;
export type UpdateTrbRequestFormStatusMutationOptions = Apollo.BaseMutationOptions<UpdateTrbRequestFormStatusMutation, UpdateTrbRequestFormStatusMutationVariables>;
export const UpdateTrbRequestLeadDocument = gql`
    mutation UpdateTrbRequestLead($input: UpdateTRBRequestTRBLeadInput!) {
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
export type UpdateTrbRequestLeadMutationFn = Apollo.MutationFunction<UpdateTrbRequestLeadMutation, UpdateTrbRequestLeadMutationVariables>;

/**
 * __useUpdateTrbRequestLeadMutation__
 *
 * To run a mutation, you first call `useUpdateTrbRequestLeadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTrbRequestLeadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTrbRequestLeadMutation, { data, loading, error }] = useUpdateTrbRequestLeadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTrbRequestLeadMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTrbRequestLeadMutation, UpdateTrbRequestLeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTrbRequestLeadMutation, UpdateTrbRequestLeadMutationVariables>(UpdateTrbRequestLeadDocument, options);
      }
export type UpdateTrbRequestLeadMutationHookResult = ReturnType<typeof useUpdateTrbRequestLeadMutation>;
export type UpdateTrbRequestLeadMutationResult = Apollo.MutationResult<UpdateTrbRequestLeadMutation>;
export type UpdateTrbRequestLeadMutationOptions = Apollo.BaseMutationOptions<UpdateTrbRequestLeadMutation, UpdateTrbRequestLeadMutationVariables>;
export const TypedSystemIntakeWithReviewRequestedFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeWithReviewRequested"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterComponent"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}}]}}]} as unknown as DocumentNode<SystemIntakeWithReviewRequestedFragment, unknown>;
export const TypedSystemIntakeGRBReviewerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<SystemIntakeGRBReviewerFragment, unknown>;
export const TypedCreateSystemIntakeGRBReviewersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSystemIntakeGRBReviewers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSystemIntakeGRBReviewersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSystemIntakeGRBReviewers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CreateSystemIntakeGRBReviewersMutation, CreateSystemIntakeGRBReviewersMutationVariables>;
export const TypedDeleteSystemIntakeGRBReviewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSystemIntakeGRBReviewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSystemIntakeGRBReviewerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSystemIntakeGRBReviewer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteSystemIntakeGRBReviewerMutation, DeleteSystemIntakeGRBReviewerMutationVariables>;
export const TypedgetGRBReviewersComparisonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGRBReviewersComparisons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compareGRBReviewersByIntakeID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"reviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isCurrentReviewer"}}]}}]}}]}}]} as unknown as DocumentNode<GetGRBReviewersComparisonsQuery, GetGRBReviewersComparisonsQueryVariables>;
export const TypedGetSystemIntakeGRBReviewersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeGRBReviewers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewStartedAt"}},{"kind":"Field","name":{"kind":"Name","value":"grbReviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeGRBReviewersQuery, GetSystemIntakeGRBReviewersQueryVariables>;
export const TypedGetSystemIntakesWithReviewRequestedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakesWithReviewRequested"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakesWithReviewRequested"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeWithReviewRequested"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeWithReviewRequested"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterComponent"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}}]}}]} as unknown as DocumentNode<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>;
export const TypedStartGRBReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartGRBReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartGRBReviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGRBReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<StartGRBReviewMutation, StartGRBReviewMutationVariables>;
export const TypedUpdateSystemIntakeGRBReviewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSystemIntakeGRBReviewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSystemIntakeGRBReviewerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSystemIntakeGRBReviewer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntakeGRBReviewer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grbRole"}},{"kind":"Field","name":{"kind":"Name","value":"votingRole"}},{"kind":"Field","name":{"kind":"Name","value":"userAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UpdateSystemIntakeGRBReviewerMutation, UpdateSystemIntakeGRBReviewerMutationVariables>;
export const TypedArchiveSystemIntakeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveSystemIntake"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveSystemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}}]} as unknown as DocumentNode<ArchiveSystemIntakeMutation, ArchiveSystemIntakeMutationVariables>;
export const TypedGetSystemIntakeRelatedRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeRelatedRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systemIntakeID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemIntakeID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"statusRequester"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeRelatedRequestsQuery, GetSystemIntakeRelatedRequestsQueryVariables>;
export const TypedGetSystemIntakeRelationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakeRelation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntake"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}}]} as unknown as DocumentNode<GetSystemIntakeRelationQuery, GetSystemIntakeRelationQueryVariables>;
export const TypedGetTrbLeadOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTrbLeadOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbLeadOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}}]}}]} as unknown as DocumentNode<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>;
export const TypedGetTRBRequestRelatedRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTRBRequestRelatedRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"relatedIntakes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statusAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"statusRequester"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lcid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedTRBRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetTRBRequestRelatedRequestsQuery, GetTRBRequestRelatedRequestsQueryVariables>;
export const TypedGetTrbRequestRelationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTrbRequestRelation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"contractName"}},{"kind":"Field","name":{"kind":"Name","value":"contractNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contractNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cedarSystems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}}]}}]}}]} as unknown as DocumentNode<GetTrbRequestRelationQuery, GetTrbRequestRelationQueryVariables>;
export const TypedUpdateTrbRequestFormStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTrbRequestFormStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isSubmitted"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isSubmitted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isSubmitted"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"trbRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateTrbRequestFormStatusMutation, UpdateTrbRequestFormStatusMutationVariables>;
export const TypedUpdateTrbRequestLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTrbRequestLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBRequestTRBLeadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestTRBLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trbLead"}},{"kind":"Field","name":{"kind":"Name","value":"trbLeadInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTrbRequestLeadMutation, UpdateTrbRequestLeadMutationVariables>;