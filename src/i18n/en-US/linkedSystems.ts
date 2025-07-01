export default {
  header: 'Add a system link',
  subHeader: 'Add a CMS system that is supported by or supports this request.',
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
    pleaseExplain: 'Please Explain'
  },
  unableToRetrieveCedarSystems:
    'We were unable to retrieve Cedar Systems. Please try again. If this issue persists, please contact <link1>EnterpriseArchitecture@cms.hhs.gov</link1>'
};
