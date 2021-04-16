const governanceReviewTeam = {
  prepare: {
    title: 'Prepare for Governance Review Team meeting',

    whatToExpect: {
      title: 'What to expect',
      items: [
        'Subject Matter Experts (SMEs) from various components will help you refine your business case. Their role is to ensure that the Project Team has considered potential alternatives that the Governance Review Board (GRB) may consider viable, including pros, cons, and estimated costs, as well as the technical feasibility and process requirements of implementation for each solution.',
        'At that meeting, the GRT SMEs will discuss your draft business case and provide feedback both to you and the GRB about the alternative solutions you’re considering to meet your business need.'
      ]
    },

    howToBestPrepare: {
      title: 'How to best prepare',
      subtitle:
        'Sample questions and topics that might be asked during the meeting',
      body:
        'The Governance Review Team (GRT) SMEs may ask you a series of questions after you walk them through your business case. The best way to prepare for this conversation is to review and be able to respond to such questions as they pertain to your business case.'
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
        'Do you have a clearly identified business owner?',
        'What other CMS business processes/systems/programs will you interact with?',
        'How many users would you have and who are they?',
        'Are you compliant with the Technical Reference Architecture?',
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
      items: [
        'A copy of your business case',
        'Any contracting materials that you might have in place. For example, a statement of work, a performance work statement, etc.',
        'Additional materials that you’d like to talk through like a system concept diagram, etc.'
      ]
    }
  },

  review: {
    page_title: 'CMS System Request',
    intake_not_found: 'System intake with ID: {{intakeId}} was not found',
    next_steps: 'Next steps',
    how_to_proceed: 'How to proceed?',
    approved_label: 'Issue Lifecycle ID with no further governance',
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
    heading: 'Admin team notes',
    addNote: 'Add a note',
    addNoteCta: 'Add note',
    actionName: {
      NOT_IT_REQUEST: 'Marked as not an IT governance request',
      NEED_BIZ_CASE: 'Requested a business case',
      READY_FOR_GRT: 'Marked as ready for GRT',
      READY_FOR_GRB: 'Marked as ready for GRB',
      PROVIDE_FEEDBACK_NEED_BIZ_CASE:
        'Provided GRT Feedback and progressed to business case',
      ISSUE_LCID: 'Issued Lifecycle ID with no further governance',
      BIZ_CASE_NEEDS_CHANGES:
        'Requested business case changes (not ready for GRT)',
      PROVIDE_GRT_FEEDBACK_BIZ_CASE_DRAFT:
        'Provided GRT feedback and kept business case draft',
      PROVIDE_GRT_FEEDBACK_BIZ_CASE_FINAL:
        'Provided GRT feedback and moved business case to final',
      NO_GOVERNANCE_NEEDED: 'Marked as no further governance needed',
      SUBMIT_INTAKE: 'Submitted a System Intake',
      SUBMIT_BIZ_CASE: 'Submitted a business case',
      CREATE_BIZ_CASE: 'Created a new business case',
      SUBMIT_FINAL_BIZ_CASE: 'Submitted a final draft business case',
      REJECT: 'Rejected the request',
      SEND_EMAIL: 'Email sent to requester',
      NOT_RESPONDING_CLOSE: 'Requester was not responding. Closed the request.',
      GUIDE_RECEIVED_CLOSE: 'Guide received. Closed the request.'
    },
    showEmail: 'Show Email',
    hideEmail: 'Hide Email'
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
    openIntake: 'Open intake request',
    openBusiness: 'Open business case',
    openNotes: 'Open admin team notes',
    openDecision: 'Open decision'
  },
  back: {
    allRequests: 'Back to all requests'
  },
  decision: {
    title: 'Decision',
    titleApproved: 'Decision - Approved',
    titleRejected: 'Decision - Rejected',
    titleClosed: 'Decision - Closed',
    lcid: 'Lifecycle ID',
    lcidExpiration: 'Lifecycle ID Expiration',
    scope: 'Lifecycle ID Scope',
    nextSteps: 'Next Steps',
    rejectionReason: 'Rejection Reason',
    decisionSectionTitle: 'Decision Details',
    descriptionNotItRequest: 'Request was marked "Not an IT Request"',
    descriptionNoGovernance:
      'Request was marked "No further governance needed"',
    noDecision: 'Decision not yet made',
    shutdownComplete: 'Request was marked "Shutdown Complete"'
  },
  actions: 'Actions',
  status: {
    label: 'Status',
    open: 'Open',
    closed: 'Closed'
  },
  adminLeads: {
    assignModal: {
      header: 'Choose an Admin Lead for {{requestName}}',
      save: 'Save',
      noChanges: "Don't make changes and return to request page"
    },
    changeLead: 'Change',
    notAssigned: 'Not Assigned',
    members: [
      'Matthew Schmid',
      'Valerie Hartz',
      'Jaime Cadwell',
      'Alex Smith',
      'Ann Rudolph',
      'Surya Potu'
    ]
  }
};

export default governanceReviewTeam;
