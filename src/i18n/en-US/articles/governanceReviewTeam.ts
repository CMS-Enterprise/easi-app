import {
  SystemIntakeActionType,
  SystemIntakeStatusAdmin,
  SystemIntakeStatusRequester
} from 'gql/generated/graphql';

/** System intake action type translations */
const actionNameTranslations: Record<SystemIntakeActionType, string> = {
  BIZ_CASE_NEEDS_CHANGES: 'Requested Business Case changes (not ready for GRT)',
  CHANGE_LCID_RETIREMENT_DATE: 'Life Cycle ID retirement date updated',
  CLOSE_REQUEST: 'Closed the request',
  CONFIRM_LCID: 'Life Cycle ID confirmed',
  CREATE_BIZ_CASE: 'Created a new Business Case',
  EXPIRE_LCID: 'Life Cycle ID expired',
  EXTEND_LCID: 'Life Cycle ID extended',
  GUIDE_RECEIVED_CLOSE: 'Guide received. Closed the request.',
  ISSUE_LCID: 'Issued Life Cycle ID with no further governance',
  NEED_BIZ_CASE: 'Requested a Business Case',
  NOT_GOVERNANCE: 'Marked as not an IT governance request',
  NOT_IT_REQUEST: 'Marked as not an IT governance request',
  NOT_RESPONDING_CLOSE: 'Requester was not responding. Closed the request.',
  NO_GOVERNANCE_NEEDED: 'Marked as no further governance needed',
  PROGRESS_TO_NEW_STEP: 'Progressed to a new step',
  PROVIDE_FEEDBACK_NEED_BIZ_CASE:
    'Provided GRT Feedback and progressed to Business Case',
  PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT:
    'Provided GRT feedback and kept Business Case draft',
  PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL:
    'Provided GRT feedback and moved Business Case to final',
  READY_FOR_GRB: 'Marked as ready for GRB',
  READY_FOR_GRT: 'Marked as ready for GRT',
  REJECT: 'Rejected the request',
  REOPEN_REQUEST: 'Reopened the request',
  REQUEST_EDITS: 'Requested edits to a form',
  RETIRE_LCID: 'Life Cycle ID retired',
  SEND_EMAIL: 'Email sent to requester',
  SUBMIT_BIZ_CASE: 'Submitted a Business Case',
  SUBMIT_FINAL_BIZ_CASE: 'Submitted a final draft Business Case',
  SUBMIT_INTAKE: 'Submitted a System Intake',
  UNRETIRE_LCID: 'Life Cycle ID retirement date removed',
  UPDATE_LCID: 'Life Cycle ID updated'
};

const systemIntakeStatusAdmin: Record<SystemIntakeStatusAdmin, string> = {
  CLOSED: 'Closed',
  DRAFT_BUSINESS_CASE_IN_PROGRESS: 'Draft Business Case in progress',
  DRAFT_BUSINESS_CASE_SUBMITTED: 'Draft Business Case submitted',
  FINAL_BUSINESS_CASE_IN_PROGRESS: 'Final Business Case in progress',
  FINAL_BUSINESS_CASE_SUBMITTED: 'Final Business Case submitted',
  GRB_MEETING_COMPLETE: 'GRB review complete',
  GRB_MEETING_READY: 'Ready for GRB review',
  GRB_REVIEW_IN_PROGRESS: 'GRB review in progress',
  GRT_MEETING_COMPLETE: 'GRT meeting complete',
  GRT_MEETING_READY: 'Ready for GRT meeting',
  INITIAL_REQUEST_FORM_IN_PROGRESS: 'Intake Request in progress',
  INITIAL_REQUEST_FORM_SUBMITTED: 'Intake Request submitted',
  LCID_ISSUED: 'LCID issued: {{lcid}}',
  LCID_EXPIRED: 'Expired LCID: {{lcid}}',
  LCID_RETIRED: 'Retired LCID: {{lcid}}',
  LCID_RETIRING_SOON: 'LCID retiring soon: {{lcid}}',
  NOT_APPROVED: 'Project not approved by the GRB',
  NOT_GOVERNANCE: 'Not an IT Governance request'
};

