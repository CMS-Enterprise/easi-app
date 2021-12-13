const taskList = {
  withdraw_modal: {
    header: 'Confirm you want to remove {{-requestName}}.',
    warning: 'You will lose any information you have filled in.',
    confirm: 'Remove request',
    cancel: 'Cancel',
    confirmationText_name: 'The request for {{-requestName}} has been removed',
    confirmationText_noName: 'The request has been removed'
  },
  decision: {
    bizCaseApproved: 'Your business case has been approved.',
    bizCaseRejected: 'Your business case has been rejected.',
    aboutThisLcid: 'About this LCID',
    tempLcidExplanation:
      'You have been issued a Lifecycle ID, but you still have more steps to complete before your business case is fully approved.',
    tempLcidNextSteps:
      'You have some steps left before your request is fully processed, review the information on this page and then return to the task list to continue your request',
    notItRequest: 'Not an IT Request',
    noGovernanceNeeded: 'No further governance needed',
    lcid: 'Project Lifecycle ID',
    lcidScope: 'Lifecycle ID Scope',
    lcidExpiration: 'This ID expires on {{date}}',
    costBaseline: 'Project Cost Baseline',
    reasons: 'Reasons',
    nextSteps: 'Next steps',
    completeNextSteps:
      'Finish these next steps to complete the governance review process.'
  },
  navigation: {
    home: 'Home',
    governanceApproval: 'Get governance approval',
    feedback: 'Feedback',
    returnToTaskList: 'Return to task list'
  },
  feedback: {
    heading: 'Recommendations',
    grb: {
      heading: 'GRT recommendations to the GRB',
      help:
        'These are the Governance Reiew Team recommendations for the Governance Review Board'
    },
    businessOwner: {
      heading: 'GRT recommendations to the Business Owner',
      help:
        'These are the Governance Review Team recommendations for the Business Owner'
    },
    descriptiveDate: 'Feedback given on {{date}}'
  }
};

export default taskList;
