// Loosely grouped by System Subpages

import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { Flags } from 'types/flags';
import { SystemProfileSection } from 'types/systemProfile';

// Team

export const teamSectionKeys = [
  'businessOwners',
  'projectLeads',
  'additional'
] as const;

export const TEAM_SECTION_MEMBER_COUNT_CAP = 5;
export const TOOLS_AND_SOFTWARE_PRODUCT_COUNT_CAP = 5;
export const BUDGET_ITEMS_COUNT_CAP = 5;

// ATO

export const ATO_STATUS_DUE_SOON_DAYS = 90;

// Threat levels match values from cedarThreat.weaknessRiskLevel
export const threatLevelGrades = [
  'Critical',
  'High',
  'Moderate',
  'Low',
  'Not Rated'
] as const;

export const securityFindingKeys = ['total', ...threatLevelGrades] as const;

type SystemProfileSectionData = {
  key: SystemProfileSection;
  route: string;
  legacyRoute: string;
  featureFlag: keyof Flags;
};

/**
 * Array of system profile sections with routes and enabled status.
 *
 * `legacyRoute` is the route for the legacy system profile page to be used if feature flags are off.
 */
// TODO EASI-4984 - remove `legacyRoute` once editable system profile feature is fully enabled
export const systemProfileSections = [
  {
    key: SystemProfileLockableSection.BUSINESS_INFORMATION,
    route: 'business-information',
    legacyRoute: '',
    featureFlag: 'systemProfileBusinessInformation'
  },
  {
    key: SystemProfileLockableSection.IMPLEMENTATION_DETAILS,
    route: 'implementation-details',
    legacyRoute: 'details',
    featureFlag: 'systemProfileImplementationDetails'
  },
  {
    key: SystemProfileLockableSection.DATA,
    route: 'data',
    legacyRoute: 'system-data',
    featureFlag: 'systemProfileData'
  },
  {
    key: SystemProfileLockableSection.TOOLS_AND_SOFTWARE,
    route: 'tools-and-software',
    legacyRoute: 'tools-and-software',
    featureFlag: 'systemProfileToolsAndSoftware'
  },
  {
    key: SystemProfileLockableSection.SUB_SYSTEMS,
    route: 'sub-systems',
    legacyRoute: 'sub-systems',
    featureFlag: 'systemProfileSubSystems'
  },
  {
    key: SystemProfileLockableSection.TEAM,
    route: 'team',
    legacyRoute: 'team/edit?workspace',
    featureFlag: 'systemProfileTeam'
  },
  {
    key: 'CONTRACTS',
    route: 'contracts',
    legacyRoute: 'contracts',
    featureFlag: 'systemProfileContracts'
  },
  {
    key: 'FUNDING_AND_BUDGET',
    route: 'funding-and-budget',
    legacyRoute: 'funding-and-budget',
    featureFlag: 'systemProfileFundingAndBudget'
  },
  {
    key: 'ATO_AND_SECURITY',
    route: 'ato-and-security',
    legacyRoute: 'ato-and-security',
    featureFlag: 'systemProfileAtoAndSecurity'
  }
] as const satisfies readonly SystemProfileSectionData[];

export type SystemProfileSectionRoute =
  (typeof systemProfileSections)[number]['route'];
