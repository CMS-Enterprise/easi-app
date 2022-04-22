const businessCase = {
  submission: {
    confirmation: {
      heading: 'Your Business Case has been submitted',
      subheading: 'Your reference ID is {{referenceId}}',
      homeCta: 'Go back to EASi homepage',
      taskListCta: 'Go back to Governance Task List'
    }
  },
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
    calloutHeading: 'What do phases mean?',
    development: 'Development',
    developmentDef:
      'These are costs related to current development that is pre-production',
    operationsMaintenance: 'Operations and Maintenance',
    operationsMaintenanceDef:
      'These are costs related to running and upkeep post-production.',
    other: 'Other',
    additionalCategory: 'When should I add an additional cost category?',
    additionalCategoryDef:
      'Add an additional cost category if you have costs that do not fall under the Development or Operations and Maintenance categories, such as non-IT costs like education, licenses, etc. or other costs such as cloud hosting.',
    tableHeading: 'Phase per year cost breakdown',
    tableDescription:
      'If you do not anticipate costs for any given fiscal year (FY) or category, input $0.',
    fiscalYear: 'FY {{year}}',
    newCategory: 'What is your new category?',
    categories: [
      'Help desk/call center',
      'Software licenses',
      'Planning, Support, and Professional Services (Includes IT Training and Marketing Costs)',
      'Infrastructure (Includes Data Center and Application/Cloud Hosting Costs)',
      'Other OIT services, tools, pilots provided by OIT',
      'Other services, tools, pilots provided by your/other components'
    ]
  }
};

export default businessCase;