const systemIntakeStatusRequester: Record<SystemIntakeStatusRequester, string> =
  {
    CLOSED: 'Closed',
    DRAFT_BUSINESS_CASE_EDITS_REQUESTED: 'Edits requested',
    DRAFT_BUSINESS_CASE_IN_PROGRESS: 'Draft Business Case in progress',
    DRAFT_BUSINESS_CASE_SUBMITTED: 'Draft Business Case submitted',
    FINAL_BUSINESS_CASE_EDITS_REQUESTED: 'Edits requested',
    FINAL_BUSINESS_CASE_IN_PROGRESS: 'Final Business Case in progress',
    FINAL_BUSINESS_CASE_SUBMITTED: 'Final Business Case submitted',
    GRB_MEETING_AWAITING_DECISION: 'Awaiting GRB decision',
    GRB_MEETING_READY: 'Ready for GRB review',
    GRB_REVIEW_IN_PROGRESS: 'GRB review in progress',
    GRT_MEETING_AWAITING_DECISION: 'Awaiting GRT decision',
    GRT_MEETING_READY: 'Ready for GRT meeting',
    INITIAL_REQUEST_FORM_EDITS_REQUESTED: 'Edits requested',
    INITIAL_REQUEST_FORM_IN_PROGRESS: 'Intake Request in progress',
    INITIAL_REQUEST_FORM_NEW: 'New',
    INITIAL_REQUEST_FORM_SUBMITTED: 'Intake Request submitted',
    LCID_ISSUED: 'LCID issued: {{lcid}}',
    LCID_EXPIRED: 'Expired LCID: {{lcid}}',
    LCID_RETIRED: 'Retired LCID: {{lcid}}',
    NOT_APPROVED: 'Project not approved by the GRB',
    NOT_GOVERNANCE: 'Not an IT Governance request'
  };

