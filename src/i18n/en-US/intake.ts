import {
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentVersion
} from 'gql/generated/graphql';

import SystemIntakeContractStatus from 'constants/enums/SystemIntakeContractStatus';
import SystemIntakeSoftwareAcquisitionMethods from 'constants/enums/SystemIntakeSoftwareAcquisitionMethods';

const hasContractLabels: Record<
  `hasContract_${SystemIntakeContractStatus}`,
  string
> = {
  hasContract_HAVE_CONTRACT:
    'I am planning project changes during my existing contract/InterAgency Agreement (IAA) period of performance',
  hasContract_IN_PROGRESS:
    'I am currently working on my OAGM Acquisition Plan/IAA documents',
  hasContract_NOT_STARTED: "I haven't started acquisition planning yet",
  hasContract_NOT_NEEDED: "I don't anticipate needing contractor support"
};

const version: Record<SystemIntakeDocumentVersion, string> = {
  CURRENT: 'Current',
  HISTORICAL: 'Historical'
};

const type: Record<SystemIntakeDocumentCommonType, string> = {
  SOO_SOW:
    'Statement of Objectives (SOO), Statement of Work (SOW), Performance Work Statement (PWS), or other contracting document',
  DRAFT_IGCE: 'Draft Independent Government Cost Estimate (IGCE)',
  ACQUISITION_PLAN_OR_STRATEGY:
    'Acquisition Plan (AP) or Acquisition Strategy (AS)',
  REQUEST_FOR_ADDITIONAL_FUNDING: 'Request for Additional Funding (RAF)',
  SOFTWARE_BILL_OF_MATERIALS: 'Software Bill of Materials (BOM)',
  MEETING_MINUTES: 'Meeting Minutes',
  OTHER: 'Other'
};

export const abbreviatedType: Record<SystemIntakeDocumentCommonType, string> = {
  SOO_SOW: 'SOO, SOW, PWS, or other contracting document',
  DRAFT_IGCE: 'Draft IGCE',
  ACQUISITION_PLAN_OR_STRATEGY: 'AP or AS',
  REQUEST_FOR_ADDITIONAL_FUNDING: 'RAF',
  SOFTWARE_BILL_OF_MATERIALS: 'Software BOM',
  MEETING_MINUTES: 'Meeting Minutes',
  OTHER: 'Other'
};

export const acquistionStrategyLabels: Record<
  SystemIntakeSoftwareAcquisitionMethods,
  string
> = {
  CONTRACTOR_FURNISHED: 'Furnished by the contractor',
  FED_FURNISHED: 'Provided as government furnished software',
  ELA_OR_INTERNAL: 'Acquired through an ELA or internal source',
  OTHER: 'Other',
  NOT_YET_DETERMINED: 'Not yet determined'
};

