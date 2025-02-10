const action = {
  takeAnAction: 'Take an action',
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
      description_NOT_GOVERNANCE:
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
      description_NOT_GOVERNANCE:
        'Issue a Life Cycle ID, mark this project as not approved, or re-open this closed request.',
      accordion_NO_DECISION:
        'Use this action when you are ready to issue a decision or if you would like to re-open this request. You will be able to select the resolution for this request.',
      accordion:
        'Use this action if you want to change the decision for this request or if you would like to re-open it. You will be able to select the new resolution for this request.'
    },
    manageLcid: {
      description:
        'Expire, retire, or update (change the expiration date, scope, next steps, or project cost baseline) a previously-issued LCID.',
      accordion:
        'Use this action to modify a previously-issued Life Cycle ID in any way, including manually expiring or retiring it.',
      accordion_EXPIRED:
        'Use this action to modify an expired Life Cycle ID by amending or retiring it.',
      accordion_RETIRED:
        'Use this action if you want to modify a retired Life Cycle ID in any way. You will have the option to maintain its retired status or reinstate it.'
    }
  },
  errorLabels: {
    useExistingLcid: 'Life Cycle ID',
    lcid: 'Life Cycle ID',
    expiresAt: 'Expiration date',
    retiresAt: 'Retirement date',
    scope: 'Scope of Life Cycle ID',
    nextSteps: 'Next steps',
    trbFollowUp: 'TRB follow-up',
    intakeFormStep: 'Which form needs edits?',
    emailFeedback: 'What changes are needed?',
    reason: 'Why are you expiring this Life Cycle ID?',
    reason_notApproved: 'Reason',
    newStep: 'New step',
    meetingDate: 'Meeting date'
  },
  manageLcid: {
    title: 'Manage a Life Cycle ID (LCID)',
    breadcrumb: 'Manage a Life Cycle ID',
    label: 'Action',
    description:
      'Update the status or details of a previously-issued Life Cycle ID by expiring it, retiring it, or updating it (change the expiration date, scope, next steps, or project cost baseline).',
    description_EXPIRED:
      'Update the status or details of an expired Life Cycle ID by retiring it or updating it (change the expiration date, scope, next steps, or project cost baseline).',
    description_RETIRED:
      'Update the status or details of a retired Life Cycle ID by changing the retirement date or updating the LCID (changing the expiration date, scope, next steps, or project cost baseline).',
    description_FUTURE_RETIRE_DATE:
      'Update the status or details of a Life Cycle ID that is marked for retirement by changing the retirement date or updating the LCID (changing the expiration date, scope, next steps, or project cost baseline).',
    retire: 'Retire a Life Cycle ID',
    retire_RETIRED: 'Change retirement date',
    unretire: 'Remove retirement date',
    update: 'Update a Life Cycle ID',
    expire: 'Expire a Life Cycle ID',
    retireDateWarning:
      'This Life Cycle ID is currently scheduled to retire on {{- date}}. If this is incorrect, please choose the  "Change retirement date" action below.',
    retireDateWarning_RETIRED:
      'This Life Cycle ID was retired on {{- date}}. If this is incorrect, please choose the  "Change retirement date" action below.',
    summary: {
      title: 'Available LCID actions',
      retire: 'Retire',
      retireDescription:
        'LCIDs should be retired if they are no longer in use for a planned reason, such as the issuance of a new LCID, the decommissioning of a system, or other known reason. Retired LCIDs do not need to be added to the Capital Planning Investment Control (CPIC) risk register. This project team will no longer receive automatic notifications about their Life Cycle ID.',
      retire_RETIRED: 'Change',
      unretire: 'Remove',
      unretireDescription:
        'LCIDs may be "un-retired" which will simply remove the currently set retirement date',
      update: 'Update',
      updateDescription:
        'LCIDs may be updated if there is an approved change to the details, such as an extension of the expiration date, a change to the scope, or similar.',
      expire: 'Expire',
      expireDescription:
        'LCIDs will automatically expire when they reach their expiration date. Manually expiring an LCID will update the expiration date and set the status to “Expired”. Expired LCIDs are usually unplanned or unintended, and result in the project being added to the Capital Planning Investment Control (CPIC) risk register. This project team will continue to receive automatic notifications about their Life Cycle ID.'
    }
  },
  titleBox: {
    selected: 'Selected {{type}}',
    change: 'Change {{type}}'
  },
  resolutions: {
    title: 'Action: change decision or {{action}} request',
    title_NO_DECISION: 'Action: issue decision or {{action}} request',
    breadcrumb: 'Change decision or {{action}} request',
    breadcrumb_NO_DECISION: 'Issue decision or {{action}} request',
    action_CLOSED: 're-open',
    action_OPEN: 'close',
    description_NO_DECISION:
      'Issue a Life Cycle ID, mark that this request was not approved by the Governance Review Board (GRB), mark that this request is not an IT Governance request, or {{descriptionAction}}.',
    description_LCID_ISSUED:
      'Mark that this request was not approved by the Governance Review Board (GRB), mark that this request is not an IT Governance request, or {{descriptionAction}}.',
    description_NOT_APPROVED:
      'Issue a Life Cycle ID, mark that this request is not an IT Governance request, or {{descriptionAction}}.',
    description_NOT_GOVERNANCE:
      'Issue a Life Cycle ID, mark that this request was not approved by the Governance Review Board (GRB), or {{descriptionAction}}.',
    descriptionAction_CLOSED: 're-open this closed request',
    descriptionAction_OPEN: 'close this request for another reason',
    label: 'Resolution',
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
    step: '(Step {{step}} of 2)'
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
  itGovernance: 'IT Governance Mailbox',
  itInvestment: 'IT Investment Mailbox',
  addExternalRecipientWarning:
    'The selected individual is external to the CMS organization. Please be sure they should see the information in this notification email before proceeding.',
  selectExternalRecipientWarning:
    'One or more of the selected recipients are external to the CMS organization. Please be sure they should see the information in this notification email before proceeding.',
  completeAction: 'Complete action',
  completeActionWithoutEmail: 'Complete action without email',
  cancelAction: 'Cancel action and return to request',
  error:
    'There was a problem completing your action. Please try again. If the error persists, please try again at a later date.',
  requestEdits: {
    breadcrumb: 'Request edits',
    title: 'Action: request edits',
    description:
      'Use this action if there are changes that need to be made to the Intake Request or Business Case form in order to proceed with the governance process. Specify the edits or additional information needed from the requester.',
    label: {
      intakeFormStep: 'Which form needs edits?',
      emailFeedback: 'What changes are needed?'
    },
    hint: {
      emailFeedback:
        'Provide details about the changes that are needed to this form. This information will be sent to the requester in an email notification and via their request’s task list in EASi.'
    },
    option: {
      intakeFormStep: {
        INITIAL_REQUEST_FORM: 'Intake Request form',
        DRAFT_BUSINESS_CASE: 'Draft Business Case',
        FINAL_BUSINESS_CASE: 'Final Business Case'
      }
    },
    confirm: {
      head: 'Are you sure you want to complete this action to request edits?',
      body: '<p>If you request changes to the {{formName}}, the requester will be able to make updates to any field within that form. While they are completing those changes, they will be unable to work on any other part of the process. You will receive an email notification once the requester has resubmitted their form.</p><p> If you progress this request to a new step before they have resubmitted their form, they will lose the ability to make the requested changes.</p>',
      complete: 'Complete action',
      back: 'Go back'
    },
    success: 'You have requested edits to the {{formName}}.',
    modal: {
      title: 'Are you sure you want to complete this action to request edits?',
      content:
        '<p>If you request changes to the {{formName}}, the requester will be able to make updates to any field within that form. While they are completing those changes, they will be unable to work on any other part of the process. You will receive an email notification once the requester has resubmitted their form.</p><p>If you progress this request to a new step before they have resubmitted their form, they will lose the ability to make the requested changes.</p>'
    }
  },
  actions: {
    notItRequest: 'Not an IT governance request',
    needBizCase: 'Request a draft Business Case',
    readyForGrt: 'Mark as ready for GRT',
    readyForGrb: 'Mark as ready for GRB',
    provideFeedbackNeedBizCase:
      'Provide GRT Feedback and progress to Business Case',
    issueLcid: 'Issue Life Cycle ID with no further governance',
    bizCaseNeedsChanges: 'Business case needs changes and is not ready for GRT',
    provideGrtFeedbackKeepDraft:
      'Provide GRT feedback and keep working on draft Business Case',
    provideGrtFeedbackNeedFinal:
      'Provide GRT feedback and request final Business Case for GRB',
    noGovernance: 'Close project',
    rejectIntake: 'Project not approved by GRB',
    sendEmail: 'Send email',
    guideReceivedClose: 'Decomission guide received. Close the request',
    notRespondingClose: 'Project team not responding. Close the request',
    extendLifecycleID: 'Extend Life Cycle ID'
  },
  issueLCID: {
    backLink: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    lifecycleId: 'Life Cycle ID',
    feedbackLabel: 'This email will be sent to recipients',
    nextStepsLabel: 'Next steps',
    nextStepsHelpText:
      'Provide the team with recommendations on how best to continue the process and stay on track with their project. For example “start your ATO” or “complete acquisition planning”.',
    scopeLabel: 'Scope of Life Cycle ID',
    scopeHelpText:
      'Tell the requester what is covered by this Life Cycle ID and what work it limits the project team to.',
    costBaselineLabel: 'Project cost baseline',
    costBaselineHelpText:
      'Include the cost baseline for the first two planned fiscal years of the project.',
    lcid: {
      new: 'Generate a new Life Cycle ID',
      helpText:
        'If you choose to generate a new Life Cycle ID, it will be generated when you complete this action.',
      existing: 'Use an existing Life Cycle ID',
      label: 'Life Cycle ID'
    },
    select: {
      label: 'Select the Life Cycle ID (LCID) for this request.',
      helpText:
        'Select an existing LCID from EASi. Selecting a LCID will pre-populate its information below, allowing you to edit it as needed.'
    },
    expirationDate: {
      label: 'Expiration date',
      helpText: 'For example 08 02 1776',
      month: 'Month',
      day: 'Day',
      year: 'Year'
    },
    trbFollowup: {
      label:
        'Should this team consult with the Technical Review Board (TRB) as a part of their next steps?',
      STRONGLY_RECOMMENDED: 'Yes, strongly recommend',
      RECOMMENDED_BUT_NOT_CRITICAL:
        'Yes, it’s not critical but the TRB could provide useful feedback',
      NOT_RECOMMENDED: 'No, they may if they wish but it’s not necessary'
    },
    success:
      'Life Cycle ID {{lcid}} is issued for this request. This request is now closed. You may continue to manage this Life Cycle ID using the "Manage a Life Cycle ID" action.',
    currentLcid: 'Current LCID: <span>{{lcid}}</span>',
    currentLcidHelpText:
      'You generated the Life Cycle ID (LCID) below as a part of a previous decision for this request. Its information is pre-populated its information below, allowing you to edit it as needed.',
    confirmLcidAlert:
      'After you confirm this decision, you may continue to modify this LCID using any of the “Manage a Life Cycle ID” actions.'
  },
  decisionModal: {
    title: 'Are you sure you want to complete this decision action?',
    title_nextStep:
      'Are you sure you want to complete this action to progress to a new step?',
    content:
      'You previously requested that the team make changes to their {{action}}. Completing this decision action will remove the “Edits requested” status from that form, and the requester will no longer be able to make any changes.',
    intakeRequest: 'Intake Request form',
    draftBusinessCase: 'draft Business Case',
    finalBusinessCase: 'final Business Case'
  },
  lcidStatusTag: {
    ISSUED: 'Active',
    EXPIRED: 'Expired',
    EXPIRING_SOON: 'Expiring soon',
    RETIRED: 'Retired',
    RETIRING_SOON: 'Retiring soon'
  },
  pastDateAlert:
    "You've entered a date that is in the past. Please double-check to make sure this date is accurate.",
  retireLcid: {
    retirementDate: 'Life Cycle ID retirement date',
    retirementDateHelpText:
      'If you select a future date, this project team will not continue to receive automatic updates about their Life Cycle ID, and the LCID will be marked as retired on the chosen date.',
    format: 'Format: mm/dd/yyyy',
    reason: 'Why are you retiring this Life Cycle ID? (optional)',
    reasonHelpText:
      'Provide any additional details as to why you are retiring this LCID.',
    success: 'Life Cycle ID {{lcid}} is now retired.'
  },
  unretireLcid: {
    success: 'Life Cycle ID {{lcid}} has had its retirement date removed.',
    warningAlert:
      'Completing this action will remove the set retirement date, but will not alter any previously set expiration dates or other details abou thtis Life Cycle ID (LCID). You may also choose to add an admin note as a part of this action.'
  },
  expireLcid: {
    reason: 'Why are you expiring this Life Cycle ID?',
    reasonHelpText:
      'Provide any additional details as to why you are manually marking this LCID as expired.',
    nextSteps: 'Next steps',
    nextStepsHelpText:
      'Provide the team with actionable next steps for how to un-expire their Life Cycle ID, such as amending this Life Cycle ID or requesting a new one.',
    success: 'Life Cycle ID {{lcid}} is now expired.'
  },
  updateLcid: {
    title: 'Updated Life Cycle ID',
    helpText:
      'You must fill out at least one field below. If you choose to send a notification email, the selected recipients will be notified of the changes to this LCID.',
    scopeHelpText:
      'Explain what is covered by this Life Cycle ID and what work it limits the project team to.',
    reasonLabel: 'Why are you updating this Life Cycle ID?',
    reasonHelpText: 'Include any additional context about this action.',
    success: 'Life Cycle ID {{lcid}} has been updated.',
    currentLcid: 'Current Life Cycle ID',
    issueDate: 'Issue date',
    currentExpirationDate: 'Current expiration date',
    currentScope: 'Current scope',
    currentCostBaseline: 'Current project cost baseline',
    currentNextSteps: 'Current next steps',
    emptyForm: 'Please fill out at least one field below'
  },
  extendLcid: {
    back: 'Change',
    heading: 'Actions on request',
    subheading: 'How to proceed?',
    selectedAction: 'Selected action',
    action: 'Extend Life Cycle ID',
    lifecycleId: 'Life Cycle ID',
    currentLcid: 'Current Life Cycle ID',
    currentLcidExpiration: 'Current expiration date',
    newLcid: 'New Life Cycle ID',
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
      'Tell the Requester what is covered by this Life Cycle ID and what work it limits the project team to. This information will be included in your email to the Requester.',
    nextStepsHelpText:
      'Provide the Requester with some recommendations on how to continue their process. For example, “Begin your ATO” or “Update your System Profile”. This will help the requester stay on track after they receive their Life Cycle ID. This information will be included in your email to the Requester.',
    costBaselineHelpText:
      'Enter the current cost baseline for the project for the first two planned fisical years of the project. This information will be included in your email to the Requester.',
    submissionInfo:
      'The content for this email is automatically generated to notify the Requester of the new expiration date.'
  },
  progressToNewStep: {
    success: 'Action complete. This request is now ready for a {{newStep}}.',
    title: 'Action: progress to a new step',
    description:
      'Use this action if this request is ready to move to a new step in the IT Governance process.',
    breadcrumb: 'Progress to a new step',
    newStep:
      'Which step of the IT Governance process should this request move to?',
    DRAFT_BUSINESS_CASE: 'Draft Business Case',
    draftBusinessCaseDescription:
      'Choose this step if this request requires a Business Case and a GRT meeting. This will unlock the Business Case for the requester.',
    GRT_MEETING: 'GRT meeting',
    grtMeetingDescription:
      'Choose this step if the request either does not need a Business Case, but should be reviewed by the GRT, or if the draft Business Case is complete and the request is ready for the GRT.',
    meetingDate: 'Meeting date',
    meetingDateHelpText:
      'Adding a date here will replace any {{type}} date already entered.',
    FINAL_BUSINESS_CASE: 'Final Business Case',
    finalBusinessCaseDescription:
      'Choose this step if this request is ready for a final Business Case and subsequent GRB meeting, either because the draft Business Case is complete, or because this request is skipping the GRT.',
    GRB_MEETING: 'GRB meeting',
    grbMeetingDescription:
      'Choose this step if the final Business case is complete and this team is ready to meet with the GRB.',
    feedback: 'Feedback for the requester (optional)',
    feedbackHelpText:
      'If there is any extra feedback you would like to give to the requester as they progress to the next step, input that feedback here. This includes any feedback from the GRT for the requester.',
    grbRecommendations: 'Recommendations for the GRB (optional)',
    grbRecommendationsHelpText:
      'Add any extra context or recommendations that you would like the Governance Review Board (GRB) to consider as a part of their evaluation of this project. The requester will be able to see these recommendations.',
    summaryBoxHeading: 'Steps of the IT Governance process'
  },
  notItGovRequest: {
    reason: 'Why is this not an IT Governance request? (optional)',
    reasonHelpText:
      'Describe why you arrived at this decision and what process the requester should start, if applicable.',
    success:
      'This request is marked as Not an IT Governance request. This request is now closed.'
  },
  notApproved: {
    reason: 'Reason',
    reasonHelpText:
      'Provide the reasons why this request, in its current state, was not approved. Include any concerns raised about it.',
    nextStepsHelpText:
      'Provide the requester with clear, actionable next steps for how to proceed and if or when and how they should return to the IT Governance process.',
    success:
      'This request was not approved by the GRB. This request is now closed.'
  },
  closeRequest: {
    success: 'This request is now closed.',
    reason: 'Why are you closing this request? (optional)',
    reasonHelpText:
      'Provide any additional details as to why you are closing this request.',
    modal: {
      title: 'This action will not affect the issued Life Cycle ID ({{lcid}}).',
      content:
        'Completing this action will not change the status of the issued LCID, it will only mark the request process as closed, and the project team will still receive automatic updates about their LCID. If you wish to Retire the LCID associated with this request, please go back and choose the “Manage Life Cycle ID” action.'
    }
  },
  reopenRequest: {
    success: 'This request is now open.',
    reason: 'Why are you re-opening this request? (optional)',
    reasonHelpText:
      'Provide any additional details as to why you are re-opening this request.'
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
    grtFeedbackLabel: 'GRT feedback to the Business Owner',
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
