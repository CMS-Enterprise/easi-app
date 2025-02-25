import { RoleTypeName, SubpageKey } from 'types/systemProfile';

/**
 * Points of Contact Cedar Role Type Ids by System Profile subpage.
 * The Contact Role Type Id lists are contextualized by subpage.
 * Lists are in order of priority.
 */
const pointsOfContactIds: Record<SubpageKey, RoleTypeName[]> = {
  home: [RoleTypeName.PROJECT_LEAD],
  details: [
    RoleTypeName.PROJECT_LEAD,
    RoleTypeName.SYSTEM_BUSINESS_QUESTION_CONTACT,
    RoleTypeName.SYSTEM_DATA_CENTER_CONTACT
  ],
  team: [
    RoleTypeName.PROJECT_LEAD,
    RoleTypeName.COR,
    RoleTypeName.SYSTEM_BUSINESS_QUESTION_CONTACT
  ],
  contracts: [],
  'funding-and-budget': [
    RoleTypeName.COR,
    RoleTypeName.SYSTEM_BUSINESS_QUESTION_CONTACT,
    RoleTypeName.PROJECT_LEAD
  ],
  'tools-and-software': [
    RoleTypeName.SYSTEM_MAINTAINER,
    RoleTypeName.SYSTEM_ISSUES_CONTACT,
    RoleTypeName.PROJECT_LEAD
  ],
  'ato-and-security': [
    RoleTypeName.ISSO,
    RoleTypeName.SYSTEM_ISSUES_CONTACT,
    RoleTypeName.PROJECT_LEAD
  ],
  'lifecycle-id': [
    RoleTypeName.PROJECT_LEAD,
    RoleTypeName.COR,
    RoleTypeName.SYSTEM_BUSINESS_QUESTION_CONTACT
  ],
  'sub-systems': [
    RoleTypeName.PROJECT_LEAD,
    RoleTypeName.SYSTEM_MAINTAINER,
    RoleTypeName.SYSTEM_BUSINESS_QUESTION_CONTACT
  ],
  'system-data': [
    RoleTypeName.SYSTEM_MAINTAINER,
    RoleTypeName.API_CONTACT,
    RoleTypeName.PROJECT_LEAD
  ],
  documents: [
    RoleTypeName.PROJECT_LEAD,
    RoleTypeName.SYSTEM_BUSINESS_QUESTION_CONTACT,
    RoleTypeName.SYSTEM_MAINTAINER
  ]
};

// All lists are followed by `RoleTypeId.BUSINESS_OWNER`
Object.values(pointsOfContactIds).forEach(ids => {
  ids.push(RoleTypeName.BUSINESS_OWNER);
});

export default pointsOfContactIds;
