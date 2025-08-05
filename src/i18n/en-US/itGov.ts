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
    lcidRetiringSoon: {
      heading: 'LCID retiring soon',
      text: 'The Governance Admin Team has set this Life Cycle ID (LCID) to retire on {{date}}. You may view the existing decision at the <decisionLink>bottom of this page</decisionLink>. If you have further questions, or if you believe there is an error with the retirement date for this LCID, you may contact the Governance Admin Team at <emailLink>{{email}}</emailLink>.'
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
          'Draft a Business Case to communicate your business need, possible solutions and their associated costs. The Governance Team will review it with you and determine whether you are ready for a GRT meeting or GRB review.',
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
        title: 'Participate in GRB review',
        description:
          'The Governance Admin Team will select whether this review will be completed in a synchronous (meeting) format or an asynchronous review format and will direct you to complete any additional necessary steps. During the review, the Governance Review Board (GRB) will discuss and make a decision based on your Business Case and any recommendations from the Governance Review Team (GRT). You may be asked to answer questions about your project.',
        link: 'Prepare for the GRB review (opens in a new tab)',
        button: 'Prepare for the GRB review',
        learnMore: 'Learn more about the GRB review types',
        presentationUploadButton: 'Upload presentation deck',
        scheduledInfo: 'GRB review scheduled for {{date}}.',
        attendedInfo: 'You attended the GRB review on {{date}}.',
        reviewType: {
          copy: '<strong>Review type:</strong> {{type}}',
          STANDARD: 'Standard GRB meeting',
          ASYNC: 'Asynchronous'
        },
        alertType: {
          STANDARD: {
            READY_TO_SCHEDULE:
              'The Governance Admin Team will schedule a GRB review.',
            SCHEDULED: 'GRB meeting scheduled for {{date}}.',
            AWAITING_DECISION: 'You attended the GRB meeting on {{date}}.',
            COMPLETED: 'You attended the GRB meeting on {{date}}.'
          },
          ASYNC: {
            READY_TO_SCHEDULE:
              'The Governance Admin Team will schedule a time to record your presentation.',
            SCHEDULED:
              'Your presentation recording session is scheduled for {{date}}.',
            AWAITING_GRB_REVIEW:
              'You attended the presentation recording session on {{date}}.',
            REVIEW_IN_PROGRESS:
              'This asynchronous review is from {{dateStart}} to {{dateEnd}}.',
            AWAITING_DECISION: 'This GRB review ended on {{date}}.',
            COMPLETED: 'This GRB review ended on {{date}}.'
          }
        },
        uploadPresentation:
          '<strong>Uploaded presentation deck:</strong> {{fileName}}',
        view: 'View',
        remove: 'Remove',
        scanning: 'Document uploaded, virus scanning in progress...',
        removeModal: {
          title: 'Are you sure you want to remove this GRB presentation?',
          text: 'You cannot undo this action, but you may upload a different file after removing this one.',
          confirm: 'Remove presentation',
          goBack: 'Go back'
        },
        reviewTypeModal: {
          title: 'GRB review types',
          goBack: 'Go back to task list',
          ASYNC: {
            heading: 'Asynchronous review',
            description: [
              'The Governance Admin Team chooses an asynchronous review process when the projects cannot fit into the standard schedule of meetings or have other requirements that make an asynchronous review preferable.',
              'The Admin Team will work with the project team to record their presentation and will then upload the recording for asynchronous review by the Governance Review Board (GRB).',
              'During the asynchronous review period, the GRB will evaluate all project documents including the Business Case, presentation recording, presentation slide deck, and any other supporting documents. They may use the discussion board to ask questions of the project team. During the review period they will make decisions about the project based on the Business Case and any previous recommendations from the Governance Review Team (GRT).'
            ]
          },
          STANDARD: {
            heading: 'Standard meeting',
            description: [
              'The Governance Admin Team chooses a standard meeting format when schedules allow for it. In this meeting, the GRB, Admin Team, and the project team all meet to discuss the project. Afterward, the GRB will make decisions about the project based on the Business Case and any previous recommendations from the Governance Review Team.'
            ]
          }
        }
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
    viewOrEditSystemInformation: 'View or edit system information',
    show: {
      more: 'Show {{count}} more',
      less: 'Show {{count}} less'
    }
  },
  link: {
    header: 'Edit linked system(s)?',
    description:
      'If you are requesting a Life Cycle ID (LCID) and governance approval for a new IT investment that is a part of an existing system, please include additional details below.',
    form: {
      field: {
        systemOrService: {
          label: 'Does this project support or involve any other CMS systems?',
          hint: 'Please add a CMS system here if:',
          reasonsToAddSystem: {
            primarySupport: 'This is the primary contract to fund a system',
            partialSupport:
              'Funding allocated to this project is used to support a system, even if it is not the primary support contract',
            usesOrImpactedBySelectedSystem:
              'This project uses a system in its technical solution',
            impactsSelectedSystem:
              'Your project is used by another system to support its business need',
            other:
              'Your project has any other relationship with a CMS system not described above'
          },
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
      dontEditAndReturn: "Don't edit and return to task list",
      save: 'Save',
      saveChanges: 'Save changes',
      unlink: 'or, unlink all information',
      addASystem: 'Add a system',
      doesNotSupportOrUseAnySystems:
        'or, check this box if this project does not support or use any existing CMS systems'
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
