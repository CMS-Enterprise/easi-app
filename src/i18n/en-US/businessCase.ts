const businessCase = {
  submission: {
    confirmation: {
      heading: 'Your Business Case has been submitted',
      subheading: 'Your reference ID is {{referenceId}}',
      homeCta: 'Go back to EASi homepage',
      taskListCta: 'Go back to governance task list'
    }
  },
  generalRequest: 'General request information',
  generalRequestDescription:
    "Make a first draft of the various solutions you've thought of and the costs involved to build or buy them. Once you have a draft Business Case ready for review, send it to the Governance Review Admin Team who will ensure it is ready to be presented at the Governance Review Team (GRT) Meeting.",
  requestName: 'Contract / Request title',
  requestNameHelpText:
    'Your request title should match the title of you Acquisition Plan or Interagency Agreement',
  requester: 'Requester name',
  businessOwner: 'CMS Business Owner name',
  requesterPhoneNumber: 'Requester phone number',
  requesterPhoneNumberHelpText: 'For example 1234567890 or 123-456-7890',
  requestDescription: 'Request description',
  businessNeed: {
    label:
      'What is your business or user need? Inclue a definition of the problem or object and how it connects to CMS mission, programs, or operations.',
    include: 'Also include:',
    mandates: 'any legislative mandates or regulations that needs to be met',
    investmentBenefits:
      'any expected benefits from the investment of organizational resources into the request',
    deadlines:
      'relevant deadlines (e.g., statutory deadlines that CMS must meet)',
    solutionBenefits: 'the benefits of developing an IT solution for this need'
  },
  currentSolutionSummary:
    'What is the current process that you are using for this work, or how is this need currently being met?',
  currentSolutionSummaryHelpText:
    'Provide a brief summary of the solution currently in place including any associated software products and costs (e.g. services, software, operation and maintenance)',
  cmsBenefit:
    'How will CMS benefit from this effort? Support your response with relevant data and facts and outline your project timeline and any key milestones.',
  cmsBenefitHelpText:
    "Provide a summary of how this effort benefits CMS. Include any information on how it supports CMS' mission and strategic goals, creates efficiencies and/or cost savings, or reduces risk",
  priorityAlignment:
    'How does this effort align with HHS/CMS policies, strategies, or organizational priorities? Elaborate on the value the proposed solution will bring to the government.',
  priorityAlignmentHelpText:
    'Does this effort support any Administrator priorities or new legislative or regulatory mandates? Include any relevant deadlines.',
  successIndicators:
    'How will you determine whether or not this effort is successful?',
  successIndicatorsHelpText:
    'Include any performance indicators that you think would demonstrate improved business outcomes (i.e. because of this effort, WHO is going to do exactly WHAT, by exactly HOW MUCH, by exactly WHEN). Performance measures should capture results relevant to your overall project goals. You may consider what variable(s) will change based on this work, and how that will impact your stakeholders.',
  successIndicatorsExamples: {
    label: 'View an example performance indicator',
    description:
      'We (Project team component) will increase the number of Program-level Release Demos (from a 1/24/2022 baseline of 0 Release Demos) by 1 a year, every year, until finally achieving (and thereafter maintaining) ≥ 2 / year by 2 years after launch (2/15/2024).'
  },
  alternatives: 'Alternatives analysis',
  alternativesOptional:
    "This section is optional. You can skip it if you don't have any alternative solutions.",
  alternativesDescription: {
    text: [
      'Below you should identify options and alternatives to meet your business need. Include a summary of the approaches, how you will acquire the solution, and describe the pros, cons, total life cycle costs, and potential cost savings/avoidance for each alternative considered. Include at least three viable alternatives, starting with your preferred solution.',
      'You should not describe the proposed solutions in technical detail, but instead should describe the "alternative concepts", such as:',
      "In your alternatives, include details such as differences between system capabilities, user friendliness, technical and security considerations, ease and timing of integration with CMS' IT infrastructure, etc. Your alernatives should also address the impact to your project and/or users if your preferred solution is not selected."
    ],
    list: [
      'Buying a Commercial off the shelf (COTS) product/tool vs.',
      'Buying a Government off the shelf (GOTS) product/tool vs.',
      'Developing a Custom-built solution vs.',
      'Using/repurposing an existing CMS system vs.',
      'Using an Enterprise Shared Service'
    ]
  },
  alternativesTable: {
    type: 'Alternative type',
    title: 'Solution title',
    status: 'Status',
    actions: 'Actions',
    notSpecified: 'Not yet specified',
    solutions: [
      {
        heading: 'Preferred Solution',
        required: true,
        helpText:
          'This should reflect the intended direction of your project as you have outlined in other pages of your Business Case.',
        add: 'Add preferred solution'
      },
      {
        heading: 'Alternative A',
        required: true,
        helpText:
          'This alternative should outline a different solution that you considered or evaluated to address your core business need.',
        add: 'Add alternative A'
      },
      {
        heading: 'Alternative B',
        required: false,
        helpText: '', // TODO: find better way of not displaying text here - check against required?
        add: 'Add alternative B'
      }
    ]
  },
  preferredSolution: 'Preferred solution',
  solutionTitle: 'Solution title',
  solutionSummary: {
    label: 'Summary',
    include: 'Please include:',
    summary:
      'a brief summary of the proposed IT solution including any associated software products,',
    implementation:
      'implementation approach (e.g. development/configuration, phases),',
    costs: 'costs (e.g. services, software, Operation and Maintenance),',
    approaches: 'and potential acquisition approaches'
  },
  solutionAcquisitionApproach: 'Acquisition approach',
  solutionAcquisitionApproachHelpText:
    "Describe the approach to acquiring the products and services required to deliver the system. Responses should address the project team's contracting approach such as the contract vehicle, if it is an IDIQ, sole source vs competition, whether it is a small business set aside, and/or any other relvant information.",
  isApproved:
    'Is your solution approved by IT Security for use at CMS (FedRAMP, FISMA approved, within the CMS cloud enclave)?',
  isBeingReviewed: 'Is it in the process of CMS approval?',
  isBeingReviewedHelpText:
    'Obtaining CMS Approval can be lengthy and solutions that do not have it or are just starting may lead to longer project timelines.',
  hostingType: 'Do you need to host your solution?',
  hostingTypeCloud: 'Yes, in the cloud (AWS, Azure, etc.)',
  hostingTypeDataCenter: 'Yes, at a data center',
  noHostingNeeded: 'No, hosting is not needed',
  hostingLocation: 'Where are you planning to host?',
  cloudServiceType:
    'What, if any, type of cloud service are you planning to use for this solution (Iaas, PaaS, SaaS, etc.)?',
  dataCenterLocation: 'Which data center do you plan to host it at?',
  hasUserInterface:
    'Will your solution have a User Interface, be public facing, or involve outside customers?',
  prosAndCons: 'Pros and cons',
  prosAndConsHelpText:
    'Summarize the capabilities of the recommended technology or tools and how they will or will not meet user and stakeholder requirements.',
  notSure: "I'm not sure",
  pros: {
    label: 'Pros',
    include: 'Please include both:',
    immediateImpact:
      'the immeidate impact to your team and/or your project if this solution is selected',
    downstreamImpact:
      'the downstream impact to CMS, other systems, or other users if this solution is selected'
  },
  // TODO: NJD - I don't like this "NOT" wording, hash out with Zoe / Gov Team
  // TODO: NJD - can also probably combine pros and cons into one group?
  cons: {
    label: 'Cons',
    include: 'Please include both:',
    immediateImpact:
      'the immeidate impact to your team and/or your project if this solution is NOT selected',
    downstreamImpact:
      'the downstream impact to CMS, other systems, or other users if this solution is NOT selected'
  },
  preferredSolutionPros: 'Preferred solution: Pros',
  preferredSolutionProsHelpText:
    'Identify any aspects of this solution that positively differentiates this approach from other solutions',
  preferredSolutionCons: 'Preferred solution: Cons',
  preferredSolutionConsHelpText:
    'Identify any aspects of this solution that negatively impact this approach',
  costSavings:
    'What is the cost savings or avoidance associated with this solution? What is the cost impact if this solution is not implemented?',
  costSavingsHelpText:
    'This could include old systems going away, contract hours/ new Full Time Employees not needed, or other savings, even if indirect.',
  additionalAlternatives: 'Additional alternatives',
  additionalAlternativesHelpText:
    'If you are buillding a multi-year project that will require significant upkeep, you may want to include more alternatives. Keep in mind that Government off-the-shelf and Commercial off-the-shelf products are acceptable alternatives to include.',
  alternativeA: 'Alternative A',
  alternativeB: 'Alternative B',
  removeAlternativeB: 'Remove Alternative B',
  confirmRemoveAlternativeB: 'Are you sure you want to remove Alternative B?',
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
  sendBusinessCase: 'Send my Business Case'
};

export default businessCase;
