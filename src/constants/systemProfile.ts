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

/**
 * Returns an array of system profile sections with key/enum and corresponding route.
 *
 * Each section contains an `enabled` flag that determines if development on the section is completed
 * and we should display the new section regardless of the enableEditableSystemProfile feature flag.
 *
 * @param enableEditableSystemProfile - If true, returns editable form section routes instead of read-only routes.
 */
// TODO EASI-4984 - This can be updated to a plain array of sections once editable system profile is complete.
// This format is a workaround for iteratively releasing new sections.
export const getSystemProfileSections = (
  enableEditableSystemProfile: boolean
): Array<{
  key: SystemProfileSection;
  /** Returns correct route based on feature flag state */
  route: string;
  /** If true, this section should be enabled in the edit system profile form regardless of the feature flag. */
  enabled: boolean;
}> => {
  return [
    {
      key: SystemProfileLockableSection.BUSINESS_INFORMATION,
      route: 'business-information',
      enabled: false
    },
    {
      key: SystemProfileLockableSection.IMPLEMENTATION_DETAILS,
      route: enableEditableSystemProfile ? 'implementation-details' : 'details',
      enabled: false
    },
    {
      key: SystemProfileLockableSection.DATA,
      route: enableEditableSystemProfile ? 'data' : 'system-data',
      enabled: false
    },
    {
      key: SystemProfileLockableSection.TOOLS_AND_SOFTWARE,
      route: 'tools-and-software',
      enabled: false
    },
    {
      key: SystemProfileLockableSection.SUB_SYSTEMS,
      route: 'sub-systems',
      enabled: false
    },
    {
      key: SystemProfileLockableSection.TEAM,
      route: enableEditableSystemProfile ? 'team' : 'team/edit?workspace',
      enabled: false
    },
    {
      key: 'CONTRACTS',
      route: 'contracts',
      enabled: false
    },
    {
      key: 'FUNDING_AND_BUDGET',
      route: 'funding-and-budget',
      enabled: false
    },
    {
      key: 'ATO_AND_SECURITY',
      route: 'ato-and-security',
      enabled: false
    }
  ];
};
