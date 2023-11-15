const businessCase = {
  submission: {
    confirmation: {
      heading: 'Your Business Case has been submitted',
      subheading: 'Your reference ID is {{referenceId}}',
      homeCta: 'Go back to EASi homepage',
      taskListCta: 'Go back to Governance Task List'
    }
  },
  generalRequest: 'General request information',
  generalRequestDescription:
    "Make a first draft of the various solutions you've thought of and the costs involved to build or buy them. Once you have a draft business case ready for review, send it to the Governance Review Admin Team who will ensure it is ready to be presented at the Governance Review Team (GRT) Meeting.",
  projectName: 'Project Name',
  requester: 'Requester',
  businessOwner: 'Business Owner',
  requesterPhoneNumber: 'Requester Phone Number',
  requesterPhoneNumberHelpText: 'For example 1234567890 or 123-456-7890',
  requestDescription: 'Request description',
  alternatives: 'Alternatives analysis',
  grtFeedback: {
    header: 'Recommendations',
    grbSubhead: 'GRT recommendations to the GRB',
    dateSRHelpText: 'Feedback from the meeting on {{date}}',
    grbHelpText:
      'These are the Governance Review Team recommendations for the Governance Review Board.',
    businessOwnerSubhead: 'GRT recommendations to the Business Owner',
    businessOwnerHelpText:
      'These are the Governance Review Team recommendations for the Business Owner.'
  },
  lifecycleCost: {
    heading: 'Estimated lifecycle cost',
    intro:
      'Cost estimates should account for all costs related to both the development of your initial solution as well as operating and maintaining that solution. You can add speculative costs if exact ones are not known or if a contract is not yet in place. All costs entered in the Development and Operations and Maintenance categories should be costs related to your main contract.',
    considerations:
      'These things should be considered when estimating costs:<1><2>hosting</2><2>software subscription and licenses (Commercial off-the-shelf and Government off-the-shelf products)</2><2>contractor rates and salaries</2><2>inflation</2></1>',
    questions:
      'If you have any additional questions about estimated costs, you may reach out to the Governance Admin Team at <1>IT_Governance@cms.hhs.gov</1>.',
    calloutHeading: 'What do the cost categories mean?',
    development: 'Development',
    developmentDef:
      'These are costs related to current development that is pre-production',
    operationsMaintenance: 'Operations and Maintenance',
    operationsMaintenanceDef:
      'These are costs related to running and upkeep post-production.',
    relatedCost: 'When should I add a related cost?',
    relatedCostDef:
      'Related costs are any impacts on other services or contracts outside your immediate contract. This could include component or enterprise services, tools, pilots, etc. that are paid for separately by your component, OIT, or others to help meet your business need.',
    availableRelatedCosts: 'What related costs are available?',
    availableRelatedCostsDef: [
      'Help desk/call center',
      'Software licenses',
      'Planning, support, and professional services (includes IT training and marketing costs)',
      'Infrastructure (Includes Data Center and Application/Cloud Hosting Costs)',
      'Other OIT services, tools, pilots (provided by OIT)',
      'Other services, tools, pilots (provided by your/other components)'
    ],
    tableHeading: 'Category per year cost breakdown',
    tableDescription:
      'If you do not anticipate costs for any given fiscal year (FY) or category, input $0.',
    fiscalYear: 'FY {{year}}',
    addRelatedCost: 'Add a related cost',
    newRelatedCost: 'What is your related cost?',
    removeCategory: 'Remove category'
  },
  checkAnswers: 'Check your answers before sending',
  sendBusinessCase: 'Send my business case'
};

export default businessCase;
