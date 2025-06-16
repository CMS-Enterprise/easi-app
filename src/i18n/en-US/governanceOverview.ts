const governanceOverview = {
  heading: 'IT Governance request',
  changeRequestTypeCopy: 'Add a system, service, or project',
  subheading:
    'The EASi IT Governance process connects you with the resources, people and services that you need in order to request a CMS Life Cycle ID and get approval for your project or IT expenditure. The Intake Request form is the first step in the overall process and will provide the Governance Admin Team with a brief budgetary, contractual, and conceptual overview of your project. Upon submission of the Intake Request form, you will receive an automatic email from EASi, and a Governance Admin Team member will soon follow up regarding next steps. Listed below is an overview of all the steps involved in the IT Governance process.',
  info: {
    intro: 'Working through this step-by-step process will help you:',
    listItems: [
      'work with Governance Review Team (GRT) Subject Matter Experts (SMEs) to refine your Business Case',
      'justify your Business Case to the GRB',
      'complete or initiate any new requirements from the GRT and/or GRB',
      'get a Life Cycle ID (LCID) certifying compliance with HHS standards for IT investments to use on your acquisition documentation'
    ],
    timeline:
      'It may take up to 4 to 6 weeks to go through all the steps in the IT Governance process and receive a decision from the GRB.'
  },
  stepsHeading: 'Steps in the governance process',
  steps: [
    {
      heading: 'Fill the Intake Request form',
      content:
        'Tell the Governance Admin Team about your project or idea and upload any existing documentation.'
    },
    {
      heading: 'Feedback from initial review',
      content:
        "The Governance admin team will review your Intake Request form and decide if it it needs further governance. If it does, they'll direct you to go through the remaining steps."
    },
    {
      heading: 'Prepare your Business Case',
      content: 'Draft different solutions and the corresponding costs involved.'
    },
    {
      heading: 'Attend the Governance Review Team meeting',
      content:
        'Discuss your draft Business Case with the Governance Review Team (GRT). They will give you feedback and help you refine your Business Case before you present to the Governance Review Board (GRB).',
      link: {
        text: 'Prepare for the GRT meeting (opens in new tab)',
        path: '/help/it-governance/prepare-for-grt'
      }
    },
    {
      heading: 'Feedback from the Governance Review Team',
      content:
        'If the Governance Review Team has any additional comments or feedback, they may ask you to update your Business Case before submitting it to the Governance Review Board.'
    },
    {
      heading: 'Submit your final Business Case',
      content:
        'Update your Business Case based on feedback and incorporate any requirements from the review meeting or Governance Review Team for submission to the Governance Review Board.'
    },
    {
      heading: 'Attend the Governance Review Board Meeting',
      content:
        'Present your Business Case to the Governance Review Board. The GRB will discuss and make a decision based on your Business Case as well as any recommendations from the Governance Review Team.',
      link: {
        text: 'Prepare for the GRB review (opens in new tab)',
        path: '/help/it-governance/prepare-for-grb'
      }
    },
    {
      heading: 'Decision and next steps',
      content:
        'If your request is ready to move forward, you will receive a unique Life Cycle ID (LCID). If there are outstanding concerns, you will receive documented next steps to address in order to proceed.'
    }
  ],
  processExists: {
    heading: 'Why does the governance process exist?',
    subheading: 'These steps make sure',
    listItems: [
      'your request fits into current CMS IT strategy',
      'to avoid duplicate solutions that already exists at CMS',
      'you have considered various solutions',
      'CMS meets various policies and remains compliant'
    ]
  },
  getStarted: 'Get started'
};

export default governanceOverview;
