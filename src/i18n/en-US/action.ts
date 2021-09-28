const action = {
  actions: {
    notItRequest: 'Not an IT governance request',
    needBizCase: 'Request a draft business case',
    readyForGrt: 'Mark as ready for GRT',
    readyForGrb: 'Mark as ready for GRB',
    provideFeedbackNeedBizCase:
      'Provide GRT Feedback and progress to business case',
    issueLcid: 'Issue Lifecycle ID with no further governance',
    bizCaseNeedsChanges: 'Business case needs changes and is not ready for GRT',
    provideGrtFeedbackKeepDraft:
      'Provide GRT feedback and keep working on draft business case',
    provideGrtFeedbackNeedFinal:
      'Provide GRT feedback and request final business case for GRB',
    noGovernance: 'Close project',
    rejectIntake: 'Project not approved by GRB',
    sendEmail: 'Send email',
    guideReceivedClose: 'Decomission guide received. Close the request',
    notRespondingClose: 'Project team not responding. Close the request'
  },
  issueLCID: {
    backLink: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    feedbackLabel: 'This email will be sent to the requester',
    submit: 'Email decision and close this request',
    submitHelp:
      'The information you add to ‘Scope of Lifecycle ID’ and ‘Next Steps’ will be added to this email and then sent. Do not repeat any of that information in the field below.',
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
  extendLcid: {
    backLink: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    action: 'Extend Lifecycle ID expiration date',
    currentLcid: 'Lifecycle ID',
    currentLcidExpiration: 'Current expiration date',
    expirationDate: {
      label: 'New Expiration Date',
      helpText: 'For example 08 02 1776',
      month: 'Month',
      day: 'Day',
      year: 'Year'
    },
    submissionInfo:
      'An email will automatically be sent to the Business Owner letting them know of the new expiration date.',
    submit: 'Extend Lifecycle ID expiration date'
  },
  rejectIntake: {
    backLink: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    actionDescription: 'Business case not approved',
    feedbackLabel: 'This email will be sent to the requester',
    submit: 'Email decision and close this request',
    submitHelp:
      'The information you add to ‘Reason’ and ‘Next Steps’ will be added to this email and then sent. Do not repeat any of that information in the field below.',
    nextStepsLabel: 'Next Steps',
    nextStepsHelpText:
      'Provide clear, actionable set of next steps that the requester needs to do. Tell them when they’d need to come back for the governance process and at what stage they’d be joining back in.',
    reasonLabel: 'Reason',
    reasonHelpText:
      'Provide the exact set of reasons why their request in its current state has been rejected. Include the concerns raised about it.'
  },
  provideGRTFeedback: {
    grtFeedbackLabel: 'GRT feedback to the business owner',
    submit: 'Email Decision & Progress to next step',
    grtFeedbackHelpText:
      'This feedback will be added to the bottom of both the Draft Business Case and Final Business Case pages.'
  },
  grbRecommendations: {
    recommendationLabel: 'GRT Recommendations to the GRB',
    recommendationHelpText:
      'These are the Governance Review Team recommendations for the Governance Review Board.'
  },
  submitAction: {
    backLink: 'Change',
    heading: 'Actions on request',
    feedbackLabel: 'This email will be sent to the requester',
    subheading: 'How to proceed?',
    submit: 'Send email',
    otherOptions: 'show other options'
  },
  uploadFile: {
    submit: 'Upload File'
  }
};

export default action;
