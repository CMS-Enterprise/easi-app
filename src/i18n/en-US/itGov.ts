export default {
  itGovernance: 'IT Governance',
  button: {
    start: 'Start',
    continue: 'Continue',
    editForm: 'Edit form',
    viewFeedback: 'View feedback',
    viewRequestedEdits: 'View requested edits',
    saveAndExit: 'Save and exit',
    removeYourRequest: 'Remove your request'
  },
  taskList: {
    heading: 'Governance task list',
    description: 'for {{requestName}}',
    help: 'Help',
    stepsInvolved:
      'Steps involved in an IT Governance request (opens in a new tab)',
    sampleBusinessCase: 'Sample Business Case (opens in a new tab)',
    decisionAlert: {
      heading: 'Decision issued',
      text: 'A decision has been made for this request, and you can view the decision at the <decisionLink>bottom of this page</decisionLink>. For additional information, please check the email sent to you. If you have further questions, contact the Governance Team at <emailLink>{{email}}</emailLink>.'
    },
    closedAlert: {
      heading: 'Request closed',
      text: 'The Governance Team has closed this request without issuing a decision. If you have questions, you may contact them at <emailLink>{{email}}</emailLink>.'
    },
    generalFeedback: {
      heading: 'The Governance team has offered feedback about your request.',
      text: 'Please review the feedback using the button below. It may have important information about your project and your IT Governance request.'
    },
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
          'The Governance Team has not requested edits to your Intake Request form. If you have any questions, you may contact them at <a>{{email}}</a>.'
      },
      bizCaseDraft: {
        title: 'Prepare a draft Business Case',
        description:
          'Draft a business case to communicate your business need, possible solutions and their associated costs. The Governance Team will review it with you and determine whether you are ready for a GRT or GRB meeting.',
        viewSubmittedDraftBusinessCase: 'View submitted draft Business Case',
        submittedInfo: 'Draft Business Case submitted. Waiting for feedback.',
        editsRequestedWarning:
          'The Governance Team has requested edits to your draft Business Case. Please make the requested changes and resubmit your form.',
        noFeedbackInfo:
          'The Governance Team has not requested edits to your draft Business Case. If you have any questions, you may contact them at <a>{{email}}</a>.'
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
          'The Governance Team has requested edits to your final Business Case. Please make the requested changes and resubmit your form.',
        noFeedbackInfo:
          'The Governance Team has not requested edits to your final Business Case. If you have any questions, you may contact them at <a>{{email}}</a>.'
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
          'If your request is approved, you will receive a unique Life Cycle ID. If it is not approved, you will receive documented next steps or concerns to address in order to proceed.',
        button: 'Read the decision',
        viewPreviousDecision: 'View previous decision'
      }
    }
  },
  additionalRequestInfo: {
    header: 'Additional request information',
    taskListBreadCrumb: 'Task list',
    itGovBreadcrumb: 'IT Governance request details',
    trbBreadcrumb: 'TRB request details',
    existingSystem:
      'You have identified this request as part of an existing system.',
    existingService:
      'You have identified this request as part of an existing service or other contract.',
    newSystem:
      'You have identified this request as for a completely new system, service, or contract.',
    edit: 'Edit information',
    viewSystemProfile: 'View system profile',
    contractName: 'Service or contract name',
    contractNumber: 'Contract number',
    noContractNumber: 'No contract number listed',
    actionRequiredAlert: {
      header: 'Action required',
      text: 'Is this request part of an existing system, service, or other contract?',
      answer: 'Answer'
    },
    show: {
      more: 'Show {{count}} more',
      less: 'Show {{count}} less'
    }
  },
  link: {
    header: 'Is this request part of an existing system, service, or contract?',
    description:
      'If you are requesting a Life Cycle ID (LCID) and governance approval for a new IT investment that is a part of an existing system, service, or contract (such as a major change based on a new business need or the creation of a new sub-system) please include additional details below.',
    form: {
      field: {
        systemOrService: {
          label:
            'Is this IT Governance request part of an existing system, service, or contract?',
          hint: 'With any of the selections below, you may add contract number(s) if there are any in place to support this effort.',
          options: [
            'No, this is a completely new system, service, or contract',
            'Yes, an existing system',
            'Yes, an existing service or other contract'
          ],
          warning:
            'Please only select this option if this is completely new work and is not at all related to an existing effort. If this is new work for an existing system, such as a sub-system or other new IT effort, please choose one of the other options below.'
        },
        contractNumberNew: {
          label: 'Contract number',
          help: 'If this new work has one or more contract numbers, please add them here. If not, you may leave this field blank. Comma-separate multiple values.'
        },
        cmsSystem: {
          label: 'Which CMS system?',
          selectedLabel: 'Selected system',
          help: 'This field searches existing CMS systems. Select all that apply.'
        },
        contractNumberExisting: {
          label: 'Contract number',
          help: 'If your work is associated with existing contract(s), please input the contract number(s) here. If it is not, you may leave this field blank. Comma-separate multiple values.'
        },
        serviceOrContractName: {
          label: 'Service or contract name'
        }
      },
      continueTaskList: 'Continue to task list',
      next: 'Next',
      skip: 'I’m not sure (skip this step)',
      back: 'Back',
      save: 'Save',
      saveChanges: 'Save changes',
      unlink: 'or, unlink all information'
    },
    cancelAndExit: 'Cancel request and exit',
    dontUpdate: 'Don’t update and return to task list',
    skipConfirm: {
      heading: 'Are you sure you want to skip this step?',
      text: 'Linking this request to its system, service, or other contract provides additional benefits:',
      list: [
        'The Governance Team can assist you in a more streamlined and comprehensive manner if they have information about your system, service, or contract.',
        'EASi can offer increased capabilities and features such as reminders, updates, and other notifications.'
      ],
      submit: 'Skip step',
      cancel: 'Don’t skip this step'
    },
    unlinkConfirm: {
      heading: 'Unlink all information?',
      text: [
        "If you clear the information previously input for this question and remove this request's link to a system, service, or other contract, you may re-link it again later.",
        'Benefits of linking a request to a system, service, or other contract:'
      ],
      list: [
        'The Governance Admin Team can assist you in a more streamlined and comprehensive manner if they have information about your system, service, or contract.'
      ],
      submit: 'Unlink',
      cancel: 'Go back and don’t unlink'
    }
  }
};
