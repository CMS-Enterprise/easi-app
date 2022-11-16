const technicalAssistance = {
  heading: 'Technical Assistance',
  nextStep: 'Start a new request',
  // Misc breadcrumb items
  breadcrumbs: {
    startTrbRequest: 'Start a TRB Request'
  },
  // Common button text
  button: {
    back: 'Back',
    continue: 'Continue',
    next: 'Next',
    saveAndExit: 'Save and exit',
    start: 'Start'
  },
  table: {
    header: {
      requestName: 'Request Name',
      submissionDate: 'Submission date',
      status: 'Status'
    }
  },
  // Higher level errors
  errors: {
    checkFix: 'Please check and fix the following',
    fillBlank: 'Please fill in the blank',
    fillDate: 'Please fill in the date',
    includeExplanation: 'Please include an explanation',
    makeSelection: 'Please make a selection',
    somethingWrong: 'Something went wrong.'
  },
  newRequest: {
    heading: 'Start a technical assistance request',
    subhead: 'What is this request for?',
    goBack: 'Go back without starting a request',
    type: {
      NEED_HELP: {
        heading: 'I’m having a problem with my system',
        text:
          'The TRB can help you work through technical roadblocks that you are having with your system. Choose this option if:',
        list: [
          'you received a security finding, had an incident, or have a POA&M that you need help addressing',
          'you are having implementation difficulties and want guidance on how to proceed',
          'leadership has directed you to engage with the TRB because of an issue with your system'
        ]
      },
      BRAINSTORM: {
        heading: 'I have an idea and would like feedback',
        text:
          'The TRB now offers more casual conversations about specific topics, solutions, or ideas. Choose this option if:',
        list: [
          'your team is considering a new technical direction for future work',
          'you have a completely new idea for a system or service and would like to get feedback about it',
          'you want to brainstorm open-ended technical solutions'
        ]
      },
      FOLLOWUP: {
        heading: 'Follow-up or cadence consult',
        text:
          'Select this option if you have previously attended an IT Lounge or consultation with the TRB, and the TRB recommended a follow-up session as part of your next steps. Choose this option if:',
        list: [
          'the TRB recommended a follow-up session',
          'you have a regular cadence of engagements with the TRB and need to schedule the next one'
        ]
      },
      FORMAL_REVIEW: {
        heading: 'Formal design review',
        text:
          'Though the TRB has shifted to become more of a consultation and advice service, you can still request a more formal design review or readiness review. Choose this option if:',
        list: [
          'you have a architecture solution in mind and would like a review',
          'you are ready to go live and would like one final review with the TRB to make sure your team didn’t miss anything',
          'you would like a formal review of how your solution aligns with CMS’s Technical Reference Architecture (TRA)'
        ]
      }
    },
    start: 'Start',
    additionalTrbServices: 'Additional TRB services',
    services: {
      other: 'Other (I don’t see what I’m looking for)'
    }
  },
  steps: {
    heading: 'Get technical assistance',
    changeRequestType: 'Change request type',
    description:
      'The CMS Technical Review Board (TRB) is a technical assistance resource for project teams across the agency at all stages of their system’s life cycle. It offers consultations and reviews on an ongoing or one-off basis, allowing project teams to consult with a cross-functional team of technical advisors. It also provides guidance to project teams on adhering to CMS technical standards and leveraging existing technologies.',

    info: {
      text: [
        'Using this process will allow you to:',
        'Requests are usually reviewed and have IT Tech Lounge sessions scheduled within a week.'
      ],
      list: [
        'ask for help with a technical problem',
        'consult with SMEs from across the agency',
        'consult with the TRB about compliance with CMS guidelines and standards'
      ]
    },
    stepsInTheProcess: 'Steps in the process',
    list: [
      {
        heading: 'Fill out the initial request form',
        text: [
          'Tell the Technical Review Board (TRB) what you need help with, including an overview of your question, problem, and/or solution. You may also upload any documentation that you think the TRB may find helpful (don’t worry, you’ll also be able to add documents later if you aren’t sure what to upload at this stage).',
          'This step helps TRB team members better understand what type of help you’re looking for and how best to assist you. It also lets the TRB prepare more targeted assistance so that you get more value from your IT Lounge session.'
        ]
      },
      {
        heading: 'Feedback from the initial review',
        text: [
          'The TRB will review your request form form and decide if they need additional information from you. If not, they’ll direct you to go through the remaining steps as they schedule an IT Lounge for you and/or your team.'
        ]
      },
      {
        heading: 'Prepare for the IT Lounge session',
        text: [
          'Prepare by completing some or all of the following:',
          'Prepare for the IT Lounge (opens in new tab)'
        ],
        list: [
          'download the TRB presentation deck template and fill it out for your project',
          'upload any additional documentation that may help the TRB and SMEs better understand what you need help with',
          'confirm the list of attendees (if any) from your project team'
        ]
      },
      {
        heading: 'Attend the IT Tech Lounge session',
        text: [
          'A TRB team member will schedule an IT Tech Lounge session for your project. Attendees could include:',
          'IT Tech Lounge sessions are usually scheduled as 1-hour sessions on Tuesday or Thursday.'
        ],
        list: [
          'Subject Matter Experts (SMEs) to provide additional advice and insight',
          'any additional project team members you’ve specified',
          '1 or more TRB team members'
        ]
      },
      {
        heading: 'Advice letter and next steps',
        text: [
          'The TRB will work with any SMEs who attended the IT Tech Lounge session to compile a letter that documents any advice for your project team as well as any recommended next steps.'
        ]
      }
    ],
    back: 'Back',
    continue: 'Continue'
  },
  taskList: {
    heading: 'Task list'
  },
  requestForm: {
    heading: 'TRB Request',
    description: [
      'Tell the Technical Review Board (TRB) what type of technical support you need. The information you provide on this form helps the TRB understand context around your request in order to offer more targeted help.',
      'After submitting this form, you will receive an automatic email from the TRB mailbox, and an TRB team member will reach out regarding next steps.'
    ],
    steps: [
      { name: 'Basic request details' },
      {
        name: 'Subject areas',
        description:
          'Select any and all subjects or topics that are relevant to your request or that you would like specific help with. This will help the TRB invite any additional subject matter experts (SMEs) who may be able to provide additional assistance.'
      },
      {
        name: 'Attendees',
        description:
          'As the primary requester, please add your CMS component and role on the project. You may also add the names and contact information for any additional individuals who should be present at the IT Tech Lounge or other meetings.'
      },
      {
        name: 'Supporting documents',
        description:
          'Upload any documents relevant to your request. This could include documents such as presentation slide decks, concept papers, architecture diagrams, or other system information documents.'
      },
      {
        name: 'Check and submit',
        longName: 'Check your answers and submit your TRB Request'
      }
    ]
  },
  //
  // Form step components
  //
  basic: {
    labels: {
      name: 'Request name',
      component: 'Request component',
      needsAssistanceWith: 'What do you need technical assistance with?',
      hasSolutionInMind: 'Do you have a solution in mind already?',
      proposedSolution: 'Describe your proposed solution.',
      whereInProcess: 'Where are you in your process?',
      hasExpectedStartEndDates:
        'Does your solution have an expected start and/or end date?',
      expectedStartDate: 'Expected start date',
      expectedEndDate: 'Expected end date',
      collabGroups:
        'Select any other OIT groups that you have met with or collaborated with.',
      collabGroupOther: 'Which other group(s)?',
      whenMeet: 'When did you meet with them?'
    },
    hint: {
      component:
        'Let the TRB know which CMS component this request originates from.',
      needsAssistanceWith:
        'Describe the type of help you need from the TRB as well as the project purpose (the “why”) and objectives of your work, if applicable.',
      whereInProcess:
        'This helps the TRB provide the right type of support for your request.',
      whenMeet:
        'Please include specific date(s) if you are able. If not, specifying the month, quarter, or year is acceptable.'
    },
    options: {
      select: 'Select',
      yes: 'Yes',
      no: 'No',
      other: 'Other',
      whereInProcess: {
        iHaveAnIdeaAndWantToBrainstorm: 'I have an idea and want to brainstorm',
        contractingWorkHasStarted:
          'Contracting work has started, but a contractor has not been selected',
        developmentHasRecentlyStarted: 'Development has recently started',
        developmentIsSignificantlyUnderway:
          'Development is significantly underway',
        theSystemIsInOperationAndMaintenance:
          'The system is in Operation and Maintenance',
        other: 'Other'
      },
      collabGroups: {
        security: 'Security',
        enterpriseArchitecture: 'Enterprise Architecture (EA)',
        cloud: 'Cloud',
        privacyAdvisor: 'Privacy',
        governanceReviewBoard:
          'Governance Review Board (GRB) or Governance Review Team (GRT)',
        other: 'Other'
      }
    },
    errors: {
      submit:
        'Your basic request details were not saved. Please try again. If the error persists, please try again at a later date.'
    },
    allFieldsMandatory: 'All fields are mandatory'
  },
  subject: {},
  attendees: {
    addAnAttendee: 'Add an attendee',
    addAttendee: 'Add attendee',
    remove: 'Remove',
    cancel: 'Cancel',
    continueWithoutAdding: 'Continue without adding attendees',
    dontAddAndReturn: 'Don’t add and return to previous page'
  },
  documents: {
    continueWithoutAdding: 'Continue without adding documents'
  },
  check: {
    submit: 'Submit request'
  },
  done: {
    success: {
      heading: 'Success!',
      info:
        'Your TRB Request has been submitted. you will receive an automatic email from the TRB mailbox, and an TRB team member will reach out regarding next steps.'
    },
    error: {
      heading: 'Something went wrong.',
      info:
        'Your TRB Request was not submitted. Please either return to the previous page and try again or try again at a later date.'
    }
  }
};

export default technicalAssistance;
