export default {
  itGovernance: 'IT Governance',
  button: {
    start: 'Start',
    continue: 'Continue',
    editForm: 'Edit form',
    viewFeedback: 'View feedback',
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
    step: {
      intakeForm: {
        title: 'Fill out the Intake Request form',
        description:
          'Tell the Governance Team about your project or idea and upload any existing documentation. This step lets CMS build up context about your project and start preparing for further discussions with your team.',
        viewSubmittedRequestForm: 'View submitted request form',
        editsRequestedWarning:
          'The Governance Team has requested edits to your initial request form. Please make the requested changes and resubmit your form.'
      },
      feedbackFromInitialReview: {
        title: 'Feedback from initial review',
        description:
          'The Governance Team will review your Intake Request form and decide if it needs further governance. If it does, they’ll direct you to go through some or all of the remaining steps.',
        reviewInfo:
          'To help with this review, someone from the Governance Team may schedule a phone call with you and Enterprise Architecture (EA).<br/><br/> After that phone call, the Governance Team will decide if you need to go through any additional steps in the governance process.',
        noFeedbackInfo:
          'The Governance Team had no feedback for your initial Intake Request form. If you have any questions, you may contact them at <a>{{email}}</a>.'
      },
      bizCaseDraft: {
        title: 'Prepare a draft Business Case',
        description:
          'Draft a business case to communicate your business need, possible solutions and their associated costs. The Governance Team will review it with you and determine whether you are ready for a GRT or GRB meeting.',
        viewSubmittedDraftBusinessCase: 'View submitted draft Business Case',
        submittedInfo: 'Draft Business Case submitted. Waiting for feedback.',
        editsRequestedWarning:
          'The Governance Team has requested edits to your draft Business Case. Please make the requested changes and resubmit your form.'
      },
      grtMeeting: {
        title: 'Attend the GRT meeting',
        description:
          'Meet with the Governance Review Team to discuss your draft Business Case and receive feedback. This will help you refine your Business Case further.',
        link: 'Prepare for the GRT meeting (opens in a new tab)',
        button: 'Prepare for the GRT meeting',
        scheduledInfo: 'GRT meeting scheduled for {{date}}.',
        attendedInfo: 'You attended the GRT meeting on {{date}}.'
      },
      bizCaseFinal: {
        title: 'Submit your Business Case for final approval',
        description:
          'Update your Business Case based on any feedback from the review meeting or Governance Team and submit it to the Governance Review Board.',
        viewSubmittedFinalBusinessCase: 'View submitted final Business Case',
        submittedInfo: 'Final Business Case submitted. Waiting for feedback.',
        editsRequestedWarning:
          'The Governance Team has requested edits to your final Business Case. Please make the requested changes and resubmit your form.'
      },
      grbMeeting: {
        title: 'Attend the GRB meeting',
        description:
          'The Governance Review Board will discuss and make decisions based on your Business Case and recommendations from the Governance Review Team.',
        link: 'Prepare for the GRB meeting (opens in a new tab)',
        button: 'Prepare for the GRB meeting',
        scheduledInfo: 'GRB meeting scheduled for {{date}}.',
        attendedInfo: 'You attended the GRB meeting on {{date}}.'
      },
      decisionAndNextSteps: {
        title: 'Decision and next steps',
        description:
          'If your request is approved, you will receive a unique Life Cycle ID. If it is not approved, you will receive documented next steps or concerns to address in order to proceed.'
      }
    }
  }
};
