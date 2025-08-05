export default {
  header: 'Add a system link',
  subHeader: 'Add a CMS system that is supported by or supports this request.',
  title: 'System information',
  description:
    'This request is related to the system(s) indicated below. They could be related for a variety of reasons, including because this request funds the system or because this request uses the system in its proposed technical solution.',
  editSystemInformation: 'Edit system information',
  relationshipTypes: {
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
      'You have not yet listed any systems related to this request or to your project.'
  },
  continueToTaskList: 'Continue to task list'
};
