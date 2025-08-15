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
      heading: 'Fill out the Intake Request form',
      content:
        'Tell the Governance Admin Team about your project or idea and upload any existing documentation.'
    },
    {
      heading: 'Feedback from initial review',
      content:
        'The Governance Admin Team will review your Intake Request form and decide if it needs further governance. If it does, they’ll direct you to go through any additional steps of this governance process that are required, as outlined below.'
    },
    {
      heading: 'Prepare a Business Case',
      content:
        'Draft different solutions to your business need and document any corresponding costs involved for each solution.'
    },
    {
      heading: 'Attend the Governance Review Team (GRT) meeting',
      content:
        'Discuss your draft Business Case with the GRT. They may give you feedback and work with you to refine your Business Case before you share it with the GRB. If the GRT has any additional comments or feedback after the meeting, they may ask you to make additional updates to your Business Case.',
      link: {
        text: 'Prepare for the GRT meeting (opens in new tab)',
        path: '/help/it-governance/prepare-for-grt'
      }
    },
    {
      heading: 'Submit your Business Case for final approval',
      content:
        'Update your Business Case based on any feedback or requirements from the GRT and submit it to the GRB via EASi.'
    },
    {
      heading: 'Get approval from the Governance Review Board (GRB)',
      content:
        'Depending on the complexity of your request and the costs involved, the Governance Admin Team may ask that you get approval from the GRB. This may be completed asynchronously within EASi, or they may ask you to present your Business Case at a GRB meeting. The GRB will discuss and make decisions based on any or all of the following: your Intake Request, business need, Business Case, and recommendations from the GRT.',
      link: {
        text: 'Prepare for the GRB review (opens in new tab)',
        path: '/help/it-governance/prepare-for-grb'
      }
    },
    {
      heading: 'Decision and next steps',
      content:
        'If your request is approved, you will receive a unique Life Cycle ID. If it is not approved, you will receive a set of next steps or concerns to address.'
    }
  ],
  processExists: {
    heading: 'Why does the governance process exist?',
    subheading: 'These steps make sure that:',
    listItems: [
      'your request fits into current CMS IT strategy',
      'you avoid duplicating solutions that already exist at CMS',
      'you have considered a variety of solutions to meet your business need',
      'CMS continues to meet all required policies and remains compliant'
    ]
  },
  getStarted: 'Get started'
};

export default governanceOverview;
