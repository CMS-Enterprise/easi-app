const intake = {
  navigation: {
    itGovernance: 'IT Governance',
    startRequest: 'Start a request',
    changeRequestType: 'Change request type'
  },
  fields: {
    projectName: 'Project name',
    requester: 'Requester',
    submissionDate: 'Submission date',
    requestFor: 'Request for',
    component: 'Component',
    grtDate: 'GRT Date',
    grbDate: 'GRB Date',
    adminLead: 'Admin Lead',
    status: 'Status',
    fundingNumber: 'Funding number',
    businessOwner: 'Business Owner',
    lcidExpirationDate: 'LCID Expiration Date',
    lastAdminNote: 'Last Admin Note',
    contractNumber: 'Contract number'
  },
  documents: {
    title: 'Additional documentation',
    tableTitle: 'Documents',
    tableDescription:
      'Upload any documents relevant to your Intake Request. This could include documents such as draft IGCEs, contracting documents such as a SOO or SOW, presentation slide decks, or other informational documents.',
    continueWithoutDocuments: 'Continue without documents',
    noDocuments: 'No documents uploaded',
    formDescription:
      'Choose a document to upload, such as a draft IGCE, contracting document, or another document related to your Intake Request.',
    returnToIntake: "Don't upload and return to Intake Request",
    selectDocument: 'Select your document',
    uploadedDocuments: 'Uploaded documents',
    type: {
      SOO_SOW: 'SOO or SOW',
      DRAFT_ICGE: 'Draft ICGE',
      OTHER: 'Other'
    }
  },
  submission: {
    confirmation: {
      heading: 'Your Intake Request has been submitted',
      subheading: 'Your reference ID is {{referenceId}}',
      homeCta: 'Go back to EASi homepage',
      taskListCta: 'Go back to Governance Task List'
    }
  },
  lifecycleId: 'Lifecycle ID',
  statusMap: {
    INTAKE_DRAFT: 'Intake draft',
    INTAKE_SUBMITTED: 'Intake request received',
    NEED_BIZ_CASE: 'Waiting for draft business case',
    BIZ_CASE_DRAFT: 'Waiting for draft business case',
    BIZ_CASE_DRAFT_SUBMITTED: 'Draft business case received',
    BIZ_CASE_CHANGES_NEEDED: 'Waiting for draft business case',
    BIZ_CASE_FINAL_NEEDED: 'Waiting for final business case',
    BIZ_CASE_FINAL_SUBMITTED: 'Final business case received',
    READY_FOR_GRT: 'Ready for GRT meeting',
    READY_FOR_GRB: 'Ready for GRB meeting',
    LCID_ISSUED: 'Lifecycle ID issued',
    WITHDRAWN: 'Withdrawn',
    NOT_IT_REQUEST: 'Closed',
    NOT_APPROVED: 'Business case not approved',
    NO_GOVERNANCE: 'Closed',
    SHUTDOWN_IN_PROGRESS: 'Decomission in progress',
    SHUTDOWN_COMPLETE: 'Decommissioned'
  },
  banner: {
    title: {
      intakeIncomplete: 'Intake request incomplete',
      pendingResponse: 'Pending response',
      startBizCase: 'Start business case',
      bizCaseIncomplete: 'Business case incomplete',
      responseRecevied: 'Response received',
      prepareGrt: 'Prepare for GRT',
      prepareGrb: 'Prepare for GRB',
      decisionReceived: 'Decision received',
      requestWithdrawn: 'Request withdrawn',
      decommissioning: 'Decommission in progress'
    },
    description: {
      intakeIncomplete:
        'Your Intake Request is incomplete, please submit it when you are ready so that we can move you to the next phase.',
      intakeSubmitted:
        'Your Intake Request has been submitted for review. The Governance Admin team will get back to you about the next step.',
      checkNextStep:
        'The Governance Admin team has gotten back to you. Please check and take the next step.',
      bizCaseIncomplete:
        'Your Business Case is incomplete, please submit it when you are ready so that we can move you to the next step.',
      bizCaseSubmitted:
        'Your Business Case has been submitted for review. The Governance Admin team will get back to you about the next step.',
      decommissioning:
        'Follow the decommission guide, complete steps relevant to your system and submit it back to IT_Governance@cms.hhs.gov to officially complete the decommissioning of your system.'
    }
  },
  requestType: {
    new: 'Add a new system or service',
    recompete: 'Re-compete',
    majorChanges: 'Major change or upgrade',
    shutdown: 'Decommission a system'
  },

  csvHeadings: {
    euaId: 'EUA ID',
    requesterName: 'Requester Name',
    requesterComponent: 'Requester Component',
    businessOwnerName: 'Business Owner Name',
    businessOwnerComponent: 'Business Owner Component',
    productManagerName: 'Product Manager Name',
    productManagerComponent: 'Product Manager Component',
    isso: 'ISSO Name',
    trbCollaborator: 'TRB Collaborator Name',
    oitCollaborator: 'OIT security Collaborator Name',
    eaCollaborator: 'EA Collaborator Name',
    projectName: 'Project Name',
    existingFunding: 'Existing Funding',
    fundingSource: 'Funding Source',
    fundingNumber: 'Funding Number',
    businessNeed: 'Business Need',
    businessSolution: 'Business Solution',
    currentStage: 'Process Status',
    eaSupport: 'EA Support Requested',
    hasUiChanges: 'Interface Component/Changes',
    isExpectingCostIncrease: 'Expecting Cost Increase',
    expectedIncreaseAmount: 'Expected Increase Amount',
    existingContract: 'Existing Contract',
    contractors: 'Contractor(s)',
    contractVehicle: 'Contract Vehicle',
    contractStart: 'Period of Performance Start',
    contractEnd: 'Period of Performance End',
    status: 'Status',
    lcidScope: 'LCID Scope',
    lastAdminNote: 'Last Admin Team Note',
    updatedAt: 'Updated At',
    submittedAt: 'Submitted At',
    createdAt: 'Created At',
    decidedAt: 'Decided At',
    archivedAt: 'Archived At',
    adminLead: 'Admin Lead'
  },
  requestTypeForm: {
    heading: 'Make a Request',
    subheading: 'What is this request for?',
    fields: {
      addNewSystem: 'Add a new system or service',
      majorChanges:
        'Major changes or upgrades to an existing system or service',
      recompete:
        'Re-compete a contract without any changes to systems or services'
    },
    helpAndGuidance: {
      majorChanges: {
        label: 'What is a major change?',
        para: 'A major change could be any of the following:',
        list: [
          'Moving a system from a physical data center to the cloud',
          'Software platform changes',
          'New system integrations/interconnections',
          'Changes in Major Function Alignments or the Data Categories a system supports'
        ]
      }
    }
  },
  contactDetails: {
    intakeProcessDescription:
      'The EASi System Intake process can guide you through all stages of your procurement/project, connecting you with the resources, people and services that you need. Please complete and submit this CMS IT Intake form to engage with the CMS IT Governance review process. This is the first step to receive a CMS IT LifeCycle ID. Upon submission, you will receive an email promptly from the IT_Governance mailbox, and an IT Governance Team member will reach out regarding next steps.',
    heading: 'Contact details',
    requester: 'Requester',
    requesterComponent: 'Requester Component',
    businessOwner: {
      name: 'CMS Business Owner',
      helpText:
        'This person owns a line of business related to this request and will champion the request moving forward',
      nameField: 'CMS Business Owner name',
      component: 'CMS Business Owner component',
      email: 'CMS Business Owner email'
    },
    productManager: {
      name: 'CMS Project/Product Manager, or lead',
      helpText:
        'This person may be contacted for follow ups and to understand the state of the contract',
      nameField: 'CMS Project/Product Manager, or lead name',
      component: 'CMS Product Manager component',
      email: 'CMS Product Manager email'
    },
    isso: {
      label:
        'Does your project have an Information System Security Officer (ISSO)?',
      helpText:
        'If yes, please tell us the name of your Information System Security Officer so we can get in touch with them',
      name: 'ISSO Name',
      component: 'ISSO Component',
      email: 'ISSO email'
    },
    additionalContacts: {
      titleContacts: 'Additional contacts',
      titleRecipients: 'Choose recipients',
      recipientsSelected: '{{count}} recipients selected',
      showMore: 'Show {{count}} more recipients',
      showFewer: 'Show {{count}} fewer recipients',
      delete: 'Delete {{type}}',
      add: 'Add another {{type}}',
      edit: 'Edit {{type}}',
      name: 'New {{type}} name',
      component: 'New {{type}} component',
      select: 'Select an option',
      role: 'New {{type}} role',
      save: 'Save',
      addContact: 'Add {{type}}',
      errors: {
        commonName: "Enter the {{type}}'s name",
        component: "Select the {{type}}'s component",
        role: "Select the {{type}}'s role"
      }
    },
    governanceTeam: {
      helpText:
        "For the checkboxes below, select all the teams you've collaborated with. Please disclose the name of the person on each team you've worked with."
    },
    collaboration: {
      label: 'For this request, I have started collaborating/consulting with:',
      helpText: `Please disclose the name of each person you've worked with. This helps us locate any additional information on your request`,
      oneOrMore: '1 or more of the following in OIT (select all that apply)',
      none: 'No one in OIT'
    }
  },
  contractDetails: {
    fundingSources: {
      label: 'Which existing funding sources will fund this project?',
      helpText:
        'If you are unsure, please get in touch with your Front Office. If this will not use an existing funding source, skip this question.',
      addFundingSource: 'Add a funding source',
      addAnotherFundingSource: 'Add another funding source',
      fundingNumber: 'Funding number',
      fundingNumberHelpText: 'Must be 6 digits long',
      fundingNumberLink:
        'You can find your funding number in the CMS Operating Plan page',
      fundingSource: 'Funding source',
      fundingSources: 'Funding sources',
      errors: {
        fundingNumberMinDigits: 'Funding number must be exactly 6 digits',
        fundingNumberDigits: 'Funding number can only contain digits',
        fundingNumberUnique: 'Funding number must be unique',
        fundingSource: 'Select a funding source'
      }
    }
  },
  review: {
    notSubmitted: 'Not yet submitted',
    systemRequest: 'System Request',
    submissionDate: 'Submission Date',
    contactDetails: 'Contact Details',
    requesterComponent: 'Requester Component',
    cmsBusinessOwnerName: "CMS Business Owner's Name",
    cmsBusinessOwnerComponent: 'CMS Business Owner Component',
    cmsProjectManagerName: 'CMS Project/Product Manager or lead',
    cmsProjectManagerComponent: 'CMS Project/Product manager or lead Component',
    isso:
      'Does your project have an Information System Security Officer (ISSO)?',
    collaborating: 'I have started collaborating with',
    requestDetails: 'Request Details',
    projectName: 'Project Name',
    businessNeed: 'What is your business need?',
    solving: 'How are you thinking of solving it?',
    process: 'Where are you in the process?',
    eaSupport: 'Do you need Enterprise Architecture (EA) support?',
    hasUiChanges:
      'Does your project involve any user interface component, or changes to an interface component?',
    contractDetails: 'Contract Details',
    costs:
      'Do the costs for this request exceed what you are currently spending to meet your business need?',
    increase: 'Approximately how much do you expect the cost to increase?',
    currentAnnualSpending: 'What is the current annual spending?',
    plannedYearOneSpending:
      'What is the planned annual spending of the first year of the new contract?',
    contract: 'Do you already have a contract in place to support this effort?',
    contractors: 'Contractors',
    contractVehicle: 'Contract vehicle',
    contractNumber: 'Contract number',
    performance: 'Period of performance',
    notEntered: 'Not Entered',
    documents: 'Documents'
  }
};

export default intake;
