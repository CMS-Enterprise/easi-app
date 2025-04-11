const governanceOverview = {
  heading: 'Add a new system or service',
  subheading:
    'To add a new system or service, you need to go through a set of steps to get reviewed by the Governance Review Board (GRB).',
  processUse:
    "Use this process only if you'd like to add a new system, service or make major changes and upgrades to an existing one.",
  info: {
    intro: 'Working through this step-by-step process will help you:',
    listItems: [
      'Work with GRT Subject Matter Experts (SMEs) to refine your Business Case',
      'Justify your Business Case to the GRB',
      'Complete or initiate any new requirements from the GRT and/or GRB',
      'Get a Life Cycle ID (LCID) certifying compliance with HHS standards for IT investments to use on your acquisition documentation'
    ],
    timeline:
      'It can take 4 to 6 weeks to go through all the steps and get a decision.'
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
