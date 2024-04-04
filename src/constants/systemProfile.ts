// Loosely grouped by System Subpages

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
