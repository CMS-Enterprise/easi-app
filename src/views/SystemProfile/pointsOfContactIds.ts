import { RoleTypeId, SubpageKey } from 'types/systemProfile';

/**
 * Points of Contact Cedar Role Type Ids by System Profile subpage.
 * The Contact Role Type Id lists are contextualized by subpage.
 * Lists are in order of priority.
 */
const pointsOfContactIds: Record<SubpageKey, RoleTypeId[]> = {
  home: [RoleTypeId.PROJECT_LEAD],
  details: [
    RoleTypeId.PROJECT_LEAD,
    RoleTypeId.SYSTEM_BUSINESS_QUESTION_CONTACT,
    RoleTypeId.SYSTEM_DATA_CENTER_CONTACT
  ],
  team: [
    RoleTypeId.PROJECT_LEAD,
    RoleTypeId.COR,
    RoleTypeId.SYSTEM_BUSINESS_QUESTION_CONTACT
  ],
  'funding-and-budget': [
    RoleTypeId.COR,
    RoleTypeId.SYSTEM_BUSINESS_QUESTION_CONTACT,
    RoleTypeId.PROJECT_LEAD
  ],
  'tools-and-software': [
    RoleTypeId.SYSTEM_MAINTAINER,
    RoleTypeId.SYSTEM_ISSUES_CONTACT,
    RoleTypeId.PROJECT_LEAD
  ],
  ato: [
    RoleTypeId.ISSO,
    RoleTypeId.SYSTEM_ISSUES_CONTACT,
    RoleTypeId.PROJECT_LEAD
  ],
  'lifecycle-id': [
    RoleTypeId.PROJECT_LEAD,
    RoleTypeId.COR,
    RoleTypeId.SYSTEM_BUSINESS_QUESTION_CONTACT
  ],
  'section-508': [
    RoleTypeId.PROJECT_LEAD,
    RoleTypeId.SYSTEM_MAINTAINER,
    RoleTypeId.SYSTEM_ISSUES_CONTACT
  ],
  'sub-systems': [
    RoleTypeId.PROJECT_LEAD,
    RoleTypeId.SYSTEM_MAINTAINER,
    RoleTypeId.SYSTEM_BUSINESS_QUESTION_CONTACT
  ],
  'system-data': [
    RoleTypeId.SYSTEM_MAINTAINER,
    RoleTypeId.API_CONTACT,
    RoleTypeId.PROJECT_LEAD
  ],
  documents: [
    RoleTypeId.PROJECT_LEAD,
    RoleTypeId.SYSTEM_BUSINESS_QUESTION_CONTACT,
    RoleTypeId.SYSTEM_MAINTAINER
  ]
};

// All lists are followed by `RoleTypeId.BUSINESS_OWNER`
Object.values(pointsOfContactIds).forEach(ids => {
  ids.push(RoleTypeId.BUSINESS_OWNER);
});

export default pointsOfContactIds;