const intake = {
  navigation: {
    itGovernance: 'IT Governance',
    startRequest: 'Start an IT Governance request',
    editLinkRelation: 'Edit linked system, service, or contract',
    changeRequestType: 'Change request type'
  },
  feedback:
    'The Governance Team has requested edits to your {{type}} form. Please make any necessary changes and re-submit your form.',
  viewFeedback: 'View feedback',
  fields: {
    projectName: 'Project name',
    requester: 'Requester name',
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
    noDocuments: 'There are no documents uploaded for this request.',
    formDescription:
      'Choose a document to upload such as a draft IGCE, contracting document, RAF or other document related to this project and Intake Request.',
    dontUpload_requester: "Don't upload and return to Intake Request",
    dontUpload_admin: "Don't upload and return to request details",
    dontUpload_grbReviewForm: "Don't upload and return to GRB review setup",
    selectDocument: 'Select your document',
    supportingDocuments: 'Supporting documents',
    adminDescription:
      'The requester has uploaded these documents as a part of this request. If the Governance Team needs additional documentation to process this request, contact the requester.',
    noDocumentsAlert:
      'The original requester did not upload any additional documentation to this request. If the Governance Team needs any supporting documentation in order to fully process this request, contact the requester.',
    versionLabel: 'What is the version of this document?',
    versionHelpText_HISTORICAL:
      'Choose this option if you are uploading a document from the past that should be used for reference purposes only.',
    versionHelpText_CURRENT:
      'Choose this option if this is the most recent document version that the Governance Team should reference.',
    supportedFileTypes: 'Select a PDF, DOC, DOCX, XLS, or XLSX',
    type,
    abbreviatedType,
    version,
    table: {
      fileName: 'File name',
      docType: 'Document type',
      dateAdded: 'Date added',
      actions: 'Actions',
      downloadBtn: 'Download',
      removeBtn: 'Remove',
      removeModal: {
        heading: 'Remove {{documentName}}?',
        explanation:
          'You will not be able to access this document after it is removed, and GRB reviewers will not be able to view it.',
        confirm: 'Remove document',
        cancel: 'Cancel',
        success: 'You have successfully removed {{documentName}}.',
        error:
          'There was an issue removing your document. Please try again, and if the problem persists, try again later.'
      }
    }
  },
  submission: {
    confirmation: {
      heading: 'Your Intake Request has been submitted',
      subheading: 'Your reference ID is {{referenceId}}',
      homeCta: 'Go back to EASi homepage',
      taskListCta: 'Go back to governance task list'
    }
  },
  lifecycleId: 'Life Cycle ID',
  banner: {
    title: {
      intakeIncomplete: 'Intake Request incomplete',
      pendingResponse: 'Pending response',
      startBizCase: 'Start Business Case',
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
    requesterComponent: 'Requester component',
    businessOwnerName: 'Business Owner Name',
    businessOwnerComponent: 'Business Owner Component',
    productManagerName: 'Product Manager Name',
    productManagerComponent: 'Product Manager Component',
    isso: 'ISSO Name',
    trbCollaborator: 'TRB Collaborator Name',
    oitCollaborator: 'OIT security Collaborator Name',
    eaCollaborator: 'EA Collaborator Name',
    projectName: 'Project name',
    existingFunding: 'Existing Funding',
    fundingSource: 'Funding Number and Source',
    businessNeed: 'Business Need',
    businessSolution: 'Business Solution',
    currentStage: 'Process Status',
    usesAiTech: 'AI Tech Involved',
    eaSupport: 'EA Support Requested',
    hasUiChanges: 'Interface Component/Changes',
    isExpectingCostIncrease: 'Expecting Cost Increase',
    expectedIncreaseAmount: 'Expected Increase Amount',
    currentAnnualSpend: 'Current Annual Spend',
    currentAnnualSpendITPortion: 'Current Annual Spend IT Portion',
    plannedAnnualSpend: 'Planned Annual Spend',
    plannedAnnualSpendITPortion: 'Planned Annual Spend IT Portion',
    existingContract: 'Existing Contract',
    contractors: 'Contractor(s)',
    contractVehicle: 'Contract Vehicle',
    contractStart: 'Period of Performance Start',
    contractEnd: 'Period of Performance End',
    contractName: 'Contract Name',
    contractNumber: 'Contract number',
    cmsSystem: 'CMS System',
    status: 'Status',
    lcid: 'LCID',
    lcidScope: 'LCID Scope',
    lcidExpiresAt: 'LCID Expiration Date',
    lastAdminNote: 'Last Admin Team Note',
    updatedAt: 'Updated At',
    submittedAt: 'Submitted At',
    createdAt: 'Created At',
    decidedAt: 'Decided At',
    archivedAt: 'Archived At',
    adminLead: 'Admin Lead'
  },
  requestTypeForm: {
    heading: 'Start an IT Governance request',
    subheading: 'What is this request for?',
    start: 'Start',
    cards: {
      NEW: {
        heading: 'Add a system, service, or project',
        description:
          'Any new project such as an IT system, service, or other business need is required to submit an IT Governance request and go through the IT Governance process in order to obtain a Life Cycle ID. A Life Cycle ID is the record of approval for your planned IT initiatives from a capital investment and planning perspective, and is a necessary step for all procurement activities at CMS.',
        collapseLink: 'When should I choose this option?',
        collapseLinkList: [
          'I am starting a brand new services contract',
          'I am planning to build an entirely new IT system',
          'I am planning to develop an entirely new IT product such as an API or database',
          'I am starting another type of new project at CMS'
        ]
      },
      MAJOR_CHANGES: {
        heading: 'Major changes to a system, service, or project',
        description:
          'Many IT systems at CMS undergo significant changes throughout their life cycle. Teams should complete a new IT Governance request when considering any significant changes to their IT system, service, or other project.',
        collapseLink: 'When should I choose this option?',
        collapseLinkList: [
          'I am moving from a physical data center to the cloud',
          'I am making significant changes to my system’s platform or software products',
          'I am making significant new system integrations or connections',
          'My system, service, or project is changing its Major Function Alignment or the Data Categories it supports',
          'My system is undergoing a modernization effort',
          'I am building an entirely new UI for my system'
        ]
      },
      RECOMPETE: {
        heading: 'Re-compete with no changes or minor changes',
        description:
          'Projects and/or contracts that wish to continue operating must undergo a re-compete at regular intervals (often every 5 years). These projects must submit a new IT Governance request to obtain a new Life Cycle ID even if there are no significant changes to the scope of the contract. Re-compete requests may often take a faster and simpler route through the IT Governance process.',
        collapseLink: 'When should I choose this option?',
        collapseLinkList: [
          'I am completing a standard re-compete with no significant changes to the contract or scope of work',
          'I am completing a re-compete with minor changes that will not significantly impact the IT spending or technical architecture of my system, service, or other project.'
        ]
      }
    },
    fields: {
      addNewSystem: 'Add a system, service, or project',
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
      'Provide the names of any team members or key collaborators for this project. You must provide a name for at least the project’s Business Owner and Project/Product Manager or Lead, but may also use the additional contacts section to list and team members or subject matter experts (SMEs) critical to this project. This will help the Governance Admin Team contact the correct individuals during this IT Governance process.',
    heading: 'Contact details',
    requesterInformation: 'Requester information',
    requester: 'Requester name',
    requesterComponent: 'Requester component',
    businessOwner: {
      info: 'CMS Business Owner information',
      sameAsRequester: 'CMS Business Owner is same as requester',
      name: 'CMS Business Owner',
      helpText:
        'This person owns a line of business related to this request and will champion the request moving forward.',
      nameField: 'CMS Business Owner name',
      searchesEUADatabase: 'This field searches CMS’ EUA database.',
      component: 'CMS Business Owner component',
      email: 'CMS Business Owner email'
    },
    productManager: {
      sameAsRequester:
        'CMS Project/Product Manager or Lead is same as requester',
      name: 'CMS Project/Product Manager or Lead information',
      helpText:
        'This person may be contacted for follow ups and to understand the state of the contract.',
      nameField: 'CMS Project/Product Manager or Lead name',
      component: 'CMS Project/Product Manager or Lead component',
      email: 'CMS Project/Product Manager or Lead email'
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
      titleContacts: 'Additional team members and project points of contact',
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
  requestDetails: {
    heading: 'Request details',
    intakeFormOverview: 'Intake Request form overview',
    completed: 'Completed {{completedDate}}',
    viewFullIntake: 'View full Intake Request form',
    subsectionHeadings: {
      projectConcept: 'Project concept',
      collaboration: 'Collaboration',
      projectDetails: 'Project Details'
    },
    description:
      'Provide a brief explanation of the business need, issue, or problem that the contract/request will address, including your current plans for how to address the need. This page should speak to what your contract/request accomplishes and how.',
    contractTitle: 'Contract/Request Title',
    contractTitleHelpText:
      'Your request title should match the title of your Acquisition Plan or Interagency Agreement.',
    businessNeed:
      'What is your business need that this contract/request will meet?',
    businessNeedHelpText:
      'Include an explanation of the business need/issue/problem that the contract/request will address. This information can be pulled from your draft Acquisition Plan (Statement of Need section) and/or taken from the Statement of Work, Statement of Objectives or Performance Work Statement. Please be brief.',
    businessSolution: 'How are you thinking of solving it?',
    businessSolutionHelpText:
      'Let us know if you have a solution in mind. This information can be pulled from your draft Acquisition Plan (Capability or Performance section) and/or taken from the Statement of Work, Statement of Objectives or Performance Work Statement. Please be brief.',
    currentStage: 'Where are you in the process?',
    currentStageHelpText:
      'This helps the governance team provide the right type of guidance for your request',
    usesAiTech: 'Does your request involve AI technologies?',
    usesAiTechHelpText:
      'Select "Yes" if you are considering using AI for this request, even if you are not yest sure. This could be for new development or enhancement to an existing solution. For general AI related questions, please contact the AI team at <aiEmail>AI@cms.hhs.gov</aiEmail>. For more targeted and specific AI inquiries, please reach out to the <trbEmail>Technical Review Board (TRB)</trbEmail> for assistance.',
    softwareAcquisition: {
      usingSoftwareLabel:
        'Do you plan to use any software products to fulfill your business needs?',
      usingSoftwareHelp:
        'This could include COTS products, infrastructure products, or other engineering and development tools. <dvsmEmail>Email the Division of Vendor and Software Management (DVSM)</dvsmEmail> to learn more about options at CMS related to software and Enterprise License Agreements (ELAs). If you mark "I\'m not sure", someone from DVSM may reach out to speak with you about available software and enterprise licenses.',
      notSure: "I'm not sure",
      selectedLabel: 'Selected software',
      whichSoftwareLabel: 'Which software?',
      whichSoftwareHelp:
        'If known, please upload a bill of materials (BOM) on the document upload section of this form.',
      acquisitionStrategyLabel: 'How will the software be acquired?',
      acquisitionStrategyHelp: 'Select all that apply.',
      acquistionStrategyLabels,
      softwareRequirementsAlert:
        'If software requirements are not yet determined or if the contractor(s) will be requested to provide them as part of the requirement. CMS suggests that you include the need for a proposed software Bill of Materials (BOM) in the solicitation or contract.'
    },
    needsEaSupport: 'Does your request need Enterprise Architecture support?',
    needsEaSupportHelpText:
      'If you are unsure, mark "Yes" and someone from the EA team will assess your needs.',
    eaTeamHelp: {
      label: 'How can the Enterprise Architecture team help me?',
      description:
        "CMS' Enterprise Architecture (EA) function will help you build your Business Case by addressing the following:",
      explore:
        'Explore business solutions that might exist elsewhere within CMS',
      discuss: 'Discuss lessons learned from similar projects',
      give: 'Give you and your team an enterprise-level view of the agency to avoid duplication of projects',
      help: 'Help you explore alternatives you might not have thought of',
      model: 'Model your business processes and document workflows'
    },
    hasUiChanges:
      'Does your project involve any user interface component, or changes to an interface component?'
  },
  contractDetails: {
    heading: 'Contract details',
    description:
      'Document details about your funding, budget, and contract. These details will help assess the spending scope of your project and request.',
    fundingAndBudget: 'Funding and budget',
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
      fundingNumberLabel: 'Funding number: {{fundingNumber}}',
      fundingSourcesLabel: 'Funding sources: {{sources}}',
      formLegend: '{{action}} funding source',
      errors: {
        fundingNumberMinDigits: 'Funding number must be exactly 6 digits',
        fundingNumberDigits: 'Funding number can only contain digits',
        fundingNumberUnique: 'Funding number must be unique',
        fundingSource: 'Select a funding source'
      }
    },
    currentAnnualSpending: 'What is the current annual spending?',
    currentAnnualSpendingITPortion:
      'What portion (% or amount) of the current annual spending is IT?',
    plannedYearOneSpending:
      'What is the planned annual spending of the first year of the new contract?',
    plannedYearOneSpendingITPortion:
      'What portion (% or amount) of the planned annual spending of the first year of the new contract is IT?',
    hasContract:
      'Do you already have a contract in place to support this effort?',
    hasContractHelpText:
      'This information helps the Office of Acquisition and Grants Management (OAGM) track work',
    contractors: 'Contractor(s)',
    periodOfPerformance:
      'Period of Performance dates (include all option years)',
    newPeriodOfPerformance:
      'New Period of Performance dates (include all option years)',
    periodOfPerformanceHelpText: 'For example: 4/10/2020 - 4/9/2025',
    hasContractRadioHint:
      'Choosing this option will remove previously-entered contract number(s).',
    ...hasContractLabels
  },
  review: {
    heading: 'Check your answers before sending',
    notSubmitted: 'Not yet submitted',
    systemRequest: 'System Request',
    submissionDate: 'Submission date',
    contactDetails: 'Contact details',
    requesterComponent: 'Requester component',
    cmsBusinessOwnerName: 'CMS Business Owner',
    cmsBusinessOwnerComponent: 'CMS Business Owner component',
    cmsProjectManagerName: 'CMS Project/Product Manager or Lead',
    cmsProjectManagerComponent: 'CMS Project/Product Manager or Lead component',
    isso: 'Does your project have an Information System Security Officer (ISSO)?',
    collaborating: 'I have started collaborating with',
    requestDetails: 'Request details',
    projectName: 'Project name',
    businessNeed: 'What is your business need?',
    solving: 'How are you thinking of solving it?',
    process: 'Where are you in the process?',
    eaSupport: 'Do you need Enterprise Architecture (EA) support?',
    usesAiTech: 'Does your request involve AI technologies?',
    hasUiChanges:
      'Does your project involve any user interface component, or changes to an interface component?',
    usingSoftware:
      'Do you plan to use any software products to fulfill your business needs?',
    softwareAcquisitionMethods: 'How will the software be acquired?',
    contractDetails: 'Contract details',
    costs:
      'Do the costs for this request exceed what you are currently spending to meet your business need?',
    increase: 'Approximately how much do you expect the cost to increase?',
    currentAnnualSpending: 'What is the current annual spending?',
    currentAnnualSpendingITPortion:
      'What portion (% or amount) of the current annual spending is IT?',
    plannedYearOneSpending:
      'What is the planned annual spending of the first year of the new contract?',
    plannedYearOneSpendingITPortion:
      'What portion (% or amount) of the planned annual spending of the first year of the new contract is IT?',
    contract: 'Do you already have a contract in place to support this effort?',
    contractors: 'Contractors',
    contractVehicle: 'Contract vehicle',
    contractNumber: 'Contract number',
    noContractNumber: 'No contract number specified',
    performance: 'Period of performance dates for planned project',
    notEntered: 'Not Entered',
    documents: 'Documents',
    nextSteps: {
      heading: 'What happens next?',
      description:
        'The Governance Admin Team will review your request and get back to you within two business days. If your project is determined to contain reportable IT, your project may require a full Governance Review. The full IT Governance Review process can take up to 3 weeks assuming no issues are raised.'
    },
    sendIntakeRequest: 'Send my Intake Request'
  }
};

export default intake;
