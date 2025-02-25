import {
  tempATOProp,
  tempSubSystemProp,
  tempSystemDataProp
} from 'features/Systems/SystemProfile/data/mockSystemData';
import {
  CedarAssigneeType,
  CedarRole,
  GetSystemProfileQuery
} from 'gql/generated/graphql';

import {
  securityFindingKeys,
  teamSectionKeys,
  threatLevelGrades
} from 'constants/systemProfile';

// Loosely grouped by System Subpages

// Team

export type TeamSectionKey = (typeof teamSectionKeys)[number];

export interface CedarRoleAssigneePerson extends CedarRole {
  assigneeType: CedarAssigneeType.PERSON;
}

export interface UsernameWithRoles {
  assigneeUsername: string;
  roles: CedarRoleAssigneePerson[];
}

// ATO

export type AtoStatus = 'Active' | 'Due Soon' | 'Expired' | 'No ATO';

export type ThreatLevel = (typeof threatLevelGrades)[number];

export type SecurityFindings = Record<
  (typeof securityFindingKeys)[number],
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

/**
 * A pick of Cedar Role Type Names.
 * These are known names that are also referenced from UX.
 */
export type TeamMemberRoleTypeName =
  | 'Business Owner'
  | 'System Maintainer'
  | "Contracting Officer's Representative (COR)"
  | 'Government Task Lead (GTL)'
  | 'Project Lead'
  | 'ISSO' // ISSO is what we get from cedar. Intended display is: 'Information System Security Officer (ISSO)'
  | 'Subject Matter Expert (SME)'
  | 'Budget Analyst'
  | 'Support Staff'
  | 'Business Question Contact'
  | 'Technical System Issues Contact'
  | 'Data Center Contact'
  | 'API Contact'
  | 'AI Contact';

// Development Tags

export type DevelopmentTag = 'Agile Methodology';
// | 'AI Technologies'
// | 'Healthcare Quality'
// | 'Health Insurance Program';

// Urls and Locations

export type UrlLocationTag = 'API endpoint' | 'Versioned code respository';

type GetSystemProfileURLs = NonNullable<
  NonNullable<GetSystemProfileQuery['cedarSystemDetails']>['urls']
>[number];

type GetSystemProfileDataCenter = NonNullable<
  NonNullable<
    NonNullable<GetSystemProfileQuery['cedarSystemDetails']>['deployments']
  >[number]['dataCenter']
>['name'];

export interface UrlLocation extends GetSystemProfileURLs {
  deploymentDataCenterName?: GetSystemProfileDataCenter;
  tags: UrlLocationTag[];
}

export type GetSystemProfileATO = NonNullable<
  NonNullable<GetSystemProfileQuery['cedarAuthorityToOperate']>
>[number];

export type GetSystemProfileBudget = NonNullable<
  NonNullable<GetSystemProfileQuery['cedarBudget']>
>[number];

export type GetSystemProfileSystemCost = NonNullable<
  NonNullable<GetSystemProfileQuery['cedarBudgetSystemCost']>
>;

export type GetSystemProfileRoles = NonNullable<
  NonNullable<GetSystemProfileQuery['cedarSystemDetails']>['roles'][number]
>;

export type GetSystemProfileStatus = NonNullable<
  NonNullable<
    GetSystemProfileQuery['cedarSystemDetails']
  >['cedarSystem']['status']
>;

export type GetSystemProfileSoftwareProducts = NonNullable<
  NonNullable<GetSystemProfileQuery['cedarSoftwareProducts']>
>;

export type GetSystemProfileCedarThreat = NonNullable<
  NonNullable<GetSystemProfileQuery['cedarThreat']>
>[number];

export type GetSystemProfileContractBySystem = NonNullable<
  NonNullable<GetSystemProfileQuery['cedarContractsBySystem']>
>[number];

export type GetSystemProfileExchanges = NonNullable<
  NonNullable<GetSystemProfileQuery['exchanges']>
>[number];

export interface SystemProfileData extends GetSystemProfileQuery {
  // The original id type can be null, in which case this object is not created
  id: string;
  /* eslint-disable camelcase */
  ato?: GetSystemProfileATO;
  atoStatus?: AtoStatus;
  budgets?: GetSystemProfileBudget[];
  budgetSystemCosts?: GetSystemProfileSystemCost;
  businessOwners: GetSystemProfileRoles[];
  developmentTags?: DevelopmentTag[];
  locations?: UrlLocation[];
  numberOfContractorFte?: number;
  numberOfFederalFte?: number;
  numberOfFte?: number;
  personRoles: CedarRoleAssigneePerson[];
  plannedRetirement: string | null;
  productionLocation?: UrlLocation;
  status: GetSystemProfileStatus;
  usernamesWithRoles: UsernameWithRoles[];

  // Remaining mock data stubs
  activities?: tempATOProp[];
  toolsAndSoftware?: GetSystemProfileSoftwareProducts;
  subSystems?: tempSubSystemProp[];
  systemData?: tempSystemDataProp[];
  /* eslint-enable camelcase */
}

export interface SystemProfileSubviewProps {
  system: SystemProfileData;
}
