import {
  securityFindingKeys,
  teamSectionKeys,
  threatLevelGrades
} from 'constants/systemProfile';
import {
  GetSystemProfile,
  /* eslint-disable camelcase */
  GetSystemProfile_cedarAuthorityToOperate,
  GetSystemProfile_cedarSystemDetails_cedarSystem,
  GetSystemProfile_cedarSystemDetails_deployments_dataCenter,
  GetSystemProfile_cedarSystemDetails_roles,
  GetSystemProfile_cedarSystemDetails_urls
  /* eslint-enable camelcase */
} from 'queries/types/GetSystemProfile';
import {
  tempATOProp,
  tempBudgetProp,
  tempProductsProp,
  tempSubSystemProp,
  tempSystemDataProp
} from 'views/Sandbox/mockSystemData';

import { CedarAssigneeType } from './graphql-global-types';

// Loosely grouped by System Subpages

// Team

export type TeamSectionKey = typeof teamSectionKeys[number];

export interface CedarRoleAssigneePerson
  // eslint-disable-next-line camelcase
  extends GetSystemProfile_cedarSystemDetails_roles {
  assigneeType: CedarAssigneeType.PERSON;
}

export interface UsernameWithRoles {
  assigneeUsername: string;
  roles: CedarRoleAssigneePerson[];
}

// ATO

export type AtoStatus =
  | 'Active'
  | 'Due Soon'
  | 'In Progress'
  | 'Expired'
  | 'No ATO';

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
  | 'funding-and-budget'
  | 'tools-and-software'
  | 'ato'
  | 'lifecycle-id'
  | 'section-508'
  | 'sub-systems'
  | 'system-data'
  | 'documents';

/**
 * A set of some Cedar Role Type Ids used in the client.
 * So far it is certain team members and points of contact.
 * This is a borrowed set from `API/role/type/alfabet`.
 */
// eslint-disable-next-line no-shadow
export enum RoleTypeId {
  API_CONTACT = '238-58-0',
  BUSINESS_OWNER = '238-17-0',
  COR = '238-35-0',
  ISSO = '238-29-0',
  PROJECT_LEAD = '238-32-0',
  SYSTEM_BUSINESS_QUESTION_CONTACT = '238-51-0',
  SYSTEM_DATA_CENTER_CONTACT = '238-52-0',
  SYSTEM_ISSUES_CONTACT = '238-50-0',
  SYSTEM_MAINTAINER = '238-28-0'
}

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
  // eslint-disable-next-line camelcase
  ato?: GetSystemProfile_cedarAuthorityToOperate;
  atoStatus?: AtoStatus;
  locations?: UrlLocation[];
  // eslint-disable-next-line camelcase
  businessOwners: GetSystemProfile_cedarSystemDetails_roles[];
  developmentTags?: DevelopmentTag[];
  numberOfContractorFte?: number;
  numberOfFederalFte?: number;
  numberOfFte?: number;
  personRoles: CedarRoleAssigneePerson[];
  productionLocation?: UrlLocation;
  // eslint-disable-next-line camelcase
  status: GetSystemProfile_cedarSystemDetails_cedarSystem['status'];
  usernamesWithRoles: UsernameWithRoles[];

  // Remaining mock data stubs
  activities?: tempATOProp[];
  budgets?: tempBudgetProp[];
  products?: tempProductsProp[];
  subSystems?: tempSubSystemProp[];
  systemData?: tempSystemDataProp[];
}

export interface SystemProfileSubviewProps {
  system: SystemProfileData;
}
