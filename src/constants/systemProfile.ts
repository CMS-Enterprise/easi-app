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

// Team

export const teamSectionKeys = [
  'businessOwners',
  'projectLeads',
  'additional'
] as const;

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
