import {
  SystemIntakeContactComponent,
  SystemIntakeContactRole,
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentVersion
} from 'gql/generated/graphql';

import SystemIntakeContractStatus from 'constants/enums/SystemIntakeContractStatus';
import SystemIntakeSoftwareAcquisitionMethods from 'constants/enums/SystemIntakeSoftwareAcquisitionMethods';
import { Translation } from 'types/util';

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

const systemIntakeContactRoles: Translation<SystemIntakeContactRole> = {
  BUSINESS_OWNER: 'Business Owner',
  CLOUD_NAVIGATOR: 'Cloud Navigator',
  CONTRACTING_OFFICERS_REPRESENTATIVE:
    "Contracting Officer's Representative (COR)",
  CYBER_RISK_ADVISOR: 'Cyber Risk Advisor (CRA)',
  INFORMATION_SYSTEM_SECURITY_ADVISOR:
    'Information System Security Advisor (ISSO)',
  PRIVACY_ADVISOR: 'Privacy Advisor',
  PRODUCT_MANAGER: 'Product Manager',
  PRODUCT_OWNER: 'Product Owner',
  PROJECT_MANAGER: 'Project Manager',
  SUBJECT_MATTER_EXPERT: 'Subject Matter Expert (SME)',
  SYSTEM_MAINTAINER: 'System Maintainer',
  SYSTEM_OWNER: 'System Owner',
  OTHER: 'Other'
};

const systemIntakeContactComponents: Translation<SystemIntakeContactComponent> =
  {
    CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ:
      'Center for Clinical Standards and Quality (CCSQ)',
    CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO:
      'Center for Consumer Information and Insurance Oversight (CCIIO)',
    CENTER_FOR_MEDICARE_CM: 'Center for Medicare (CM)',
    CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS:
      'Center for Medicaid and Chip Services (CMCS)',
    CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI:
      'Center for Medicare and Medicaid Innovation (CMMI)',
    CENTER_FOR_PROGRAM_INTEGRITY_CPI: 'Center for Program Integrity (CPI)',
    CMS_WIDE: 'CMS Wide',
    EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO:
      'Emergency Preparedness and Response Operations (EPRO)',
    FEDERAL_COORDINATED_HEALTH_CARE_OFFICE:
      'Federal Coordinated Health Care Office (FCHCO)',
    OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM:
      'Office of Acquisition and Grants Management (OAGM)',
    OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY:
      'Office of Healthcare Experience and Interoperability (OHX)',
    OFFICE_OF_COMMUNICATIONS_OC: 'Office of Communications (OC)',
    OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA:
      'Office of Enterprise Data and Analytics (OEDA)',
    OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS:
      'Office of Equal Opportunity and Civil Rights (EOCR)',
    OFFICE_OF_FINANCIAL_MANAGEMENT_OFM: 'Office of Financial Management (OFM)',
    OFFICE_OF_HUMAN_CAPITAL: 'Office of Human Capital (OHC)',
    OFFICE_OF_INFORMATION_TECHNOLOGY_OIT:
      'Office of Information Technology (OIT)',
    OFFICE_OF_LEGISLATION: 'Office of Legislation (OL)',
    OFFICE_OF_MINORITY_HEALTH_OMH: 'Office of Minority Health (OMH)',
    OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE:
      'Office of Program Operations and Local Engagement (OPOLE)',
    OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO:
      'Office of Security Facilities and Logistics Operations (OSFLO)',
    OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA:
      'Office of Strategic Operations and Regulatory Affairs (OSORA)',
    OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR:
      'Office of Strategy Performance and Results (OSPR)',
    OFFICE_OF_THE_ACTUARY_OACT: 'Office of the Actuary (OACT)',
    OFFICE_OF_THE_ADMINISTRATOR: 'Office of the Administrator (OA)',
    OFFICES_OF_HEARINGS_AND_INQUIRIES:
      'Offices of Hearings and Inquiries (OHI)',
    CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH:
      "Consortium for Medicaid and Children's Health (CMCH)",
    CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS:
      'Consortium for Medicare Health Plans Operations (CMHPO)',
    OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS:
      'Office of Burden Reduction and Health Informatics (OBRI)',
    OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS:
      'Office of Support Services and Operations (OSSO)',
    OTHER: 'Other'
  };

const intake = {
  navigation: {
    itGovernance: 'IT Governance',
    startRequest: 'Start an IT Governance request',
    editLinkRelation: 'Edit linked systems',
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
    roles: 'Role(s)',
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
    trbCollaborator: 'TRB collaborator name',
    oitCollaborator: 'OIT security collaborator name',
    collaborator508: '508 Clearance Officer',
    eaCollaborator: 'EA collaborator name',
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
    requesterComponent: 'Requester component',
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
    systemIntakeContactRoles,
    systemIntakeContactComponents,
    addTeamMembers:
      'Use the button and table below to add and edit any team members or key collaborators for this project.',
    addAnotherContact: 'Add another contact',
    loadingContacts: 'Loading contacts',
    noContacts: 'No contacts have been added to this request.',
    additionalContacts: {
      requesterTooltip:
        'This individual is the primary requester. Primary requesters are able to edit IT governance requests in EASi.',
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
    intakeFormOverview: 'Intake Request form overview',
    completed: 'Completed {{completedDate}}',
    viewFullIntake: 'View full Intake Request form',
    subsectionHeadings: {
      projectConcept: 'Project Concept',
      collaboration: 'Collaboration',
      projectDetails: 'Project Details'
    },
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
    usesAiTech: 'Does your request involve AI technologies?',
    usesAiTechHelpText:
      'Select "Yes" if you are considering using AI for this request, even if you are not yest sure. This could be for new development or enhancement to an existing solution. For general AI related questions, please contact the AI team at <aiEmail>AI@cms.hhs.gov</aiEmail>. For more targeted and specific AI inquiries, please reach out to the <trbEmail>Technical Review Board (TRB)</trbEmail> for assistance.',
    softwareAcquisition: {
      usingSoftwareLabel:
        'Do you plan to use any software products to fulfill your business needs?',
      usingSoftwareHelp:
        'This could include COTS products, infrastructure products, or other engineering and development tools. <dvsmEmail>Email the Division of Vendor and Software Management (DVSM)</dvsmEmail> to learn more about options at CMS related to software and Enterprise License Agreements (ELAs). If you mark "I\'m not sure", someone from DVSM may reach out to speak with you about available software and enterprise licenses.',
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
    cmsBusinessOwnerName: "CMS Business Owner's name",
    cmsBusinessOwnerComponent: 'CMS Business Owner component',
    cmsProjectManagerName: 'CMS Project/Product Manager or Lead',
    cmsProjectManagerComponent: 'CMS Project/Product Manager or Lead component',
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
    sendIntakeRequest: 'Send my Intake Request'
  }
};

export default intake;
