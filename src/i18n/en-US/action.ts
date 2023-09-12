const action = {
  chooseAction: {
    heading: 'Actions',
    selectAction: 'Select this action',
    accordionLabel: 'When should I use this action?',
    requestEdits: {
      title: 'Request edits to a form',
      description:
        'Unlock the Intake Request or Business Case form and give feedback about what edits are needed.',
      accordion:
        'Choose this action when you need a requester to update content in the Intake Request, draft Business Case, or final Business Case. You will be able to select which form should  be updated. '
    },
    progressToNewStep: {
      title: 'Progress to a new step',
      description:
        'Select which steps are required for this request, and move the request to another step in the Governance process.',
      accordion:
        'Choose this action when this request is ready for a draft Business Case, GRT meeting, final Business Case, or GRB meeting. You will be able to select the step to move the request to. '
    },
    decisionOPEN: {
      title_NO_DECISION: 'Issue a decision or close this request',
      title: 'Change decision or close this request',
      description_NO_DECISION:
        'Issue a Life Cycle ID, mark this project as  not approved, or close this request for another reason.',
      description_LCID_ISSUED:
        'Mark this project as not approved, or close this request for another reason.',
      description_NOT_APPROVED:
        'Issue a Life Cycle ID, or close this request for another reason.',
      description_NO_GOVERNANCE:
        'Issue a Life Cycle ID, mark this project as not approved, or close this request for another reason.',
      accordion_NO_DECISION:
        'Use this action when you are ready to issue a decision or if you would like to close this request. You will be able to select the resolution for this request.',
      accordion:
        'Use this action if you want to change the decision for this request or if you would like to close it. You will be able to select the new resolution for this request.'
    },
    decisionCLOSED: {
      title_NO_DECISION: 'Issue a decision or re-open this request',
      title: 'Change decision or re-open this request',
      description_NO_DECISION:
        'Issue a Life Cycle ID, mark this project as not approved, or re-open this closed request.',
      description_LCID_ISSUED:
        'Mark this project as not approved, or re-open this closed request.',
      description_NOT_APPROVED:
        'Issue a Life Cycle ID, or re-open this closed request.',
      description_NO_GOVERNANCE:
        'Issue a Life Cycle ID, mark this project as not approved, or re-open this closed request.',
      accordion_NO_DECISION:
        'Use this action when you are ready to issue a decision or if you would like to re-open this request. You will be able to select the resolution for this request.',
      accordion:
        'Use this action if you want to change the decision for this request or if you would like to re-open it. You will be able to select the new resolution for this request.'
    }
  },
  resolutions: {
    title: 'Action: issue decision or {{action}} request',
    title_NO_DECISION: 'Action: change decision or {{action}} request',
    breadcrumb: 'Issue decision or {{action}} request',
    breadcrumb_NO_DECISION: 'Change decision or {{action}} request',
    action_CLOSED: 're-open',
    action_OPEN: 'close',
    description_NO_DECISION:
      'Issue a Life Cycle ID, mark that this request was not approved by the Governance Review Board (GRB), mark that this request is not an IT Governance request, or {{descriptionAction}}.',
    description_LCID_ISSUED:
      'Mark that this request was not approved by the Governance Review Board (GRB), mark that this request is not an IT Governance request, or {{descriptionAction}}.',
    description_NOT_APPROVED:
      'Issue a Life Cycle ID, mark that this request is not an IT Governance request, or {{descriptionAction}}.',
    description_NO_GOVERNANCE:
      'Issue a Life Cycle ID, mark that this request was not approved by the Governance Review Board (GRB), or {{descriptionAction}}.',
    descriptionAction_CLOSED: 're-open this closed request',
    descriptionAction_OPEN: 'close this request for another reason',
    label: 'Resolution',
    requestDetails: 'Request details',
    confirmDecision: 'Confirm current decision ({{decision}})',
    summary: {
      title: 'Request resolutions',
      issueLcid: 'Issue a Life Cycle ID',
      issueLcidDescription:
        'Choose this resolution if the project has been approved by the GRB or does not need GRB approval to issue an LCID. You will be asked to provide additional LCID details in the next step of this action (scope, expiration date, next steps, and project cost baseline).',
      notItRequest: 'Not an IT Governance request',
      notItRequestDescription:
        'Choose this resolution if this request does not need to go through the IT Governance process. You will be asked to provide any additional clarification on the next step of this action.',
      notApproved: 'Not approved by GRB',
      notApprovedDescription:
        'Choose this resolution if this request was not approved by the GRB. You will be asked to provide a reason for the decision and any next steps for the project team to take on the next step of this action.',
      closeRequest: 'Close request',
      closeRequestDescription:
        'Choose this resolution if you need to close this request for any other reason. You will be asked to provide any additional clarification on the next step of this action. This action does not affect a previously-generated Life Cycle ID. The project team will continue to receive automatic notifications about their Life Cycle ID. If you wish to update a Life Cycle ID, choose the “Manage Life Cycle ID” action.',
      reOpenRequest: 'Re-open request',
      reOpenRequestDescription:
        'Choose this resolution if you need to re-open this request for any reason. You will be asked to provide any additional clarification on the next step of this action.'
    },
    confirmCurrentDecision: 'Confirm current decision ({{decision}})',
    step: '(Step {{step}} of 2)',
    selectedResolution: 'Selected resolution',
    changeResolution: 'Change resolution'
  },
  breadcrumb: 'Request {{systemIntakeId}}',
  fieldsMarkedRequired:
    'Fields marked with an asterisk (<asterisk />) are required.',
  notification: {
    heading: 'Notification email (optional)',
    alert:
      'If you choose not to send a notification email, the requester will still see the information in the above fields in their view of EASi.',
    description:
      '<p>You may choose to send a notification email to the requester when you complete this action. If you would like, you may also send a copy to the IT Governance Mailbox and/or to any additional recipients.</p><p>The fields above will be included as a part of the notification email. You may include additional information you wish to communicate to the project team in the field below.</p>',
    additionalInformation: 'Additional information'
  },
  adminNote: {
    title: 'Admin note (optional)',
    description:
      'You may add an admin note as a part of completing this action. This note will not be sent to recipients, but will be visible to Governance Team members and other EASi admin teams.',
    label: 'Note'
  },
  completeAction: 'Complete action',
  completeActionWithoutEmail: 'Complete action without email',
  cancelAction: 'Cancel action and return to request',
  requestEdits: {
    breadcrumb: 'Request edits',
    title: 'Action: request edits',
    description:
      'Use this action if there are changes that need to be made to the Intake Request or Business Case form in order to proceed with the governance process. Specify the edits or additional information needed from the requester.'
  },
  nextStep: {
    title: 'Action: next steps'
  },
  decision: {
    title: 'Action: issue decision'
  },
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
    notRespondingClose: 'Project team not responding. Close the request',
    extendLifecycleID: 'Extend Lifecycle ID'
  },
  issueLCID: {
    backLink: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    lifecycleId: 'Lifecycle ID',
    feedbackLabel: 'This email will be sent to recipients',
    nextStepsLabel: 'Next Steps',
    nextStepsHelpText:
      'Provide the requester with some recommendations on how to continue their process. For example, “begin your ATO” or “update your System Profile”. This will help the requester stay on track after they receive their Lifecycle ID.',
    scopeLabel: 'Scope of Lifecycle ID',
    scopeHelpText:
      'Tell the requester what is covered by this Lifecycle ID and what work it limits the project team to.',
    costBaselineLabel: 'Project Cost Baseline (Optional)',
    costBaselineHelpText:
      'Enter the current cost baseline for the project for the first two planned fiscal years of the project',
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
    back: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    selectedAction: 'Selected action',
    action: 'Extend Lifecycle ID',
    lifecycleId: 'Lifecycle ID',
    currentLcid: 'Current Lifecycle ID',
    currentLcidExpiration: 'Current expiration date',
    newLcid: 'New Lifecycle ID',
    expirationDate: {
      label: 'Expiration date',
      helpText: 'For example 08 02 1776',
      month: 'Month',
      day: 'Day',
      year: 'Year'
    },
    currentScope: 'Current Scope',
    currentNextSteps: 'Current Next Steps',
    currentCostBaseline: 'Current Project Cost Baseline',
    noCostBaseline: 'There is no Cost Baseline associated with this LCID',
    scopeHelpText:
      'Tell the Requester what is covered by this Lifecycle ID and what work it limits the project team to. This information will be included in your email to the Requester.',
    nextStepsHelpText:
      'Provide the Requester with some recommendations on how to continue their process. For example, “Begin your ATO” or “Update your System Profile”. This will help the requester stay on track after they receive their Lifecycle ID. This information will be included in your email to the Requester.',
    costBaselineHelpText:
      'Enter the current cost baseline for the project for the first two planned fisical years of the project. This information will be included in your email to the Requester.',
    submissionInfo:
      'The content for this email is automatically generated to notify the Requester of the new expiration date.'
  },
  rejectIntake: {
    backLink: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    actionDescription: 'Business case not approved',
    feedbackLabel: 'This email will be sent to recipients',
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
    grtFeedbackHelpText:
      'This feedback will be added to the bottom of both the Draft Business Case and Final Business Case pages.'
  },
  grbRecommendations: {
    recommendationLabel: 'GRT Recommendations to the GRB',
    recommendationHelpText:
      'These are the Governance Review Team recommendations for the Governance Review Board.'
  },
  emailRecipients: {
    email: 'Email',
    optional: '(optional)',
    emailRequired:
      'An email to the Requester is required when closing, approving, or denying the request.',
    chooseRecipients: 'Choose recipients',
    unverifiedRecipient:
      'Unverified recipient. Use the link below to find this individual in EUA.',
    unverifiedRecipientsWarning:
      'There are multiple contacts for this request that have not been associated with a name and email address in EUA. In order to send an email to these recipients, you must first verify them with EUA.',
    verifyRecipient: 'Verify recipient',
    verifyHelpText: 'Click in the field below to confirm this EUA contact',
    recipientName: 'Recipient Name'
  },
  submitAction: {
    backLink: 'Change',
    heading: 'Actions on request',
    feedbackLabel: 'This email will be sent to recipients',
    subheading: 'How to proceed?',
    continue: 'Continue',
    completeWithoutEmail: 'Complete action without sending an email',
    submit: 'Complete action and send email',
    otherOptions: 'show other options'
  },
  uploadFile: {
    submit: 'Upload File'
  }
};

export default action;