const governanceReviewTeam = {
  title: 'Prepare for the Governance Review Team meeting',
  description:
    'Learn what you need in order to be successful, including what to expect during and after the meeting, what to prepare for, and what to bring to the meeting.',
  prepare: {
    title: 'Prepare for Governance Review Team meeting',
    breadcrumb: 'Prepare for GRT meeting',

    whatToExpect: {
      title: 'What to expect',
      items: [
        'Subject Matter Experts (SMEs) from various components will help you refine your Business Case. Their role is to ensure that you and your project team have considered and documented information about any potential alternatives that the Governance Review Board (GRB) may consider viable, including pros, cons, and estimated costs, as well as the technical feasibility and implementation process requirements for each solution.',
        'At the meeting, the Governance Review Team (GRT) SMEs will discuss your draft Business Case and provide feedback both to you and the GRB about the alternative solutions you’re considering to meet your business need.'
      ]
    },

    howToBestPrepare: {
      title: 'Possible questions',
      body: 'The GRT SMEs may ask you a series of questions after you walk them through your Business Case. The best way to prepare for this conversation is to review and be able to respond to example questions as they pertain to your Business Case. Example questions are included in the sections below.'
    },

    capitalPlanning: {
      title: 'Capital Planning and Investment Control (CPIC)',
      items: [
        'Have you conducted a cost/benefit analysis that includes all elements required by OMB?',
        'How long will the current technology likely last before you need to replace it with something else to perform the same function?',
        'Have you established performance measures regarding the desired business outcome of your project',
        'Is your project aligned to any Agency Strategic Objectives or Agency Priority Goals?',
        'Is your project reflected under the appropriate Investment(s) in the CMS Portfolio Management Tool (PMT)?',
        'Is your project aligned and reflected under an Acquisition Strategy?'
      ]
    },

    enterpriseArchitecture: {
      title: 'Enterprise Architecture and Data',
      items: [
        'Have you checked to see if the project capabilities already exist within CMS and if so, is the current system owner willing to support your needs?',
        'Do you have a clearly identified Business Owner?',
        'What other CMS business processes/systems/programs will you interact with?',
        'How many users would you have and who are they?',
        'Do you align with Technical Reference Architecture guidelines?',
        'Does your Project/System need access to any CMS Enterprise Data in order to meet program objectives? PHI, PII, etc.'
      ]
    },

    sharedServices: {
      title: 'Shared Services and Data Hosting',
      items: [
        'Have you explored leveraging one or more of CMS’ shared services as part of your IT solution?',
        'Where are you hosting or planning to host your systems?',
        'What, if any, type of cloud service are you planning to use? IaaS, PaaS, SaaS, etc?'
      ]
    },

    itSecurityPrivacy: {
      title: 'IT Security/Privacy',
      items: [
        'Who is your ISSO and CRA? Have you been in contact with them?',
        'What safeguard(s) will this solution entail (ie. FedRAMP, FISMA certification)?',
        'Is there an existing or new FISMA system ATO that will authorize this project?'
      ]
    },

    whatToBring: {
      title: 'What to bring',
      subtitle:
        'The following are important items to have with you at the GRT meeting:',
      items: [
        'a copy of your Business Case',
        'any contracting materials that you might have in place, for example, a Statement of Work (SOW), a Performance Work Statement (PWS), or other contracting document',
        'additional materials that you’d like to talk through, such as a concept diagram'
      ]
    }
  },

  review: {
    page_title: 'CMS System Request',
    intake_not_found: 'System intake with ID: {{intakeId}} was not found',
    next_steps: 'Next steps',
    how_to_proceed: 'How to proceed?',
    approved_label: 'Issue Life Cycle ID with no further governance',
    accepted_label: 'Governance review process needed',
    closed_label: 'Governance not needed (close this request)',
    radio_help:
      "If there isn't enough info on this request, please get in touch with the requester over email",
    email_field_label: 'This email will be sent to the requester',
    submit_button: 'Email Decision and Progress to next step',
    alert_body: 'An email has been sent to {{address}}',
    alert_header: 'Email sent',
    email_time_notification: 'An email was sent to the requester on {{date}}'
  },
  requestRepository: {
    id: 'request-repository',
    title: 'Request Repository',
    header: 'Requests',
    requestCount_open: 'There is {{count}} open request',
    requestCount_open_plural: 'There are {{count}} open requests',
    requestCount_closed: 'There is {{count}} closed request',
    requestCount_closed_plural: 'There are {{count}} closed requests',
    table: {
      requestType: 'Type of request',
      submissionDate: {
        null: 'Not yet submitted'
      },
      addDate: 'Add date'
    },
    aria: {
      openTableCaption:
        'Table of open requests currently managed by the admin team',
      closedTableCaption: 'Table of closed requests'
    }
  },
  notes: {
    edit: 'Edit this note',
    editModal: {
      header: 'Edit note',
      description:
        'Editing your admin note will replace the current note. If you have new information to add, please consider adding a new note. Also, editing this note will not update the original timestamp. Please add a new note if you wish to update the timestamp.',
      contentLabel: 'Note content',
      saveEdits: 'Save edits',
      cancel: 'Cancel',
      error:
        'There was a problem saving your edits. Please try again. If the error persists, please try again at a later date.'
    },
    remove: 'Remove this note',
    removeModal: {
      header: 'Are you sure you want to remove this admin note?',
      description: 'This action cannot be undone',
      removeNote: 'Remove note',
      cancel: 'Cancel',
      error:
        'There was a problem removing your note. Please try again. If the error persists, please try again at a later date.'
    },
    heading: 'Admin team notes',
    addNote: 'Add a note',
    addNoteCta: 'Add note',
    actionName: actionNameTranslations,
    showEmail: 'Show Email',
    hideEmail: 'Hide Email',
    extendLcid: {
      newExpirationDate: 'New expiration date',
      oldExpirationDate: 'Old expiration date',
      newScope: 'New Scope',
      oldScope: 'Old Scope',
      newNextSteps: 'New Next Steps',
      oldNextSteps: 'Old Next Steps',
      newCostBaseline: 'New Cost Baseline',
      oldCostBaseline: 'Old Cost Baseline',
      noScope: 'No scope specified',
      noNextSteps: 'No next steps specified',
      noCostBaseline: 'No cost baseline specified'
    }
  },
  dates: {
    heading: 'Dates',
    subheading: 'Add GRT and GRB dates',
    submit: 'Save',
    grtDate: {
      label: 'GRT Date'
    },
    grbDate: {
      label: 'GRB Date'
    }
  },
  aria: {
    openIntake: 'Open Intake Request',
    openDocuments: 'Open documents',
    openBusiness: 'Open Business Case',
    openNotes: 'Open admin team notes',
    openDecision: 'Open decision',
    openAdditionalInformation: 'Open additional information',
    openLcid: 'Open LCID',
    openFeedback: 'Open feedback'
  },
  back: {
    allRequests: 'Back to all requests'
  },
  lifecycleID: {
    title: 'Life Cycle ID',
    noLCID: 'No Life Cycle ID has been issued',
    expiration: 'Life Cycle ID Expiration',
    scope: 'Life Cycle ID Scope',
    nextSteps: 'Next Steps',
    costBaseline: 'Project Cost Baseline'
  },
  decision: {
    title: 'Decision',
    title_LCID_ISSUED: 'Decision - Approved',
    title_NOT_APPROVED: 'Decision - Rejected',
    title_NOT_GOVERNANCE: 'Decision - Closed',
    description: 'Decision not yet made',
    description_LCID_ISSUED:
      'LCID issued, see Life Cycle ID tab for more detailed information',
    description_NOT_GOVERNANCE: 'This is not an IT Governance request.',
    nextSteps: 'Next Steps',
    rejectionReason: 'Rejection Reason',
    noRejectionReasons: 'No reasons specified',
    decisionSectionTitle: 'Decision Details'
  },
  additionalInformation: {
    title: 'Additional information'
  },
  feedback: {
    title: 'Feedback',
    description:
      'A history of feedback and recommendations sent to the requester as a part of admin actions.',
    noFeedback: 'No feedback has been added for this request.',
    feedbackMoved:
      'Feedback and recommendations have moved! Use the Feedback tab in the navigation to the left to view feedback and recommendations that have been sent to the requester and project team.'
  },
  governanceRequestDetails: 'Governance request details',
  itGovernanceRequestDetails: 'IT Governance request details',
  systemServiceContractName: 'System, service, or contract name',
  noneSpecified: 'None specified',
  actions: 'Actions',
  submittedOn: 'Submitted on {{date}}',
  requestType: 'Request type',
  systemNamePlural: '{{name}}, +{{count}} more',
  status: {
    label: 'Status',
    open: 'Open',
    closed: 'Closed'
  },
  systemIntakeStatusAdmin,
  lcidAlertMessage:
    'The LCID for this request ({{-lcid}}) is set to retire on {{-date}}. If this is in error, or if you wish to change the retirement date, please take the action to manage this Life Cycle ID.',
  systemIntakeStatusRequester,
  adminLeads: {
    assignModal: {
      header: 'Choose an Admin Lead for {{-requestName}}',
      save: 'Save',
      noChanges: "Don't make changes and return to request page"
    },
    changeLead: 'Change',
    assignLead: 'Assign',
    notAssigned: 'Not Assigned',
    members: [
      'Alex Smith',
      'Ashley Marks',
      'Dominese Withers',
      'Emily Hill',
      'Jaime Cadwell',
      'Kayla Jones',
      'Leah Nguyen',
      'Leilani Fields',
      'Nicholas Downey',
      'Savannah Huttenberger',
      'Tara Ross',
      'Valerie Hartz'
    ]
  }
};

export default governanceReviewTeam;
