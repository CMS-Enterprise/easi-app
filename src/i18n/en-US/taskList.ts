const taskList = {
  withdraw_modal: {
    title: 'EASi',
    header: 'Are you sure you want to remove your request?',
    warning: 'You will lose any information you have filled in.',
    confirm: 'Remove request',
    cancel: 'Cancel',
    confirmationText_name: 'The request for {{requestName}} has been removed',
    confirmationText_noName: 'The request has been removed'
  },
  decision: {
    bizCaseApproved: 'Your business case has been approved.',
    bizCaseRejected: 'Your business case has been rejected.',
    lcid: 'Project Lifecycle ID',
    lcidScope: 'Lifecycle ID Scope',
    lcidExpiration: 'This ID expires on {{date}}',
    reasons: 'Reasons',
    nextSteps: 'Next steps',
    completeNextSteps:
      'Finish these next steps to complete the governance review process.'
  },
  navigation: {
    returnToTaskList: 'Return to task list'
  }
};

export default taskList;
