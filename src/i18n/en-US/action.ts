const action = {
  actions: {
    notItRequest: 'Not an IT governance request',
    needBizCase: 'Request a business case',
    readyForGrt: 'Mark as ready for GRT'
  },
  issueLCID: {
    backLink: 'Change',
    heading: 'Actions on intake request',
    subheading: 'How to proceed?',
    feedbackLabel: 'This email will be sent to the requester',
    submit: 'Email decision and close this request',
    nextStepsLabel: 'Next Steps',
    nextStepsHelpText: 'Next Steps Help Text',
    scopeLabel: 'Scope of Lifecycle ID',
    scopeHelpText: 'Scope Help Text',
    lcid: {
      new: 'Generate a new Lifecycle ID',
      helpText:
        'If you choose to generate a new Lifecycle ID, one will be generated when you submit this page',
      existing: 'Use an existing Lifecycle ID',
      label: 'Lifecycle ID'
    }
  },
  submitAction: {
    backLink: 'Change',
    heading: 'Actions on intake request',
    feedbackLabel: 'This email will be sent to the requester',
    subheading: 'How to proceed?',
    submit: 'Send email',
    otherOptions: 'show other options'
  }
};

export default action;
