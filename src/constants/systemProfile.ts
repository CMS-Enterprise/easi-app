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

/** Expands SystemProfileLockableSection enum to include read-only sections */
export type SystemProfileSection =
  | SystemProfileLockableSection
  | 'CONTRACTS'
  | 'FUNDING_AND_BUDGET'
  | 'ATO_AND_SECURITY';

/** Maps section enum to corresponding route */
// TODO EASI-4984 - Update to use new routes. These point to existing system profile pages (or empty string if not yet implemented).
export const systemProfileLockableSectionMap: Record<
  SystemProfileSection,
  string
> = {
  BUSINESS_INFORMATION: '',
  IMPLEMENTATION_DETAILS: 'details',
  DATA: 'system-data',
  TOOLS_AND_SOFTWARE: 'tools-and-software',
  SUB_SYSTEMS: 'sub-systems',
  TEAM: 'team/edit?workspace',
  CONTRACTS: 'contracts',
  FUNDING_AND_BUDGET: 'funding-and-budget',
  ATO_AND_SECURITY: 'ato-and-security'
};

/** Array of edit system profile sections for form wrapper navigation */
export const systemProfileLockableSections = [
  {
    key: SystemProfileLockableSection.BUSINESS_INFORMATION,
    route: 'business-information'
  },
  {
    key: SystemProfileLockableSection.IMPLEMENTATION_DETAILS,
    route: 'implementation-details'
  },
  { key: SystemProfileLockableSection.DATA, route: 'data' },
  {
    key: SystemProfileLockableSection.TOOLS_AND_SOFTWARE,
    route: 'tools-and-software'
  },
  { key: SystemProfileLockableSection.SUB_SYSTEMS, route: 'sub-systems' },
  { key: SystemProfileLockableSection.TEAM, route: 'team' },
  { key: 'CONTRACTS', route: 'contracts' },
  {
    key: 'FUNDING_AND_BUDGET',
    route: 'funding-and-budget'
  },
  {
    key: 'ATO_AND_SECURITY',
    route: 'ato-and-security'
  }
] as const;
