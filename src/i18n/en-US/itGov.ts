export default {
  itGovernance: 'IT Governance',
  button: {
    start: 'Start',
    continue: 'Continue',
    editForm: 'Edit form',
    saveAndExit: 'Save and exit',
    removeYourRequest: 'Remove your request'
  },
  taskList: {
    heading: 'Governance Task List',
    description: 'for IT Governance request',
    help: 'Help',
    stepsInvolved:
      'Steps involved in an IT Governance request (opens in a new tab)',
    sampleBusinessCase: 'Sample Business Case (opens in a new tab)',
    steps: [
      {
        title: 'Fill out the Intake Request form',
        description:
          'Tell the Governance Team about your project or idea and upload any existing documentation. This step lets CMS build up context about your project and start preparing for further discussions with your team.'
      },
      {
        title: 'Feedback from initial review',
        description:
          'The Governance Team will review your Intake Request form and decide if it needs further governance. If it does, they’ll direct you to go through some or all of the remaining steps.',
        info:
          'To help with this review, someone from the Governance Team may schedule a phone call with you and Enterprise Architecture (EA).<br/><br/> After that phone call, the Governance Team will decide if you need to go through any additional steps in the governance process.'
      },
      {
        title: 'Prepare a draft Business Case',
        description:
          'Draft a business case to communicate your business need, possible solutions and their associated costs. The Governance Team will review it with you and determine whether you are ready for a GRT or GRB meeting.'
      },
      {
        title: 'Attend the GRT meeting',
        description:
          'Meet with the Governance Review Team to discuss your draft Business Case and receive feedback. This will help you refine your Business Case further.',
        link: 'Prepare for the GRT meeting (opens in a new tab)'
      },
      {
        title: 'Submit your Business Case for final approval',
        description:
          'Update your Business Case based on any feedback from the review meeting or Governance Team and submit it to the Governance Review Board.'
      },
      {
        title: 'Attend the GRB meeting',
        description:
          'The Governance Review Board will discuss and make decisions based on your Business Case and recommendations from the Governance Review Team.',
        link: 'Prepare for the GRB meeting (opens in a new tab)'
      },
      {
        title: 'Decision and next steps',
        description:
          'If your request is approved, you will receive a unique Life Cycle ID. If it is not approved, you will receive documented next steps or concerns to address in order to proceed.'
      }
    ]
  }
};
