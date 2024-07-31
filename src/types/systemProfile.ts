import {
  securityFindingKeys,
  teamSectionKeys,
  threatLevelGrades
} from 'constants/systemProfile';
import { CedarRole } from 'queries/types/CedarRole';
import {
  GetSystemProfile,
  /* eslint-disable camelcase */
  GetSystemProfile_cedarAuthorityToOperate,
  GetSystemProfile_cedarBudget,
  GetSystemProfile_cedarBudgetSystemCost,
  GetSystemProfile_cedarSoftwareProducts,
  GetSystemProfile_cedarSystemDetails_cedarSystem,
  GetSystemProfile_cedarSystemDetails_deployments_dataCenter,
  GetSystemProfile_cedarSystemDetails_roles,
  GetSystemProfile_cedarSystemDetails_urls
  /* eslint-enable camelcase */
} from 'queries/types/GetSystemProfile';
import {
  tempATOProp,
  tempSubSystemProp,
  tempSystemDataProp
} from 'views/SystemProfile/mockSystemData';

import { CedarAssigneeType } from './graphql-global-types';

// Loosely grouped by System Subpages

// Team

export type TeamSectionKey = typeof teamSectionKeys[number];

export interface CedarRoleAssigneePerson extends CedarRole {
  assigneeType: CedarAssigneeType.PERSON;
}

export interface UsernameWithRoles {
  assigneeUsername: string;
  roles: CedarRoleAssigneePerson[];
}

// ATO

export type AtoStatus = 'Active' | 'Due Soon' | 'Expired' | 'No ATO';

export type ThreatLevel = typeof threatLevelGrades[number];

export type SecurityFindings = Record<
  typeof securityFindingKeys[number],
  number
>;

// General

export type SubpageKey =
  | 'home'
  | 'details'
  | 'team'
  | 'contracts'
  | 'funding-and-budget'
  | 'tools-and-software'
  | 'ato-and-security'
  | 'lifecycle-id'
  | 'sub-systems'
  | 'system-data'
  | 'documents';

/**
 * A set of some Cedar Role Type Ids used in the client.
 * So far it is certain team members and points of contact.
 * This is a borrowed set from `API/role/type/alfabet`.
 */
export enum RoleTypeName {
  API_CONTACT = 'API Contact',
  BUSINESS_OWNER = 'Business Owner',
  COR = "Contracting Officer's Representative (COR)",
  ISSO = 'ISSO',
  PROJECT_LEAD = 'Project Lead',
  SYSTEM_BUSINESS_QUESTION_CONTACT = 'Business Question Contact',
  SYSTEM_DATA_CENTER_CONTACT = 'Data Center Contact',
  SYSTEM_ISSUES_CONTACT = 'System Issues Contact',
  SYSTEM_MAINTAINER = 'System Maintainer'
}

/**
 * A set of some Cedar Role Type Ids used in the client from the 2.0.0 version of the API
 * So far it is certain team members and points of contact.
 * This is a borrowed set from `API/role/type/alfabet`.
 */
// export enum RoleTypeIdSparx {
//   API_CONTACT = '{1FD4F238-56A1-46d2-8CB1-8A7C87F63A01}',
//   BUSINESS_OWNER = '{C95EA2F9-1A08-4b1a-AEE7-A83011D06113}',
//   COR = '{AB303F45-E6ED-488d-95C1-065457F46028}',
//   ISSO = '{CAE32572-2A36-4d50-9F73-A0EE0A1A6437}',
//   PROJECT_LEAD = '{E324B687-8A7F-4463-BD1D-5A7D04EEB17A}',
//   SYSTEM_BUSINESS_QUESTION_CONTACT = '{260896F7-76AB-4e8d-8FF6-E8A0431B1F6A}',
//   SYSTEM_DATA_CENTER_CONTACT = '{C266D5BF-C298-4ec9-AE49-24DBB8577947}',
//   SYSTEM_ISSUES_CONTACT = '{ED77C4FD-3078-4f65-8FD4-7350DBAE7283}',
//   SYSTEM_MAINTAINER = '{36335B21-40F4-48de-8D16-8F85277C54B8}'
// }

// Development Tags

export type DevelopmentTag = 'Agile Methodology';
// | 'AI Technologies'
// | 'Healthcare Quality'
// | 'Health Insurance Program';

// Urls and Locations

export type UrlLocationTag = 'API endpoint' | 'Versioned code respository';

// eslint-disable-next-line camelcase
export interface UrlLocation extends GetSystemProfile_cedarSystemDetails_urls {
  // eslint-disable-next-line camelcase
  deploymentDataCenterName?: GetSystemProfile_cedarSystemDetails_deployments_dataCenter['name'];
  tags: UrlLocationTag[];
}

export interface SystemProfileData extends GetSystemProfile {
  // The original id type can be null, in which case this object is not created
  id: string;
  /* eslint-disable camelcase */
  ato?: GetSystemProfile_cedarAuthorityToOperate;
  atoStatus?: AtoStatus;
  budgets?: GetSystemProfile_cedarBudget[];
  budgetSystemCosts?: GetSystemProfile_cedarBudgetSystemCost;
  businessOwners: GetSystemProfile_cedarSystemDetails_roles[];
  developmentTags?: DevelopmentTag[];
  locations?: UrlLocation[];
  numberOfContractorFte?: number;
  numberOfFederalFte?: number;
  numberOfFte?: number;
  personRoles: CedarRoleAssigneePerson[];
  plannedRetirement: string | null;
  productionLocation?: UrlLocation;
  status: GetSystemProfile_cedarSystemDetails_cedarSystem['status'];
  usernamesWithRoles: UsernameWithRoles[];

  // Remaining mock data stubs
  activities?: tempATOProp[];
  toolsAndSoftware?: GetSystemProfile_cedarSoftwareProducts;
  subSystems?: tempSubSystemProp[];
  systemData?: tempSystemDataProp[];
  /* eslint-enable camelcase */
}

export interface SystemProfileSubviewProps {
  system: SystemProfileData;
}
