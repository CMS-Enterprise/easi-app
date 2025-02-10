const taskList = {
  withdraw_modal: {
    header: 'Confirm you want to remove {{-requestName}}.',
    warning: 'You will lose any information you have filled in.',
    confirm: 'Remove request',
    cancel: 'Cancel',
    confirmationText_name: 'The request for {{-requestName}} has been removed',
    confirmationText_noName: 'The request has been removed',
    error_name:
      'The request for {{-requestName}} could not be removed. Please try again later.',
    error_noName: 'The request could not be removed. Please try again later.'
  },
  trbWithdrawModal: {
    header: 'Are you sure you want to remove this request?',
    warning:
      'This action cannot be undone. You will have to create a new technical assistance request if you change your mind.',
    cancel: 'Go back'
  },
  decision: {
    bizCaseApproved: 'Your Business Case has been approved.',
    bizCaseRejected: 'Your Business Case has been rejected.',
    aboutThisLcid: 'About this Life Cycle ID',
    tempLcidExplanation:
      'You have been issued a Life Cycle ID, but you still have more steps to complete before your Business Case is fully approved.',
    tempLcidNextSteps:
      'Even though you have been issued a Life Cycle ID, you have some remaining tasks before your request is complete. After reviewing the information on this page, please return to the task list to continue your request.',
    notItRequest: 'Not an IT Request',
    noGovernanceNeeded: 'No further governance needed',
    lcid: 'Project Life Cycle ID',
    lcidScope: 'Life Cycle ID Scope',
    lcidExpiration: 'This ID expires on {{date}}',
    costBaseline: 'Project Cost Baseline',
    reasons: 'Reasons',
    nextSteps: 'Next steps',
    completeNextSteps:
      'Finish these next steps to complete the governance review process.',
    decision: 'Decision:',
    alert:
      'A decision has been made for this request, you can view the decision at the bottom of this page. Please check the email sent to you for further information.',
    needHelp: 'Need help? Contact the Governance team'
  },
  navigation: {
    home: 'IT Governance',
    governanceTaskList: 'Governance task list',
    feedback: 'Feedback',
    lcidInfo: 'About this LCID',
    nextSteps: 'Decision and next steps',
    returnToTaskList: 'Return to task list',
    returnToGovernanceTaskList: 'Return to governance task list',
    returnToForm: 'Return to {{type}}'
  },
  feedback: {
    heading: 'Recommendations',
    grb: {
      heading: 'GRT recommendations to the GRB',
      help: 'These are the Governance Review Team recommendations for the Governance Review Board'
    },
    businessOwner: {
      heading: 'GRT recommendations to the Business Owner',
      help: 'These are the Governance Review Team recommendations for the Business Owner'
    },
    descriptiveDate: 'Feedback given on {{date}}',
    pdfTitle: 'Feedback for {{requestName}}'
  },
  feedbackV2: {
    heading: 'Feedback about your request',
    downloadAsPDF: 'Download feedback as PDF',
    date: 'Date',
    from: 'From',
    author: '{{name}}, Governance Team',
    governanceTeam: 'Governance Team',
    editsRequestedFor: 'Edits requested for',
    feedbackTitleEditsRequested: 'Edits requested to a form',
    feedbackTitle_GRB: 'Recommendation for the Governance Review Board (GRB)',
    feedbackTitle_REQUESTER: 'General feedback for the requester',
    targetForm: {
      INTAKE_REQUEST: 'Intake Request form',
      DRAFT_BUSINESS_CASE: 'Draft Business Case form',
      FINAL_BUSINESS_CASE: 'Final Business Case form'
    }
  },
  lcidAlert: {
    heading: 'Life Cycle ID Information',
    label: 'LCID:',
    link: 'Read about this LCID'
  },
  requestForm: {
    heading: 'Fill in the request form',
    description:
      'Tell the Governance Admin Team about your idea. This step lets CMS build context about your request and start preparing for discussions with your team.'
  },
  initialReviewFeedback: {
    heading: 'Feedback from initial review',
    description:
      'The Governance Admin Team will review your request and decide if it needs further governance. If it does, they’ll direct you to go through the remaining steps.',
    alertOne:
      'To help with that review, someone from the IT Governance team will schedule a phone call with you and Enterprise Architecture (EA).',
    alertTwo:
      'After that phone call, the governance team will decide if you need to go through a full governance process.',
    link: 'Read feedback'
  },
  businessCase: {
    heading: 'Prepare your Business Case for the GRT',
    descriptionOne:
      'Draft a Business Case to communicate the business need, the solutions and its associated costs. Meet with the Governance Review Team to discuss your draft, receive feedback and refine your Business Case.',
    descriptionTwo:
      'This step can take some time due to scheduling and availability. You may go through multiple rounds of editing your Business Case and receiving feedback.',
    status: 'Status:'
  },
  finalApproval: {
    heading: 'Submit the Business Case for final approval',
    description:
      'Update the Business Case based on feedback from the review meeting and submit it to the Governance Review Board.',
    link: 'Review and Submit'
  },
  attendGRB: {
    heading: 'Attend the GRB meeting',
    description:
      'The Governance Review Board will discuss and make decisions based on the Business Case and recommendations from the Review Team.'
  },
  decisionNextSteps: {
    heading: 'Decision and next steps',
    description:
      'If your Business Case is approved you will receive a unique Life Cycle ID. If it is not approved, you would need to address the concerns to proceed.'
  },
  cta: {
    viewSubmittedRequest: 'View submitted request form',
    continue: 'Continue',
    start: 'Start',
    viewSubmittedBusinessCase: 'View submitted request form',
    updateDraftBusinessCase: 'Update draft Business Case',
    updateSubmittedBusinessCase: 'Update submitted draft Business Case',
    prepareGRB: 'Prepare for the GRB meeting (opens in new tab)',
    prepareGRT: 'Prepare for the GRT meeting (opens in new tab)',
    readDecision: 'Read decision from board'
  },
  taskStatus: {
    AWAITING_DECISION: 'Awaiting decision',
    CANT_START: 'Cannot start yet',
    CANNOT_START_YET: 'Cannot start yet',
    COMPLETED: 'Completed',
    DONE: 'Completed',
    SUBMITTED: 'In review',
    EDITS_REQUESTED: 'Edits requested',
    IN_PROGRESS: 'In progress',
    IN_REVIEW: 'In review',
    NOT_NEEDED: 'Not needed',
    READY: 'Ready to start',
    READY_FOR_REVIEW: 'Ready for review',
    READY_TO_SCHEDULE: 'Ready to schedule',
    READY_TO_START: 'Ready to start',
    SCHEDULED: 'Scheduled'
  },
  taskStatusInfo: {
    percentComplete: '{{percent}}% complete',
    completed: 'Completed',
    lastUpdated: 'Last updated',
    submitted: 'Submitted',
    attended: 'Attended'
  }
};

export default taskList;
