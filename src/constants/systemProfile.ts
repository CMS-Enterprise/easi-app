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
export const systemProfileLockableSectionMap: Record<
  SystemProfileSection,
  string
> = {
  BUSINESS_INFORMATION: 'business-information',
  IMPLEMENTATION_DETAILS: 'implementation-details',
  DATA: 'data',
  TOOLS_AND_SOFTWARE: 'tools-and-software',
  SUB_SYSTEMS: 'sub-systems',
  TEAM: 'team',
  CONTRACTS: 'contracts',
  FUNDING_AND_BUDGET: 'funding-and-budget',
  ATO_AND_SECURITY: 'ato-and-security'
};
