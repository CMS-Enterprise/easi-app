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
  linkedTrbRequests: Array<TrbRequest>;
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
  state?: TrbRequestState;
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
  urls: Array<CedarUrl>;
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
export type CedarUrl = {
  __typename: 'CedarURL';
  address?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isAPIEndpoint?: Maybe<Scalars['Boolean']['output']>;
  isBehindWebApplicationFirewall?: Maybe<Scalars['Boolean']['output']>;
  isVersionCodeRepository?: Maybe<Scalars['Boolean']['output']>;
  urlHostingEnv?: Maybe<Scalars['String']['output']>;
};

/** The input needed to close a TRB request */
export type CloseTrbRequestInput = {
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
  version: SystemIntakeDocumentVersion;
};

/** Data returned after uploading a document to a System Intake */
export type CreateSystemIntakeDocumentPayload = {
  __typename: 'CreateSystemIntakeDocumentPayload';
  document?: Maybe<SystemIntakeDocument>;
};

export type CreateSystemIntakeGrbReviewerInput = {
  euaUserId: Scalars['String']['input'];
  grbRole: SystemIntakeGrbReviewerRole;
  systemIntakeID: Scalars['UUID']['input'];
  votingRole: SystemIntakeGrbReviewerVotingRole;
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
export type CreateTrbAdminNoteAdviceLetterInput = {
  appliesToMeetingSummary: Scalars['Boolean']['input'];
  appliesToNextSteps: Scalars['Boolean']['input'];
  noteText: Scalars['HTML']['input'];
  recommendationIDs: Array<Scalars['UUID']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the Consult Session category */
export type CreateTrbAdminNoteConsultSessionInput = {
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the General Request category */
export type CreateTrbAdminNoteGeneralRequestInput = {
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the Initial Request Form category */
export type CreateTrbAdminNoteInitialRequestFormInput = {
  appliesToAttendees: Scalars['Boolean']['input'];
  appliesToBasicRequestDetails: Scalars['Boolean']['input'];
  appliesToSubjectAreas: Scalars['Boolean']['input'];
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to create a TRB admin note with the Supporting Documents category */
export type CreateTrbAdminNoteSupportingDocumentsInput = {
  documentIDs: Array<Scalars['UUID']['input']>;
  noteText: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The input required to add a recommendation & links to a TRB advice letter */
export type CreateTrbAdviceLetterRecommendationInput = {
  links: Array<Scalars['String']['input']>;
  recommendation: Scalars['HTML']['input'];
  title: Scalars['String']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed add a TRB request attendee to a TRB request */
export type CreateTrbRequestAttendeeInput = {
  component: Scalars['String']['input'];
  euaUserId: Scalars['String']['input'];
  role: PersonRole;
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed to upload a TRB document and attach it to a request with metadata */
export type CreateTrbRequestDocumentInput = {
  documentType: TrbDocumentCommonType;
  fileData: Scalars['Upload']['input'];
  otherTypeDescription?: InputMaybe<Scalars['String']['input']>;
  requestID: Scalars['UUID']['input'];
};

/** Data returned after uploading a document to a TRB request */
export type CreateTrbRequestDocumentPayload = {
  __typename: 'CreateTRBRequestDocumentPayload';
  document?: Maybe<TrbRequestDocument>;
};

/** The data needed to add feedback to a TRB request */
export type CreateTrbRequestFeedbackInput = {
  action: TrbFeedbackAction;
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

export type DeleteSystemIntakeGrbReviewerInput = {
  reviewerID: Scalars['UUID']['input'];
};

/** Data returned after deleting a document attached to a TRB request */
export type DeleteTrbRequestDocumentPayload = {
  __typename: 'DeleteTRBRequestDocumentPayload';
  document?: Maybe<TrbRequestDocument>;
};

export type DeleteTrbRequestFundingSourcesInput = {
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
export enum ItGovDecisionStatus {
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The step is completed */
  COMPLETED = 'COMPLETED',
  /** This step is in review */
  IN_REVIEW = 'IN_REVIEW'
}

/** The requester view of the IT gov draft business case step status */
export enum ItGovDraftBusinessCaseStatus {
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
export enum ItGovFeedbackStatus {
  /** This step can't be started yet */
  CANT_START = 'CANT_START',
  /** The step is completed */
  COMPLETED = 'COMPLETED',
  /** This step is in review */
  IN_REVIEW = 'IN_REVIEW'
}

/** The requester view of the IT Gov Final Business Case step status */
export enum ItGovFinalBusinessCaseStatus {
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
export enum ItGovGrbStatus {
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
export enum ItGovGrtStatus {
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
export enum ItGovIntakeFormStatus {
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
export type ItGovTaskStatuses = {
  __typename: 'ITGovTaskStatuses';
  bizCaseDraftStatus: ItGovDraftBusinessCaseStatus;
  bizCaseFinalStatus: ItGovFinalBusinessCaseStatus;
  decisionAndNextStepsStatus: ItGovDecisionStatus;
  feedbackFromInitialReviewStatus: ItGovFeedbackStatus;
  grbMeetingStatus: ItGovGrbStatus;
  grtMeetingStatus: ItGovGrtStatus;
  intakeFormStatus: ItGovIntakeFormStatus;
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
  closeTRBRequest: TrbRequest;
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
  createSystemIntakeGRBReviewer: SystemIntakeGrbReviewer;
  createSystemIntakeNote?: Maybe<SystemIntakeNote>;
  createTRBAdminNoteAdviceLetter: TrbAdminNote;
  createTRBAdminNoteConsultSession: TrbAdminNote;
  createTRBAdminNoteGeneralRequest: TrbAdminNote;
  createTRBAdminNoteInitialRequestForm: TrbAdminNote;
  createTRBAdminNoteSupportingDocuments: TrbAdminNote;
  createTRBAdviceLetter: TrbAdviceLetter;
  createTRBAdviceLetterRecommendation: TrbAdviceLetterRecommendation;
  createTRBRequest: TrbRequest;
  createTRBRequestAttendee: TrbRequestAttendee;
  createTRBRequestDocument?: Maybe<CreateTrbRequestDocumentPayload>;
  createTRBRequestFeedback: TrbRequestFeedback;
  createTrbLeadOption: UserInfo;
  deleteCedarSystemBookmark?: Maybe<DeleteCedarSystemBookmarkPayload>;
  deleteSystemIntakeContact?: Maybe<DeleteSystemIntakeContactPayload>;
  deleteSystemIntakeDocument?: Maybe<DeleteSystemIntakeDocumentPayload>;
  deleteSystemIntakeGRBReviewer: Scalars['UUID']['output'];
  deleteTRBAdviceLetterRecommendation: TrbAdviceLetterRecommendation;
  deleteTRBRequestAttendee: TrbRequestAttendee;
  deleteTRBRequestDocument?: Maybe<DeleteTrbRequestDocumentPayload>;
  deleteTRBRequestFundingSources: Array<TrbFundingSource>;
  deleteTrbLeadOption: Scalars['Boolean']['output'];
  reopenTrbRequest: TrbRequest;
  requestReviewForTRBAdviceLetter: TrbAdviceLetter;
  sendCantFindSomethingEmail?: Maybe<Scalars['String']['output']>;
  sendFeedbackEmail?: Maybe<Scalars['String']['output']>;
  sendReportAProblemEmail?: Maybe<Scalars['String']['output']>;
  sendTRBAdviceLetter: TrbAdviceLetter;
  setRolesForUserOnSystem?: Maybe<Scalars['String']['output']>;
  setSystemIntakeRelationExistingService?: Maybe<UpdateSystemIntakePayload>;
  setSystemIntakeRelationExistingSystem?: Maybe<UpdateSystemIntakePayload>;
  setSystemIntakeRelationNewSystem?: Maybe<UpdateSystemIntakePayload>;
  setTRBAdminNoteArchived: TrbAdminNote;
  setTRBRequestRelationExistingService?: Maybe<TrbRequest>;
  setTRBRequestRelationExistingSystem?: Maybe<TrbRequest>;
  setTRBRequestRelationNewSystem?: Maybe<TrbRequest>;
  submitIntake?: Maybe<UpdateSystemIntakePayload>;
  unlinkSystemIntakeRelation?: Maybe<UpdateSystemIntakePayload>;
  unlinkTRBRequestRelation?: Maybe<TrbRequest>;
  updateSystemIntakeAdminLead?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeContact?: Maybe<CreateSystemIntakeContactPayload>;
  updateSystemIntakeContactDetails?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeContractDetails?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeGRBReviewer: SystemIntakeGrbReviewer;
  updateSystemIntakeLinkedCedarSystem?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeNote: SystemIntakeNote;
  updateSystemIntakeRequestDetails?: Maybe<UpdateSystemIntakePayload>;
  updateSystemIntakeRequestType: SystemIntake;
  updateSystemIntakeReviewDates?: Maybe<UpdateSystemIntakePayload>;
  updateTRBAdviceLetter: TrbAdviceLetter;
  updateTRBAdviceLetterRecommendation: TrbAdviceLetterRecommendation;
  updateTRBAdviceLetterRecommendationOrder: Array<TrbAdviceLetterRecommendation>;
  updateTRBRequest: TrbRequest;
  updateTRBRequestAttendee: TrbRequestAttendee;
  updateTRBRequestConsultMeetingTime: TrbRequest;
  updateTRBRequestForm: TrbRequestForm;
  updateTRBRequestFundingSources: Array<TrbFundingSource>;
  updateTRBRequestTRBLead: TrbRequest;
};


/** Defines the mutations for the schema */
export type MutationCloseTrbRequestArgs = {
  input: CloseTrbRequestInput;
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
export type MutationCreateSystemIntakeActionChangeLcidRetirementDateArgs = {
  input: SystemIntakeChangeLcidRetirementDateInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionCloseRequestArgs = {
  input: SystemIntakeCloseRequestInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionConfirmLcidArgs = {
  input: SystemIntakeConfirmLcidInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionExpireLcidArgs = {
  input: SystemIntakeExpireLcidInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionIssueLcidArgs = {
  input: SystemIntakeIssueLcidInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionNotItGovRequestArgs = {
  input: SystemIntakeNotItGovReqInput;
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
export type MutationCreateSystemIntakeActionRetireLcidArgs = {
  input: SystemIntakeRetireLcidInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeActionUpdateLcidArgs = {
  input: SystemIntakeUpdateLcidInput;
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
export type MutationCreateSystemIntakeGrbReviewerArgs = {
  input: CreateSystemIntakeGrbReviewerInput;
};


/** Defines the mutations for the schema */
export type MutationCreateSystemIntakeNoteArgs = {
  input: CreateSystemIntakeNoteInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbAdminNoteAdviceLetterArgs = {
  input: CreateTrbAdminNoteAdviceLetterInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbAdminNoteConsultSessionArgs = {
  input: CreateTrbAdminNoteConsultSessionInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbAdminNoteGeneralRequestArgs = {
  input: CreateTrbAdminNoteGeneralRequestInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbAdminNoteInitialRequestFormArgs = {
  input: CreateTrbAdminNoteInitialRequestFormInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbAdminNoteSupportingDocumentsArgs = {
  input: CreateTrbAdminNoteSupportingDocumentsInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbAdviceLetterArgs = {
  trbRequestId: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationCreateTrbAdviceLetterRecommendationArgs = {
  input: CreateTrbAdviceLetterRecommendationInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbRequestArgs = {
  requestType: TrbRequestType;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbRequestAttendeeArgs = {
  input: CreateTrbRequestAttendeeInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbRequestDocumentArgs = {
  input: CreateTrbRequestDocumentInput;
};


/** Defines the mutations for the schema */
export type MutationCreateTrbRequestFeedbackArgs = {
  input: CreateTrbRequestFeedbackInput;
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
export type MutationDeleteSystemIntakeGrbReviewerArgs = {
  input: DeleteSystemIntakeGrbReviewerInput;
};


/** Defines the mutations for the schema */
export type MutationDeleteTrbAdviceLetterRecommendationArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationDeleteTrbRequestAttendeeArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationDeleteTrbRequestDocumentArgs = {
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationDeleteTrbRequestFundingSourcesArgs = {
  input: DeleteTrbRequestFundingSourcesInput;
};


/** Defines the mutations for the schema */
export type MutationDeleteTrbLeadOptionArgs = {
  eua: Scalars['String']['input'];
};


/** Defines the mutations for the schema */
export type MutationReopenTrbRequestArgs = {
  input: ReopenTrbRequestInput;
};


/** Defines the mutations for the schema */
export type MutationRequestReviewForTrbAdviceLetterArgs = {
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
export type MutationSendTrbAdviceLetterArgs = {
  input: SendTrbAdviceLetterInput;
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
export type MutationSetTrbAdminNoteArchivedArgs = {
  id: Scalars['UUID']['input'];
  isArchived: Scalars['Boolean']['input'];
};


/** Defines the mutations for the schema */
export type MutationSetTrbRequestRelationExistingServiceArgs = {
  input: SetTrbRequestRelationExistingServiceInput;
};


/** Defines the mutations for the schema */
export type MutationSetTrbRequestRelationExistingSystemArgs = {
  input: SetTrbRequestRelationExistingSystemInput;
};


/** Defines the mutations for the schema */
export type MutationSetTrbRequestRelationNewSystemArgs = {
  input: SetTrbRequestRelationNewSystemInput;
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
export type MutationUnlinkTrbRequestRelationArgs = {
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
export type MutationUpdateSystemIntakeGrbReviewerArgs = {
  input: UpdateSystemIntakeGrbReviewerInput;
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
export type MutationUpdateTrbAdviceLetterArgs = {
  input: UpdateTrbAdviceLetterInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTrbAdviceLetterRecommendationArgs = {
  input: UpdateTrbAdviceLetterRecommendationInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTrbAdviceLetterRecommendationOrderArgs = {
  input: UpdateTrbAdviceLetterRecommendationOrderInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTrbRequestArgs = {
  changes?: InputMaybe<TrbRequestChanges>;
  id: Scalars['UUID']['input'];
};


/** Defines the mutations for the schema */
export type MutationUpdateTrbRequestAttendeeArgs = {
  input: UpdateTrbRequestAttendeeInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTrbRequestConsultMeetingTimeArgs = {
  input: UpdateTrbRequestConsultMeetingTimeInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTrbRequestFormArgs = {
  input: UpdateTrbRequestFormInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTrbRequestFundingSourcesArgs = {
  input: UpdateTrbRequestFundingSourcesInput;
};


/** Defines the mutations for the schema */
export type MutationUpdateTrbRequestTrbLeadArgs = {
  input: UpdateTrbRequestTrbLeadInput;
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
  currentUser?: Maybe<CurrentUser>;
  deployments: Array<CedarDeployment>;
  exchanges: Array<CedarExchange>;
  myCedarSystems: Array<CedarSystem>;
  myTrbRequests: Array<TrbRequest>;
  /**
   * Requests fetches a requester's own intake requests
   * first is currently non-functional and can be removed later
   */
  requests?: Maybe<RequestsConnection>;
  roleTypes: Array<CedarRoleType>;
  roles: Array<CedarRole>;
  systemIntake?: Maybe<SystemIntake>;
  systemIntakeContacts: SystemIntakeContactsPayload;
  systemIntakes: Array<SystemIntake>;
  systemIntakesWithLcids: Array<SystemIntake>;
  systemIntakesWithReviewRequested: Array<SystemIntake>;
  trbAdminNote: TrbAdminNote;
  trbLeadOptions: Array<UserInfo>;
  trbRequest: TrbRequest;
  trbRequests: Array<TrbRequest>;
  urls: Array<CedarUrl>;
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
export type QueryRequestsArgs = {
  first: Scalars['Int']['input'];
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
export type ReopenTrbRequestInput = {
  copyTrbMailbox: Scalars['Boolean']['input'];
  notifyEuaIds: Array<Scalars['String']['input']>;
  reasonReopened: Scalars['HTML']['input'];
  trbRequestId: Scalars['UUID']['input'];
};

/** Represents a requester's system intake request */
export type Request = {
  __typename: 'Request';
  id: Scalars['UUID']['output'];
  lcid?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nextMeetingDate?: Maybe<Scalars['Time']['output']>;
  status: Scalars['String']['output'];
  statusCreatedAt?: Maybe<Scalars['Time']['output']>;
  statusRequester?: Maybe<SystemIntakeStatusRequester>;
  submittedAt?: Maybe<Scalars['Time']['output']>;
  type: RequestType;
};

export type RequestEdge = {
  __typename: 'RequestEdge';
  node: Request;
};

export enum RequestRelationType {
  EXISTING_SERVICE = 'EXISTING_SERVICE',
  EXISTING_SYSTEM = 'EXISTING_SYSTEM',
  NEW_SYSTEM = 'NEW_SYSTEM'
}

/** Indicates the type of a request being made with the EASi system */
export enum RequestType {
  GOVERNANCE_REQUEST = 'GOVERNANCE_REQUEST'
}

export type RequestsConnection = {
  __typename: 'RequestsConnection';
  edges: Array<RequestEdge>;
};

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
export type SendTrbAdviceLetterInput = {
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

export type SetTrbRequestRelationExistingServiceInput = {
  contractName: Scalars['String']['input'];
  contractNumbers: Array<Scalars['String']['input']>;
  trbRequestID: Scalars['UUID']['input'];
};

export type SetTrbRequestRelationExistingSystemInput = {
  cedarSystemIDs: Array<Scalars['String']['input']>;
  contractNumbers: Array<Scalars['String']['input']>;
  trbRequestID: Scalars['UUID']['input'];
};

export type SetTrbRequestRelationNewSystemInput = {
  contractNumbers: Array<Scalars['String']['input']>;
  trbRequestID: Scalars['UUID']['input'];
};

/** Input to submit an intake for review */
export type SubmitIntakeInput = {
  id: Scalars['UUID']['input'];
};

/** Represents an IT governance request for a system */
export type SystemIntake = {
  __typename: 'SystemIntake';
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
  /** This is a calculated state based on if a date exists for the GRB Meeting date */
  grbMeetingState: SystemIntakeMeetingState;
  grbReviewers: Array<SystemIntakeGrbReviewer>;
  grtDate?: Maybe<Scalars['Time']['output']>;
  /** This is a calculated state based on if a date exists for the GRT Meeting date */
  grtMeetingState: SystemIntakeMeetingState;
  grtReviewEmailBody?: Maybe<Scalars['String']['output']>;
  hasUiChanges?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['UUID']['output'];
  isso: SystemIntakeIsso;
  itGovTaskStatuses: ItGovTaskStatuses;
  lcid?: Maybe<Scalars['String']['output']>;
  lcidCostBaseline?: Maybe<Scalars['String']['output']>;
  lcidExpiresAt?: Maybe<Scalars['Time']['output']>;
  lcidIssuedAt?: Maybe<Scalars['Time']['output']>;
  lcidRetiresAt?: Maybe<Scalars['Time']['output']>;
  lcidScope?: Maybe<Scalars['HTML']['output']>;
  /** Intentionally nullable - lcidStatus is null if (and only if) the intake doesn't have an LCID issued */
  lcidStatus?: Maybe<SystemIntakeLcidStatus>;
  needsEaSupport?: Maybe<Scalars['Boolean']['output']>;
  notes: Array<SystemIntakeNote>;
  oitSecurityCollaborator?: Maybe<Scalars['String']['output']>;
  oitSecurityCollaboratorName?: Maybe<Scalars['String']['output']>;
  productManager: SystemIntakeProductManager;
  projectAcronym?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['HTML']['output']>;
  /** Other System Intakes that share a CEDAR System or Contract Number */
  relatedIntakes: Array<SystemIntake>;
  /** TRB Requests that share a CEDAR System or Contract Number */
  relatedTRBRequests: Array<TrbRequest>;
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
  trbFollowUpRecommendation?: Maybe<SystemIntakeTrbFollowUp>;
  updatedAt?: Maybe<Scalars['Time']['output']>;
};

/** An action taken on a system intake, often resulting in a change in status. */
export type SystemIntakeAction = {
  __typename: 'SystemIntakeAction';
  actor: SystemIntakeActionActor;
  createdAt: Scalars['Time']['output'];
  feedback?: Maybe<Scalars['HTML']['output']>;
  id: Scalars['UUID']['output'];
  lcidExpirationChange?: Maybe<SystemIntakeLcidExpirationChange>;
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
export type SystemIntakeChangeLcidRetirementDateInput = {
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
export type SystemIntakeConfirmLcidInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  costBaseline?: InputMaybe<Scalars['String']['input']>;
  expiresAt: Scalars['Time']['input'];
  nextSteps: Scalars['HTML']['input'];
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  scope: Scalars['HTML']['input'];
  systemIntakeID: Scalars['UUID']['input'];
  trbFollowUp: SystemIntakeTrbFollowUp;
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
  uploadedAt: Scalars['Time']['output'];
  url: Scalars['String']['output'];
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
export type SystemIntakeExpireLcidInput = {
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

/** GRB Reviewers for a system intake request */
export type SystemIntakeGrbReviewer = {
  __typename: 'SystemIntakeGRBReviewer';
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['UUID']['output'];
  grbRole: SystemIntakeGrbReviewerRole;
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  systemIntakeID: Scalars['UUID']['output'];
  userAccount: UserAccount;
  votingRole: SystemIntakeGrbReviewerVotingRole;
};

export enum SystemIntakeGrbReviewerRole {
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

export enum SystemIntakeGrbReviewerVotingRole {
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
export type SystemIntakeIsso = {
  __typename: 'SystemIntakeISSO';
  isPresent?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** The input data used to set the ISSO associated with a system request, if any */
export type SystemIntakeIssoInput = {
  isPresent?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Input for setting an intake's decision to issuing an LCID in IT Gov v2 */
export type SystemIntakeIssueLcidInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  costBaseline?: InputMaybe<Scalars['String']['input']>;
  expiresAt: Scalars['Time']['input'];
  lcid?: InputMaybe<Scalars['String']['input']>;
  nextSteps: Scalars['HTML']['input'];
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  scope: Scalars['HTML']['input'];
  systemIntakeID: Scalars['UUID']['input'];
  trbFollowUp: SystemIntakeTrbFollowUp;
};

/** Contains the data about a change to the expiration date of a system request's lifecycle ID */
export type SystemIntakeLcidExpirationChange = {
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
export enum SystemIntakeLcidStatus {
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
export type SystemIntakeNotItGovReqInput = {
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
  trbFollowUp: SystemIntakeTrbFollowUp;
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
export type SystemIntakeRetireLcidInput = {
  additionalInfo?: InputMaybe<Scalars['HTML']['input']>;
  adminNote?: InputMaybe<Scalars['HTML']['input']>;
  notificationRecipients?: InputMaybe<EmailNotificationRecipients>;
  reason?: InputMaybe<Scalars['HTML']['input']>;
  retiresAt: Scalars['Time']['input'];
  systemIntakeID: Scalars['UUID']['input'];
};

/** SystemIntakeState represents whether the intake is open or closed */
export enum SystemIntakeState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN'
}

/** This represents the statuses that and admin would see as a representation of a system intake. Note, there is no status for a brand new request, because and Admin doesn't see the request until it is in progress. */
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
export enum SystemIntakeTrbFollowUp {
  NOT_RECOMMENDED = 'NOT_RECOMMENDED',
  RECOMMENDED_BUT_NOT_CRITICAL = 'RECOMMENDED_BUT_NOT_CRITICAL',
  STRONGLY_RECOMMENDED = 'STRONGLY_RECOMMENDED'
}

/** Input for updating an intake's LCID in IT Gov v2 */
export type SystemIntakeUpdateLcidInput = {
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
export type TrbAdminNote = {
  __typename: 'TRBAdminNote';
  author: UserInfo;
  category: TrbAdminNoteCategory;
  categorySpecificData: TrbAdminNoteCategorySpecificData;
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
export type TrbAdminNoteAdviceLetterCategoryData = {
  __typename: 'TRBAdminNoteAdviceLetterCategoryData';
  appliesToMeetingSummary: Scalars['Boolean']['output'];
  appliesToNextSteps: Scalars['Boolean']['output'];
  recommendations: Array<TrbAdviceLetterRecommendation>;
};

/** Represents the category of a single TRB admin note */
export enum TrbAdminNoteCategory {
  ADVICE_LETTER = 'ADVICE_LETTER',
  CONSULT_SESSION = 'CONSULT_SESSION',
  GENERAL_REQUEST = 'GENERAL_REQUEST',
  INITIAL_REQUEST_FORM = 'INITIAL_REQUEST_FORM',
  SUPPORTING_DOCUMENTS = 'SUPPORTING_DOCUMENTS'
}

export type TrbAdminNoteCategorySpecificData = TrbAdminNoteAdviceLetterCategoryData | TrbAdminNoteConsultSessionCategoryData | TrbAdminNoteGeneralRequestCategoryData | TrbAdminNoteInitialRequestFormCategoryData | TrbAdminNoteSupportingDocumentsCategoryData;

/**
 * Data specific to admin notes in the Consult Session category
 * This type doesn't contain any actual data
 */
export type TrbAdminNoteConsultSessionCategoryData = {
  __typename: 'TRBAdminNoteConsultSessionCategoryData';
  /** Placeholder field so this type is non-empty, always null */
  placeholderField?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Data specific to admin notes in the General Request category
 * This type doesn't contain any actual data
 */
export type TrbAdminNoteGeneralRequestCategoryData = {
  __typename: 'TRBAdminNoteGeneralRequestCategoryData';
  /** Placeholder field so this type is non-empty, always null */
  placeholderField?: Maybe<Scalars['Boolean']['output']>;
};

/** Data specific to admin notes in the Initial Request Form category */
export type TrbAdminNoteInitialRequestFormCategoryData = {
  __typename: 'TRBAdminNoteInitialRequestFormCategoryData';
  appliesToAttendees: Scalars['Boolean']['output'];
  appliesToBasicRequestDetails: Scalars['Boolean']['output'];
  appliesToSubjectAreas: Scalars['Boolean']['output'];
};

/**
 * Data specific to admin notes in the Supporting Documents category
 * The "documents" property _will_ return deleted documents so that UI can reference the document name
 */
export type TrbAdminNoteSupportingDocumentsCategoryData = {
  __typename: 'TRBAdminNoteSupportingDocumentsCategoryData';
  documents: Array<TrbRequestDocument>;
};

/** Represents an advice letter for a TRB request */
export type TrbAdviceLetter = {
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
  recommendations: Array<TrbAdviceLetterRecommendation>;
  trbRequestId: Scalars['UUID']['output'];
};

/** Represents a recommendation and links that have been added to a TRB advice letter */
export type TrbAdviceLetterRecommendation = {
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
export enum TrbAdviceLetterStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW',
  READY_TO_START = 'READY_TO_START'
}

/** Represents the status of the TRB advice letter step */
export enum TrbAdviceLetterStatusTaskList {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  IN_REVIEW = 'IN_REVIEW'
}

/** Represents the status of the TRB consult attendance step */
export enum TrbAttendConsultStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  READY_TO_SCHEDULE = 'READY_TO_SCHEDULE',
  SCHEDULED = 'SCHEDULED'
}

/** Represents an option selected for collaboration groups in the TRB request form */
export enum TrbCollabGroupOption {
  CLOUD = 'CLOUD',
  ENTERPRISE_ARCHITECTURE = 'ENTERPRISE_ARCHITECTURE',
  GOVERNANCE_REVIEW_BOARD = 'GOVERNANCE_REVIEW_BOARD',
  OTHER = 'OTHER',
  PRIVACY_ADVISOR = 'PRIVACY_ADVISOR',
  SECURITY = 'SECURITY'
}

/** Represents the status of the TRB consult step */
export enum TrbConsultPrepStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  READY_TO_START = 'READY_TO_START'
}

/**
 * Represents the common options for document type that is attached to a
 * TRB Request
 */
export enum TrbDocumentCommonType {
  ARCHITECTURE_DIAGRAM = 'ARCHITECTURE_DIAGRAM',
  BUSINESS_CASE = 'BUSINESS_CASE',
  OTHER = 'OTHER',
  PRESENTATION_SLIDE_DECK = 'PRESENTATION_SLIDE_DECK'
}

/** Represents the action an admin is taking on a TRB request when leaving feedback */
export enum TrbFeedbackAction {
  READY_FOR_CONSULT = 'READY_FOR_CONSULT',
  REQUEST_EDITS = 'REQUEST_EDITS'
}

/** Represents the status of the TRB feedback step */
export enum TrbFeedbackStatus {
  CANNOT_START_YET = 'CANNOT_START_YET',
  COMPLETED = 'COMPLETED',
  EDITS_REQUESTED = 'EDITS_REQUESTED',
  IN_REVIEW = 'IN_REVIEW',
  READY_TO_START = 'READY_TO_START'
}

/** Represents the status of a TRB request form */
export enum TrbFormStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_TO_START = 'READY_TO_START'
}

/** Represents a TRB funding source */
export type TrbFundingSource = {
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
export type TrbRequest = {
  __typename: 'TRBRequest';
  adminNotes: Array<TrbAdminNote>;
  adviceLetter?: Maybe<TrbAdviceLetter>;
  archived: Scalars['Boolean']['output'];
  attendees: Array<TrbRequestAttendee>;
  consultMeetingTime?: Maybe<Scalars['Time']['output']>;
  contractName?: Maybe<Scalars['String']['output']>;
  /** Linked contract numbers */
  contractNumbers: Array<TrbRequestContractNumber>;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  documents: Array<TrbRequestDocument>;
  feedback: Array<TrbRequestFeedback>;
  form: TrbRequestForm;
  id: Scalars['UUID']['output'];
  isRecent: Scalars['Boolean']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** System Intakes that share a CEDAR System or Contract Number */
  relatedIntakes: Array<SystemIntake>;
  /** Other TRB Requests that share a CEDAR System or Contract Number */
  relatedTRBRequests: Array<TrbRequest>;
  relationType?: Maybe<RequestRelationType>;
  requesterComponent?: Maybe<Scalars['String']['output']>;
  requesterInfo: UserInfo;
  state: TrbRequestState;
  status: TrbRequestStatus;
  /** Linked systems */
  systems: Array<CedarSystem>;
  taskStatuses: TrbTaskStatuses;
  trbLead?: Maybe<Scalars['String']['output']>;
  trbLeadInfo: UserInfo;
  type: TrbRequestType;
};

/** Represents an EUA user who is included as an attendee for a TRB request */
export type TrbRequestAttendee = {
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
export type TrbRequestChanges = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TrbRequestType>;
};

export type TrbRequestContractNumber = {
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
export type TrbRequestDocument = {
  __typename: 'TRBRequestDocument';
  deletedAt?: Maybe<Scalars['Time']['output']>;
  documentType: TrbRequestDocumentType;
  fileName: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  status: TrbRequestDocumentStatus;
  uploadedAt: Scalars['Time']['output'];
  url: Scalars['String']['output'];
};

/** Enumeration of the possible statuses of documents uploaded in the TRB workflow */
export enum TrbRequestDocumentStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  UNAVAILABLE = 'UNAVAILABLE'
}

/**
 * Denotes the type of a document attached to a TRB request,
 * which can be one of a number of common types, or a free-text user-specified type
 */
export type TrbRequestDocumentType = {
  __typename: 'TRBRequestDocumentType';
  commonType: TrbDocumentCommonType;
  otherTypeDescription?: Maybe<Scalars['String']['output']>;
};

/** Represents feedback added to a TRB request */
export type TrbRequestFeedback = {
  __typename: 'TRBRequestFeedback';
  action: TrbFeedbackAction;
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
export type TrbRequestForm = {
  __typename: 'TRBRequestForm';
  collabDateCloud?: Maybe<Scalars['String']['output']>;
  collabDateEnterpriseArchitecture?: Maybe<Scalars['String']['output']>;
  collabDateGovernanceReviewBoard?: Maybe<Scalars['String']['output']>;
  collabDateOther?: Maybe<Scalars['String']['output']>;
  collabDatePrivacyAdvisor?: Maybe<Scalars['String']['output']>;
  collabDateSecurity?: Maybe<Scalars['String']['output']>;
  collabGRBConsultRequested?: Maybe<Scalars['Boolean']['output']>;
  collabGroupOther?: Maybe<Scalars['String']['output']>;
  collabGroups: Array<TrbCollabGroupOption>;
  component?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  expectedEndDate?: Maybe<Scalars['Time']['output']>;
  expectedStartDate?: Maybe<Scalars['Time']['output']>;
  /** TODO: Make Funding sources non-nullable */
  fundingSources?: Maybe<Array<TrbFundingSource>>;
  hasExpectedStartEndDates?: Maybe<Scalars['Boolean']['output']>;
  hasSolutionInMind?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['UUID']['output'];
  modifiedAt?: Maybe<Scalars['Time']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  needsAssistanceWith?: Maybe<Scalars['String']['output']>;
  proposedSolution?: Maybe<Scalars['String']['output']>;
  status: TrbFormStatus;
  subjectAreaOptionOther?: Maybe<Scalars['String']['output']>;
  subjectAreaOptions?: Maybe<Array<TrbSubjectAreaOption>>;
  submittedAt?: Maybe<Scalars['Time']['output']>;
  systemIntakes: Array<SystemIntake>;
  trbRequestId: Scalars['UUID']['output'];
  whereInProcess?: Maybe<TrbWhereInProcessOption>;
  whereInProcessOther?: Maybe<Scalars['String']['output']>;
};

export enum TrbRequestState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN'
}

export enum TrbRequestStatus {
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

export enum TrbRequestType {
  BRAINSTORM = 'BRAINSTORM',
  FOLLOWUP = 'FOLLOWUP',
  FORMAL_REVIEW = 'FORMAL_REVIEW',
  NEED_HELP = 'NEED_HELP',
  OTHER = 'OTHER'
}

/** The possible options on the TRB "Subject Areas" page */
export enum TrbSubjectAreaOption {
  ACCESSIBILITY_COMPLIANCE = 'ACCESSIBILITY_COMPLIANCE',
  ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT = 'ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT',
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
export type TrbTaskStatuses = {
  __typename: 'TRBTaskStatuses';
  adviceLetterStatus: TrbAdviceLetterStatus;
  adviceLetterStatusTaskList: TrbAdviceLetterStatusTaskList;
  attendConsultStatus: TrbAttendConsultStatus;
  consultPrepStatus: TrbConsultPrepStatus;
  feedbackStatus: TrbFeedbackStatus;
  formStatus: TrbFormStatus;
};

/** Represents an option selected to the "where are you in the process?" TRB request form */
export enum TrbWhereInProcessOption {
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
  isso: SystemIntakeIssoInput;
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

export type UpdateSystemIntakeGrbReviewerInput = {
  grbRole: SystemIntakeGrbReviewerRole;
  reviewerID: Scalars['UUID']['input'];
  votingRole: SystemIntakeGrbReviewerVotingRole;
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
  businessNeed?: InputMaybe<Scalars['String']['input']>;
  businessSolution?: InputMaybe<Scalars['String']['input']>;
  cedarSystemId?: InputMaybe<Scalars['String']['input']>;
  currentStage?: InputMaybe<Scalars['String']['input']>;
  hasUiChanges?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['UUID']['input'];
  needsEaSupport?: InputMaybe<Scalars['Boolean']['input']>;
  requestName?: InputMaybe<Scalars['String']['input']>;
};

/** Input data used to update GRT and GRB dates for a system request */
export type UpdateSystemIntakeReviewDatesInput = {
  grbDate?: InputMaybe<Scalars['Time']['input']>;
  grtDate?: InputMaybe<Scalars['Time']['input']>;
  id: Scalars['UUID']['input'];
};

/** The data needed to update a TRB advice letter */
export type UpdateTrbAdviceLetterInput = {
  followupPoint?: InputMaybe<Scalars['String']['input']>;
  isFollowupRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  meetingSummary?: InputMaybe<Scalars['HTML']['input']>;
  nextSteps?: InputMaybe<Scalars['HTML']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** The input required to update a recommendation to a TRB advice letter */
export type UpdateTrbAdviceLetterRecommendationInput = {
  id: Scalars['UUID']['input'];
  links?: InputMaybe<Array<Scalars['String']['input']>>;
  recommendation?: InputMaybe<Scalars['HTML']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTrbAdviceLetterRecommendationOrderInput = {
  /** List of the recommendation IDs in the new order they should be displayed */
  newOrder: Array<Scalars['UUID']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** Represents an EUA user who is included as an attendee for a TRB request */
export type UpdateTrbRequestAttendeeInput = {
  component: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  role: PersonRole;
};

/** The data needed schedule a TRB consult meeting time */
export type UpdateTrbRequestConsultMeetingTimeInput = {
  consultMeetingTime: Scalars['Time']['input'];
  copyTrbMailbox: Scalars['Boolean']['input'];
  notes: Scalars['String']['input'];
  notifyEuaIds: Array<Scalars['String']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** Represents an EUA user who is included as an form for a TRB request */
export type UpdateTrbRequestFormInput = {
  collabDateCloud?: InputMaybe<Scalars['String']['input']>;
  collabDateEnterpriseArchitecture?: InputMaybe<Scalars['String']['input']>;
  collabDateGovernanceReviewBoard?: InputMaybe<Scalars['String']['input']>;
  collabDateOther?: InputMaybe<Scalars['String']['input']>;
  collabDatePrivacyAdvisor?: InputMaybe<Scalars['String']['input']>;
  collabDateSecurity?: InputMaybe<Scalars['String']['input']>;
  collabGRBConsultRequested?: InputMaybe<Scalars['Boolean']['input']>;
  collabGroupOther?: InputMaybe<Scalars['String']['input']>;
  collabGroups?: InputMaybe<Array<TrbCollabGroupOption>>;
  component?: InputMaybe<Scalars['String']['input']>;
  expectedEndDate?: InputMaybe<Scalars['Time']['input']>;
  expectedStartDate?: InputMaybe<Scalars['Time']['input']>;
  hasExpectedStartEndDates?: InputMaybe<Scalars['Boolean']['input']>;
  hasSolutionInMind?: InputMaybe<Scalars['Boolean']['input']>;
  isSubmitted?: InputMaybe<Scalars['Boolean']['input']>;
  needsAssistanceWith?: InputMaybe<Scalars['String']['input']>;
  proposedSolution?: InputMaybe<Scalars['String']['input']>;
  subjectAreaOptionOther?: InputMaybe<Scalars['String']['input']>;
  subjectAreaOptions?: InputMaybe<Array<TrbSubjectAreaOption>>;
  systemIntakes?: InputMaybe<Array<Scalars['UUID']['input']>>;
  trbRequestId: Scalars['UUID']['input'];
  whereInProcess?: InputMaybe<TrbWhereInProcessOption>;
  whereInProcessOther?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTrbRequestFundingSourcesInput = {
  fundingNumber: Scalars['String']['input'];
  sources: Array<Scalars['String']['input']>;
  trbRequestId: Scalars['UUID']['input'];
};

/** The data needed assign a TRB lead to a TRB request */
export type UpdateTrbRequestTrbLeadInput = {
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

export type SystemIntakeWithReviewRequestedFragment = { __typename: 'SystemIntake', id: UUID, requestName?: string | null, requesterName?: string | null, requesterComponent?: string | null, grbDate?: Time | null };

export type GetSystemIntakesWithReviewRequestedQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemIntakesWithReviewRequestedQuery = { __typename: 'Query', systemIntakesWithReviewRequested: Array<{ __typename: 'SystemIntake', id: UUID, requestName?: string | null, requesterName?: string | null, requesterComponent?: string | null, grbDate?: Time | null }> };

export type GetTrbLeadOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTrbLeadOptionsQuery = { __typename: 'Query', trbLeadOptions: Array<{ __typename: 'UserInfo', euaUserId: string, commonName: string }> };

export type UpdateTrbRequestFormStatusMutationVariables = Exact<{
  isSubmitted: Scalars['Boolean']['input'];
  trbRequestId: Scalars['UUID']['input'];
}>;


export type UpdateTrbRequestFormStatusMutation = { __typename: 'Mutation', updateTRBRequestForm: { __typename: 'TRBRequestForm', status: TrbFormStatus } };

export type UpdateTrbRequestLeadMutationVariables = Exact<{
  input: UpdateTrbRequestTrbLeadInput;
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
export function useGetSystemIntakesWithReviewRequestedSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>(GetSystemIntakesWithReviewRequestedDocument, options);
        }
export type GetSystemIntakesWithReviewRequestedQueryHookResult = ReturnType<typeof useGetSystemIntakesWithReviewRequestedQuery>;
export type GetSystemIntakesWithReviewRequestedLazyQueryHookResult = ReturnType<typeof useGetSystemIntakesWithReviewRequestedLazyQuery>;
export type GetSystemIntakesWithReviewRequestedSuspenseQueryHookResult = ReturnType<typeof useGetSystemIntakesWithReviewRequestedSuspenseQuery>;
export type GetSystemIntakesWithReviewRequestedQueryResult = Apollo.QueryResult<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>;
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
export function useGetTrbLeadOptionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>(GetTrbLeadOptionsDocument, options);
        }
export type GetTrbLeadOptionsQueryHookResult = ReturnType<typeof useGetTrbLeadOptionsQuery>;
export type GetTrbLeadOptionsLazyQueryHookResult = ReturnType<typeof useGetTrbLeadOptionsLazyQuery>;
export type GetTrbLeadOptionsSuspenseQueryHookResult = ReturnType<typeof useGetTrbLeadOptionsSuspenseQuery>;
export type GetTrbLeadOptionsQueryResult = Apollo.QueryResult<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>;
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
export const TypedGetSystemIntakesWithReviewRequestedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemIntakesWithReviewRequested"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemIntakesWithReviewRequested"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SystemIntakeWithReviewRequested"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SystemIntakeWithReviewRequested"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SystemIntake"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterComponent"}},{"kind":"Field","name":{"kind":"Name","value":"grbDate"}}]}}]} as unknown as DocumentNode<GetSystemIntakesWithReviewRequestedQuery, GetSystemIntakesWithReviewRequestedQueryVariables>;
export const TypedGetTrbLeadOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTrbLeadOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trbLeadOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}}]}}]}}]} as unknown as DocumentNode<GetTrbLeadOptionsQuery, GetTrbLeadOptionsQueryVariables>;
export const TypedUpdateTrbRequestFormStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTrbRequestFormStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isSubmitted"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isSubmitted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isSubmitted"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"trbRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trbRequestId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateTrbRequestFormStatusMutation, UpdateTrbRequestFormStatusMutationVariables>;
export const TypedUpdateTrbRequestLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTrbRequestLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTRBRequestTRBLeadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTRBRequestTRBLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trbLead"}},{"kind":"Field","name":{"kind":"Name","value":"trbLeadInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"euaUserId"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTrbRequestLeadMutation, UpdateTrbRequestLeadMutationVariables>;