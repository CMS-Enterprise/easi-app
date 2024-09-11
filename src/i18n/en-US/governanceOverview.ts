const governanceOverview = {
  heading: 'Add a new system or service',
  subheading:
    'To add a new system or service, you need to go through a set of steps and get approved by the Governance Review Board (GRB).',
  processUse:
    "Use this process only if you'd like to add a new system, service or make major changes and upgrades to an existing one.",
  info: {
    intro: 'Working through this step-by-step process will help you:',
    listItems: [
      'work with Subject Matter Experts (SMEs) to refine your Business Case',
      'get a Life Cycle ID',
      'get approval for your request to then seek funding'
    ],
    timeline:
      'It can take 4 to 6 weeks to go through all the steps and get a decision.'
  },
  stepsHeading: 'Steps in the governance process',
  steps: [
    {
      heading: 'Fill the intake request form',
      content:
        'Tell the Governance Admin Team about your project or idea and upload any existing documentation.'
    },
    {
      heading: 'Feedback from initial review',
      content:
        "The Governance admin team will review your intake request form and decide if it it needs further governance. If it does, they'll direct you to go through the remaining steps."
    },
    {
      heading: 'Prepare your business case',
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
      heading: 'Submit the business case for final approval',
      content:
        'Update your Business Case based on feedback from the Governance Review Team and submit it to the Governance Review Board.'
    },
    {
      heading: 'Attend the Governance Review Board Meeting',
      content:
        'Present your Business Case to the Governance Review Board. The GRB will discuss and make a decision based on your Business Case as well as any recommendations from the Governance Review Team.',
      link: {
        text: 'Prepare for the GRB meeting (opens in new tab)',
        path: '/help/it-governance/prepare-for-grb'
      }
    },
    {
      heading: 'Decision and next steps',
      content:
        'If your Business Case is approved, you will receive a unique Life Cycle ID. If it is not approved, you will receive documented next steps or concerns to address in order to proceed.'
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
