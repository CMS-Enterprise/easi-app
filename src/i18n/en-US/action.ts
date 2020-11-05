const action = {
  actions: {
    notItRequest: 'Not an IT governance request',
    needBizCase: 'Request a business case',
    readyForGrt: 'Mark as ready for GRT',
    readyForGrb: 'Mark as ready for GRB',
    provideFeedbackNeedBizCase:
      'Provide GRT Feedback and progress to business case',
    issueLcid: 'Issue Lifecycle ID with no further governance',
    bizCaseNeedsChanges: 'Business case needs changes and is not ready for GRT',
    provideGrtFeedbackKeepDraft:
      'Provide GRT feedback and keep business case draft',
    provideGrtFeedbackNeedFinal:
      'Provide GRT feedback and move business case to final'
  },
  issueLCID: {
    backLink: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    feedbackLabel: 'This email will be sent to the requester',
    submit: 'Email decision and close this request',
    nextStepsLabel: 'Next Steps',
    nextStepsHelpText:
      'Provide the requester with some recommendations on how to continue their process. For example, “begin your ATO” or “update your System Profile”. This will help the requester stay on track after they receive their Lifecycle ID.',
    scopeLabel: 'Scope of Lifecycle ID',
    scopeHelpText:
      'Tell the requester what is covered by this Lifecycle ID and what work it limits the project team to.',
    lcid: {
      new: 'Generate a new Lifecycle ID',
      helpText:
        'If you choose to generate a new Lifecycle ID, one will be generated when you submit this page',
      existing: 'Use an existing Lifecycle ID',
      label: 'Lifecycle ID'
    },
    expirationDate: {
      label: 'Expiration Date',
      helpText: 'For example 08 02 1776',
      month: 'Month',
      day: 'Day',
      year: 'Year'
    }
  },
  submitAction: {
    backLink: 'Change',
    heading: 'Actions on request',
    feedbackLabel: 'This email will be sent to the requester',
    subheading: 'How to proceed?',
    submit: 'Send email',
    otherOptions: 'show other options'
  }
};

export default action;
