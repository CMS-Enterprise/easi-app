// Loosely grouped by System Subpages

import { SystemProfileLockableSection } from 'gql/generated/graphql';

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

/**
 * Array of system profile sections with routes and enabled status.
 *
 * `legacyRoute` is the route for the legacy system profile page to be used if the section is
 * disabled and the feature flag is off.
 *
 * If `enabled` is true, the corresponding edit system profile form section will be enabled and
 * section card will show editable data. This overrides the feature flag.
 */
// TODO EASI-4984 - remove `legacyRoute` once editable system profile feature is fully enabled
export const systemProfileSections = [
  {
    key: SystemProfileLockableSection.BUSINESS_INFORMATION,
    route: 'business-information',
    legacyRoute: '',
    enabled: false
  },
  {
    key: SystemProfileLockableSection.IMPLEMENTATION_DETAILS,
    route: 'implementation-details',
    legacyRoute: 'details',
    enabled: false
  },
  {
    key: SystemProfileLockableSection.DATA,
    route: 'data',
    legacyRoute: 'system-data',
    enabled: false
  },
  {
    key: SystemProfileLockableSection.TOOLS_AND_SOFTWARE,
    route: 'tools-and-software',
    legacyRoute: 'tools-and-software',
    enabled: false
  },
  {
    key: SystemProfileLockableSection.SUB_SYSTEMS,
    route: 'sub-systems',
    legacyRoute: 'sub-systems',
    enabled: false
  },
  {
    key: SystemProfileLockableSection.TEAM,
    route: 'team',
    legacyRoute: 'team/edit?workspace',
    enabled: false
  },
  {
    key: 'CONTRACTS',
    route: 'contracts',
    legacyRoute: 'contracts',
    enabled: false
  },
  {
    key: 'FUNDING_AND_BUDGET',
    route: 'funding-and-budget',
    legacyRoute: 'funding-and-budget',
    enabled: false
  },
  {
    key: 'ATO_AND_SECURITY',
    route: 'ato-and-security',
    legacyRoute: 'ato-and-security',
    enabled: false
  }
] as const;
