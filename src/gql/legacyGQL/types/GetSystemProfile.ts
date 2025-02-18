/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ExchangeDirection, CedarAssigneeType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetSystemProfile
// ====================================================

export interface GetSystemProfile_cedarAuthorityToOperate {
  __typename: "CedarAuthorityToOperate";
  uuid: string;
  actualDispositionDate: Time | null;
  containsPersonallyIdentifiableInformation: boolean | null;
  countOfTotalNonPrivilegedUserPopulation: number;
  countOfOpenPoams: number;
  countOfTotalPrivilegedUserPopulation: number;
  dateAuthorizationMemoExpires: Time | null;
  dateAuthorizationMemoSigned: Time | null;
  eAuthenticationLevel: string | null;
  fips199OverallImpactRating: number | null;
  fismaSystemAcronym: string | null;
  fismaSystemName: string | null;
  isAccessedByNonOrganizationalUsers: boolean | null;
  isPiiLimitedToUserNameAndPass: boolean | null;
  isProtectedHealthInformation: boolean | null;
  lastActScaDate: Time | null;
  lastAssessmentDate: Time | null;
  lastContingencyPlanCompletionDate: Time | null;
  lastPenTestDate: Time | null;
  piaCompletionDate: Time | null;
  primaryCyberRiskAdvisor: string | null;
  privacySubjectMatterExpert: string | null;
  recoveryPointObjective: number | null;
  recoveryTimeObjective: number | null;
  systemOfRecordsNotice: string[];
  tlcPhase: string | null;
}

export interface GetSystemProfile_exchanges {
  __typename: "CedarExchange";
  connectionFrequency: string[];
  containsHealthDisparityData: boolean | null;
  containsPhi: boolean | null;
  dataExchangeAgreement: string | null;
  exchangeDescription: string | null;
  exchangeDirection: ExchangeDirection | null;
  exchangeId: string | null;
  exchangeName: string | null;
  numOfRecords: string | null;
  sharedViaApi: boolean | null;
}

export interface GetSystemProfile_cedarBudget {
  __typename: "CedarBudget";
  fiscalYear: string | null;
  funding: string | null;
  fundingId: string | null;
  fundingSource: string | null;
  id: string | null;
  name: string | null;
  projectId: string;
  projectTitle: string | null;
  systemId: string | null;
}

export interface GetSystemProfile_cedarBudgetSystemCost_budgetActualCost {
  __typename: "CedarBudgetActualCost";
  actualSystemCost: string | null;
  fiscalYear: string | null;
  systemId: string | null;
}

export interface GetSystemProfile_cedarBudgetSystemCost {
  __typename: "CedarBudgetSystemCost";
  budgetActualCost: GetSystemProfile_cedarBudgetSystemCost_budgetActualCost[];
}

export interface GetSystemProfile_cedarThreat {
  __typename: "CedarThreat";
  daysOpen: number | null;
  weaknessRiskLevel: string | null;
}

export interface GetSystemProfile_cedarSoftwareProducts_softwareProducts {
  __typename: "CedarSoftwareProductItem";
  apiGatewayUse: boolean | null;
  elaPurchase: string | null;
  elaVendorId: string | null;
  providesAiCapability: boolean | null;
  refstr: string | null;
  softwareCatagoryConnectionGuid: string | null;
  softwareVendorConnectionGuid: string | null;
  softwareCost: string | null;
  softwareElaOrganization: string | null;
  softwareName: string | null;
  systemSoftwareConnectionGuid: string | null;
  technopediaCategory: string | null;
  technopediaID: string | null;
  vendorName: string | null;
}

export interface GetSystemProfile_cedarSoftwareProducts {
  __typename: "CedarSoftwareProducts";
  aiSolnCatg: (string | null)[];
  aiSolnCatgOther: string | null;
  apiDataArea: (string | null)[];
  apiDescPubLocation: string | null;
  apiDescPublished: string | null;
  apiFHIRUse: string | null;
  apiFHIRUseOther: string | null;
  apiHasPortal: boolean | null;
  apisAccessibility: string | null;
  apisDeveloped: string | null;
  developmentStage: string | null;
  softwareProducts: GetSystemProfile_cedarSoftwareProducts_softwareProducts[];
  systemHasAPIGateway: boolean | null;
  usesAiTech: string | null;
}

export interface GetSystemProfile_cedarContractsBySystem {
  __typename: "CedarContract";
  systemID: string | null;
  startDate: Time | null;
  endDate: Time | null;
  contractNumber: string | null;
  contractName: string | null;
  description: string | null;
  orderNumber: string | null;
  serviceProvided: string | null;
  isDeliveryOrg: boolean | null;
}

