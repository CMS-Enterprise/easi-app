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
      'Center for Clinical Standards and Quality',
    CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO:
      'Center for Consumer Information and Insurance Oversight',
    CENTER_FOR_MEDICARE_CM: 'Center for Medicare',
    CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS:
      'Center for Medicaid and CHIP Services',
    CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI:
      'Center for Medicare and Medicaid Innovation',
    CENTER_FOR_PROGRAM_INTEGRITY_CPI: 'Center for Program Integrity',
    CMS_WIDE: 'CMS Wide',
    EMERGENCY_PREPAREDNESS_AND_RESPONSE_OPERATIONS_EPRO:
      'Emergency Preparedness and Response Operations',
    FEDERAL_COORDINATED_HEALTH_CARE_OFFICE:
      'Federal Coordinated Health Care Office',
    OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM:
      'Office of Acquisition and Grants Management',
    OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY:
      'Office of Healthcare Experience and Interoperability',
    OFFICE_OF_COMMUNICATIONS_OC: 'Office of Communications',
    OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA:
      'Office of Enterprise Data and Analytics',
    OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS:
      'Office of Equal Opportunity and Civil Rights',
    OFFICE_OF_FINANCIAL_MANAGEMENT_OFM: 'Office of Financial Management',
    OFFICE_OF_HUMAN_CAPITAL: 'Office of Human Capital',
    OFFICE_OF_INFORMATION_TECHNOLOGY_OIT: 'Office of Information Technology',
    OFFICE_OF_LEGISLATION: 'Office of Legislation',
    OFFICE_OF_MINORITY_HEALTH_OMH: 'Office of Minority Health',
    OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE:
      'Office of Program Operations and Local Engagement',
    OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO:
      'Office of Security, Facilities, and Logistics Operations',
    OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA:
      'Office of Strategic Operations and Regulatory Affairs',
    OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR:
      'Office of Strategy, Performance, and Results',
    OFFICE_OF_THE_ACTUARY_OACT: 'Office of the Actuary',
    OFFICE_OF_THE_ADMINISTRATOR: 'Office of the Administrator',
    OFFICES_OF_HEARINGS_AND_INQUIRIES: 'Offices of Hearings and Inquiries',
    CONSORTIUM_FOR_MEDICAID_AND_CHILDRENS_HEALTH:
      "Consortium for Medicaid and Children's Health",
    CONSORTIUM_FOR_MEDICARE_HEALTH_PLANS_OPERATIONS:
      'Consortium for Medicare Health Plans Operations',
    OFFICE_OF_BURDEN_REDUCTION_AND_HEALTH_INFORMATICS:
      'Office of Burden Reduction and Health Informatics',
    OFFICE_OF_SUPPORT_SERVICES_AND_OPERATIONS:
      'Office of Support Services and Operations',
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
    requester: 'Requester name',
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
    },
    success: {
      heading: 'Success!',
      description:
        'Your Intake Request form has been submitted. You will receive an automatic email, and a Governance Admin Team member will reach out shortly regarding next steps.',
      learnMore:
        'Want to learn more about the IT Governance process? Visit the IT Governance Sharepoint space.',
      sharepointLink: {
        copy: 'Go to the IT Governance Sharepoint space',
        href: 'https://share.cms.gov/Office/OIT/CIOCorner/SitePages/ITGovernance.aspx'
      }
    },
    error: {
      heading: 'Something went wrong.',
      description:
        'Your Intake Request was not submitted. Please either return to the previous page and try again or try again at a later date.',
      backToIntakeRequest: 'Back to Intake Request'
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
    shutdown: 'Decommission a system',
    other: 'Other'
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
    heading: 'Start an IT Governance request',
    subheading: 'What is this request for?',
    start: 'Start',
    continue: 'Continue',
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
    },
    other: {
      header: 'Additional IT Governance services',
      link: `Other (I don't see what I'm looking for)`
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
    systemIntakeContactRoles,
    systemIntakeContactComponents,
    teamMembersPointsOfContact: 'Team members and project points of contact',
    addTeamMembers:
      'Use the button and table below to add and edit any team members or key collaborators for this project.',
    addAnotherContact: 'Add another contact',
    contactsTableWarning:
      'You must add at least at least the project’s Business Owner and Project/Product Manager or Lead (available roles to fulfill this requirement are Product Owner, Product Manager, or Project Manager). If there is one individual that fills multiple roles, you may assign all roles that apply.',
    loadingContacts: 'Loading contacts',
    noContacts: 'No contacts have been added to this request.',
    additionalContacts: {
      requesterTooltip:
        'This individual is the primary requester. Primary requesters are able to edit IT governance requests in EASi.',
      primaryRequester: 'Primary requester',
      titleContacts: 'Additional contacts',
      titleRecipients: 'Choose recipients',
      recipientsSelected: '{{count}} recipients selected',
      showMore: 'Show {{count}} more recipients',
      showFewer: 'Show {{count}} fewer recipients',
      delete: 'Delete {{type}}',
      add: 'Add an additional {{type}}',
      edit: 'Edit a {{type}}',
      name_add: 'New {{type}} name',
      name: '{{type}} name',
      nameHelpText: 'This field searches CMS’ EUA database.',
      component_add: 'New {{type}} component',
      component: '{{type}} component',
      select: 'Select an option',
      role_add: 'New {{type}} role',
      role: '{{type}} role',
      roles_add: 'New {{type}} role(s)',
      roles: '{{type}} role(s)',
      submit_edit: 'Save changes',
      submit_add: 'Add {{type}}',
      errors: {
        commonName: "Enter the {{type}}'s name",
        component: "Select the {{type}}'s component",
        role: "Select the {{type}}'s role",
        root: 'There was an error {{action}}ing your {{type}}. Please try again. If the error persists, try again later.'
      },
      removeModal: {
        heading:
          'Are you sure you want to remove this team member or point of contact?',
        description:
          'This action cannot be undone, though you may add this individual again if needed.',
        submit: 'Remove contact'
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
    viewExampleAnswer: 'View an example answer',
    projectConceptHelpText:
      'If you would like to see an example of completed Request details, please contact the Governance Admin Team at <emailLink>IT_Governance@cms.hhs.gov</emailLink>.',
    contractTitle: 'Contract/Request Title',
    contractTitleHelpText:
      'Your request title should match the title of your Acquisition Plan or Interagency Agreement.',
    businessNeed:
      'What is your business need that this contract/request will meet?',
    businessNeedHelpText:
      'Include an explanation of the business need, issue, or problem that this project will address. Please be brief.',
    businessNeedExampleAnswer:
      'I work in HR/OHC, and I need: to expedite the hiring process, to onboard employees faster and reduce the paperwork burden in order, to retain desirable new hires before they apply to other jobs.',
    businessSolution: 'How are you thinking of solving it?',
    businessSolutionHelpText:
      'Let us know if you have a solution in mind. Please be brief.',
    businessSolutionExampleAnswer:
      'To automate the onboarding process and create more efficient workflows, HR would like to hire a contractor to implement a machine learning system within the CMS enterprise cloud that will analyze and score resumes to bring the best matches forward for each job opening.',
    currentStage: 'What is your project status?',
    currentStageHelpText:
      'Please choose the option that best matches the status of the work in the scope of this intake. This helps the governance team provide the right type of guidance for your request. Some options in this dropdown will have follow-up questions.',
    currentStageCollapseLinkText: 'What do the options in this dropdown mean?',
    currentStageOptions: [
      '<bold>I have an idea and want to brainstorm:</bold> You and your team are considering an entirely new project or significant changes to an existing project, but have not yet started any contracting or acquisition efforts.',
      '<bold>Contracting work has started, but a contractor has not been selected:</bold> You are in the initial stages of contractual planning for your new project or have released the contract, but you have not yet selected a contractor.',
      '<bold>Development has recently started:</bold> Your team has already begun work on the project you are submitting this request for.',
      '<bold>Development is significantly underway:</bold> Your team is already over 50% complete with the work on the project you are submitting this request for.',
      '<bold>Parts of this project are in production, with other parts still in development:</bold> Your team has completed and released some of the work for the project you are submitting this request for.',
      '<bold>This project is in O&M:</bold> Your team is continuing to support and make only minimal operational improvements to this project. Many teams submitting a re-compete request may choose this option.',
      '<bold>Other:</bold> Choose this option if none of the above project statuses make sense for your request.'
    ],
    itDev:
      'If IT development will be a part of this contract, when is the project scheduled to go live in production?',
    itDevHelp: 'If you are unsure, you may input your best guess.',
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
      'If you are unsure, mark "Yes" and someone from the EA team will assess your needs. You may also reach out to EA directly at <email>EnterpriseArchitecture@cms.hhs.gov</email>.',
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
      'Will your project have a user interface, be public facing, or involve outside customers?'
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
    currentAnnualSpendingHelpText:
      'Input the dollar amount of the current annual spending.',
    currentAnnualSpendingITPortion:
      'What percentage of the current annual spending is IT?',
    plannedYearOneSpending:
      'What is the planned annual spending for the first year of the new contract?',
    plannedYearOneSpendingHelpText:
      'Input the dollar amount of the planned annual spending.',
    plannedYearOneSpendingITPortion:
      'What percentage of the planned annual spending for the first year of the new contract is IT?',
    contractHeading: 'Contract',
    hasContract:
      'Do you already have a contract in place to support this effort?',
    contractors: 'Contractor(s)',

    performanceStartDate: 'Performance start date',
    performanceEndDate: 'Performance end date',
    newPeriodOfPerformance:
      'New Period of Performance dates (include all option years)',
    periodOfPerformanceHasContract:
      'Period of performance dates for planned project',
    periodOfPerformanceHasContractHelpText:
      'Specify the dates for the development work or contract adjustment that this Life Cycle ID (LCID) should cover. Include all option years. For example: 4/10/2020 – 4/9/2025',
    periodOfPerformanceInProgress:
      'Period of performance dates for planned contract or development work',
    periodOfPerformanceInProgressHelpText:
      'Specify the dates for the development work or contract that this Life Cycle ID (LCID) should cover. Include all option years. For example: 4/10/2020 – 4/9/2025',

    hasContractRadioHint:
      'Choosing this option will remove previously-entered contract number(s).',
    ...hasContractLabels
  },
  review: {
    heading: 'Check your answers before sending',
    edit: 'Edit this section',
    notSubmitted: 'Not yet submitted',
    systemRequest: 'System Request',
    submissionDate: 'Submission date',
    requestType: 'Request type',
    contactDetails: 'Contact details',
    requesterComponent: 'Requester component',
    cmsBusinessOwnerName: 'CMS Business Owner',
    cmsBusinessOwnerComponent: 'CMS Business Owner component',
    cmsProjectManagerName: 'CMS Project/Product Manager or Lead',
    cmsProjectManagerComponent: 'CMS Project/Product Manager or Lead component',
    collaborating: 'I have started collaborating with:',
    requestDetails: 'Request details',
    projectName: 'Contract/request title',
    businessNeed:
      'What is your business need that this contract/request will meet?',
    solving: 'How are you thinking of solving it?',
    process: 'What is your project status?',
    eaSupport: 'Does your request need Enterprise Architecture support?',
    usesAiTech: 'Does this project plan to use AI technologies?',
    hasUiChanges:
      'Does your project involve any user interface component or changes to an interface component?',
    usingSoftware:
      'Do you plan to use software products to fulfill your business needs?',
    softwareAcquisitionMethods: 'How will the software be acquired?',
    contractDetails: 'Contract details',
    costs:
      'Do the costs for this request exceed what you are currently spending to meet your business need?',
    increase: 'Approximately how much do you expect the cost to increase?',
    currentAnnualSpending: 'What is the current annual spending?',
    currentAnnualSpendingITPortion:
      'What percentage of the current annual spending is IT?',
    plannedYearOneSpending:
      'What is the planned annual spending for the first year of the new contract?',
    plannedYearOneSpendingITPortion:
      'What percentage of the planned annual spending for the first year of the new contract is IT?',
    contract: 'Do you already have a contract in place to support this effort?',
    contractors: 'Contractor(s)',
    contractVehicle: 'Contract vehicle',
    contractNumber: 'Contract number(s)',
    noContractNumber: 'No contract number specified',
    performance: 'Period of performance dates for planned project',
    notEntered: 'Not Entered',
    documents: 'Documents',
    nextSteps: {
      heading: 'What happens next?',
      description:
        'The Governance Admin Team will review your request and get back to you within two business days. If your project is determined to contain reportable IT, your project may require a full Governance Review. The full IT Governance Review process can take up to 3 weeks assuming no issues are raised.'
    },
    submitIntakeRequest: 'Submit my Intake Request',
    saveWithoutSubmitting: 'Save and exit without submitting'
  },
  viewIntakeRequest: {
    heading: 'View submitted Intake Request',
    downloadPDF: 'Download Intake Request as PDF',
    docsNotIncluded:
      'Documents will not be downloaded as a part of this PDF download.'
  }
};

export default intake;
