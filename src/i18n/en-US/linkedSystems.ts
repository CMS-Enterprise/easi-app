export default {
  addFormHeader: 'Add a system link',
  editFormHeader: 'Edit a system link',
  editFormSubheader:
    'If you are requesting a Life Cycle ID (LCID) and governance approval for a new IT investment that is a part of an existing system, please include additional details below. ',
  addFormSubheader:
    'Add a CMS system that is supported by or supports this request.',
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
      'There was an error retrieving system names. If the error persists, please contact <link1>EnterpriseArchitecture@cms.hhs.gov</link1>.',
    edit: 'Edit',
    remove: 'Remove'
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
    pleaseExplain: 'Please explain',
    PRIMARY_SUPPORT:
      'This request primarily supports the selected system or is the main ADO contract for the selected system',
    primarySupportHint:
      'For example, choose this option if the content in this request is mostly for one specific system, or if this is the only contract supporting a particular system.',
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
  unableToRemoveLinkedSystem:
    'There was an issue removing the link between this request and the selected system. Please try again, and if the problem persists, try again later.',
  unableToRemoveAllLinkedSystem:
    'There was an issue removing the link between this request and all of the selected systems. Please try again, and if the problem persists, try again later.',
  pleaseSelectASystem: 'Please select a system.',
  successfullyLinked:
    'You linked <span>{{updatedSystem}}</span> to this IT Governance request.',
  savedChangesToALink:
    'You saved changes to the system link for <span>{{updatedSystem}}</span>.',
  successfullyDeleted: 'You have removed a linked system from this request.',
  removeLinkedSystemModal: {
    heading: 'Remove linked system?',
    message:
      'This action will remove the link between this request and the selected system. Are you sure you want to continue? You may re-link the system later if needed.',
    remove: 'Remove linked system',
    dontRemove: "Don't remove"
  },
  removeAllLinkedSystemModal: {
    heading:
      'Are you sure this project does not support or use any existing CMS systems',
    message:
      'Checking this box will remove all previously -added links to systems. Are you sure you want to continue? You may re-link systems later if needed.',
    remove: 'Remove linked system',
    dontRemove: "Don't remove"
  },
  title: 'System information',
  description:
    'This request is related to the system(s) indicated below. They could be related for a variety of reasons, including because this request funds the system or because this request uses the system in its proposed technical solution.',
  editSystemInformation: 'Edit system information'
};
