export default {
  header: 'Add a system link',
  subHeader: 'Add a CMS system that is supported by or supports this request.',
  title: 'System information',
  description:
    'This request is related to the system(s) indicated below. They could be related for a variety of reasons, including because this request funds the system or because this request uses the system in its proposed technical solution.',
  editSystemInformation: 'Edit system information',
  linkedSystemsTable: {
    title: 'Linked Cedar Systems',
    jumpToSystems: 'Jump to all CMS systems',
    id: 'linked-system-list',
    header: {
      systemName: 'System name',
      relationships: 'Relationships',
      actions: 'Actions'
    },
    noSystemsListed:
      'You have not yet listed any systems related to this request or to your project.',
    errorRetrievingCedarSystems:
      'There was an error retrieving system names. If the error persists, please contact <link1>EnterpriseArchitecture@cms.hhs.gov</link1>.'
  },
  cmsSystemsDropdown: {
    title: 'CMS System',
    hint: 'Search existing CMS systems by name or acronym.'
  },
  relationship: {
    title: 'Relationship',
    hint: 'Choose the options below that describe the relationship that the selected system has to your request/project. Select all that apply.'
  },
  continueToTaskList: 'Continue to task list',
  dontEditAndReturn: "Don't add a system and return to request",
  addSystem: 'Add system',
  relationshipTypes: {
    primarySupport:
      'This request primarily supports the selected system or is the main ADO contract for the selected system.',
    partialSupport:
      'This request partially contributes financially to the selected system.',
    usesOrImpactedBySelectedSystems:
      'This request uses the selected system in its existing or proposed technical solution or is impacted by the selected system.',
    impactsSelectedSystem: 'This request impacts the selected system. ',
    other: 'Other',
    pleaseExplain: 'Please Explain',
    PRIMARY_SUPPORT:
      'This request primarily supports the selected system or is the main ADO contract for the selected system',
    PARTIAL_SUPPORT:
      'This request partially contributes financially to the selected system',
    USES_OR_IMPACTED_BY_SELECTED_SYSTEM:
      'This request uses the selected system in its existing or proposed technical solution or is impacted by the selected system',
    IMPACTS_SELECTED_SYSTEM: 'This request impacts the selected system ',
    OTHER: 'Other'
  },
  unableToRetrieveCedarSystems:
    'We were unable to retrieve Cedar Systems. Please try again. If this issue persists, please contact <link1>EnterpriseArchitecture@cms.hhs.gov</link1>',
  unableToUpdateSystemLinks:
    'We were unable to update the linked Cedar Systems. Please try again. If this issue persists, please contact <link1>EnterpriseArchitecture@cms.hhs.gov</link1>',
  pleaseSelectASystem: 'Please select a system.'
};