export interface GetSystemProfile_cedarSystemDetails_businessOwnerInformation {
  __typename: "CedarBusinessOwnerInformation";
  isCmsOwned: boolean | null;
  numberOfContractorFte: string | null;
  numberOfFederalFte: string | null;
  numberOfSupportedUsersPerMonth: string | null;
  storesBeneficiaryAddress: boolean | null;
  storesBankingData: boolean | null;
}

export interface GetSystemProfile_cedarSystemDetails_cedarSystem {
  __typename: "CedarSystem";
  id: string;
  isBookmarked: boolean;
  name: string;
  description: string | null;
  acronym: string | null;
  status: string | null;
  businessOwnerOrg: string | null;
  businessOwnerOrgComp: string | null;
  systemMaintainerOrg: string | null;
  systemMaintainerOrgComp: string | null;
  uuid: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_deployments_dataCenter {
  __typename: "CedarDataCenter";
  name: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_deployments {
  __typename: "CedarDeployment";
  id: string;
  startDate: Time | null;
  dataCenter: GetSystemProfile_cedarSystemDetails_deployments_dataCenter | null;
  deploymentType: string | null;
  name: string;
}

export interface GetSystemProfile_cedarSystemDetails_roles {
  __typename: "CedarRole";
  application: string;
  objectID: string;
  roleTypeID: string;
  assigneeType: CedarAssigneeType | null;
  assigneeUsername: string | null;
  assigneeEmail: string | null;
  assigneeOrgID: string | null;
  assigneeOrgName: string | null;
  assigneeFirstName: string | null;
  assigneeLastName: string | null;
  roleTypeName: string | null;
  roleID: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_urls {
  __typename: "CedarURL";
  id: string;
  address: string | null;
  isAPIEndpoint: boolean | null;
  isBehindWebApplicationFirewall: boolean | null;
  isVersionCodeRepository: boolean | null;
  urlHostingEnv: string | null;
}

export interface GetSystemProfile_cedarSystemDetails_systemMaintainerInformation {
  __typename: "CedarSystemMaintainerInformation";
  agileUsed: boolean | null;
  deploymentFrequency: string | null;
  devCompletionPercent: string | null;
  devWorkDescription: string | null;
  ecapParticipation: boolean | null;
  frontendAccessType: string | null;
  hardCodedIPAddress: boolean | null;
  ip6EnabledAssetPercent: string | null;
  ip6TransitionPlan: string | null;
  ipEnabledAssetCount: number | null;
  netAccessibility: string | null;
  plansToRetireReplace: string | null;
  quarterToRetireReplace: string | null;
  systemCustomization: string | null;
  yearToRetireReplace: string | null;
}

export interface GetSystemProfile_cedarSystemDetails {
  __typename: "CedarSystemDetails";
  isMySystem: boolean | null;
  businessOwnerInformation: GetSystemProfile_cedarSystemDetails_businessOwnerInformation;
  cedarSystem: GetSystemProfile_cedarSystemDetails_cedarSystem;
  deployments: GetSystemProfile_cedarSystemDetails_deployments[];
  roles: GetSystemProfile_cedarSystemDetails_roles[];
  urls: GetSystemProfile_cedarSystemDetails_urls[];
  systemMaintainerInformation: GetSystemProfile_cedarSystemDetails_systemMaintainerInformation;
}

export interface GetSystemProfile_cedarSubSystems {
  __typename: "CedarSubSystem";
  id: string;
  name: string;
  acronym: string | null;
  description: string | null;
}

export interface GetSystemProfile {
  cedarAuthorityToOperate: GetSystemProfile_cedarAuthorityToOperate[];
  exchanges: GetSystemProfile_exchanges[];
  cedarBudget: GetSystemProfile_cedarBudget[] | null;
  cedarBudgetSystemCost: GetSystemProfile_cedarBudgetSystemCost | null;
  cedarThreat: GetSystemProfile_cedarThreat[];
  cedarSoftwareProducts: GetSystemProfile_cedarSoftwareProducts | null;
  cedarContractsBySystem: GetSystemProfile_cedarContractsBySystem[];
  cedarSystemDetails: GetSystemProfile_cedarSystemDetails | null;
  cedarSubSystems: GetSystemProfile_cedarSubSystems[];
}

export interface GetSystemProfileVariables {
  cedarSystemId: string;
}
