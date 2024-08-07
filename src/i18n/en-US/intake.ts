import SystemIntakeContractStatus from 'constants/enums/SystemIntakeContractStatus';
import {
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentVersion
} from 'types/graphql-global-types';

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
  MEETING_MINUTES: 'Meeting Minutes',
  OTHER: 'Other'
};
export const abbreviatedType: Record<SystemIntakeDocumentCommonType, string> = {
  SOO_SOW: 'SOO, SOW, PWS, or other contracting document',
  DRAFT_IGCE: 'Draft IGCE',
  ACQUISITION_PLAN_OR_STRATEGY: 'AP or AS',
  REQUEST_FOR_ADDITIONAL_FUNDING: 'RAF',
  MEETING_MINUTES: 'Meeting Minutes',
  OTHER: 'Other'
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
    supportingDocuments: 'Supporting documents',
    adminDescription:
      'The requester has uploaded these documents as a part of this request. If the Governance Team needs additional documentation to process this request, contact the requester.',
    noDocumentsAlert:
      'The original requester did not upload any additional documentation to this request. If the Governance Team needs any supporting documentation in order to fully process this request, contact the requester.',
    versionLabel: 'What is the version of this document?',
    type,
    abbreviatedType,
    version
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
    fundingSource: 'Funding Number and Source',
    businessNeed: 'Business Need',
    businessSolution: 'Business Solution',
    currentStage: 'Process Status',
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
      'The EASi System Intake process can guide you through all stages of your procurement/project, connecting you with the resources, people and services that you need. Please complete and submit this CMS IT Intake form to engage with the CMS IT Governance review process. This is the first step to receive a CMS IT Life Cycle ID. Upon submission, you will receive an email promptly from the IT_Governance mailbox, and an IT Governance Team member will reach out regarding next steps.',
    heading: 'Contact details',
    requester: 'Requester',
    requesterComponent: 'Requester Component',
    businessOwner: {
      sameAsRequester: 'CMS Business Owner is same as requester',
      name: 'CMS Business Owner',
      helpText:
        'This person owns a line of business related to this request and will champion the request moving forward',
      nameField: 'CMS Business Owner name',
      component: 'CMS Business Owner component',
      email: 'CMS Business Owner email'
    },
    productManager: {
      sameAsRequester: 'CMS Product Manager is same as requester',
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
  requestDetails: {
    heading: 'Request details',
    description:
      'Provide a brief explanation of the business need/issue/problem that the contract/request will address, including your current plans for how to address the need. This page should speak to what your contract/request accomplishes and how.',
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
      give:
        'Give you and your team an enterprise-level view of the agency to avoid duplication of projects',
      help: 'Help you explore alternatives you might not have thought of',
      model: 'Model your business processes and document workflows'
    },
    hasUiChanges:
      'Does your project involve any user interface component, or changes to an interface component?'
  },
  contractDetails: {
    heading: 'Contract details',
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
    performance: 'Period of performance',
    notEntered: 'Not Entered',
    documents: 'Documents',
    nextSteps: {
      heading: 'What happens next?',
      description:
        'The Governance Review Admin Team will review and get back to you with <strong>one of these</strong> outcomes:',
      direct: 'direct you to go through the Governance Review process',
      decide: 'or decide there is no further governance needed',
      timeline: 'They will get back to you in two business days.'
    },
    sendIntakeRequest: 'Send my intake request'
  }
};

export default intake;
