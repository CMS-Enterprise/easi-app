import {
  SystemIntakeAsyncGRBVotingOption,
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeGRBReviewStandardStatusType
} from 'gql/generated/graphql';

import { GRBReviewFormAction, GRBReviewStatus } from 'types/grbReview';
import { Translation } from 'types/util';

export const grbReviewerVotingRolesTranslation: Translation<SystemIntakeGRBReviewerVotingRole> =
  {
    VOTING: 'Voting',
    NON_VOTING: 'Non-voting',
    ALTERNATE: 'Alternate'
  };

export const grbReviewerRolesTranslation: Translation<SystemIntakeGRBReviewerRole> =
  {
    CO_CHAIR_CIO: 'Co-Chair - CIO',
    CO_CHAIR_CFO: 'CO-Chair - CFO',
    CO_CHAIR_HCA: 'CO-Chair - HCA',
    ACA_3021_REP: 'ACA 3021 Rep',
    CCIIO_REP: 'CCIIO Rep',
    PROGRAM_OPERATIONS_BDG_CHAIR: 'Program Operations BDG Chair',
    CMCS_REP: 'CMCS Rep',
    FED_ADMIN_BDG_CHAIR: 'Fed Admin BDG Chair',
    PROGRAM_INTEGRITY_BDG_CHAIR: 'Program Integrity BDG Chair',
    QIO_REP: 'QIO Rep',
    SUBJECT_MATTER_EXPERT: 'Subject Matter Expert (SME)',
    OTHER: 'Other'
  };

const messages: {
  error: Translation<GRBReviewFormAction>;
  success: Translation<GRBReviewFormAction>;
} = {
  error: {
    add: 'There was an issue adding GRB reviewers. Please try again, and if the error persists, try again at a later date.',
    edit: 'There was an issue updating roles for this GRB reviewer. Please try again, and if the error persists, try again at a later date.',
    remove:
      'There was an issue removing this GRB reviewer. Please try again, and if the error persists, try again at a later date.'
  },
  success: {
    add: 'You added <strong>1 reviewer</strong> to this GRB review.',
    add_plural:
      'You added <strong>{{count}} reviewers</strong> to this GRB review.',
    edit: 'You updated roles for {{commonName}} for this GRB review.',
    remove: 'You removed <strong>{{commonName}}</strong> as a GRB reviewer.'
  }
};

export const grbReviewFormSteps = [
  {
    label: 'Review type',
    key: 'review-type',
    description: 'Select the type of GRB review required for this project'
  },
  {
    label: 'Presentation',
    key: 'presentation',
    description:
      'Organize a date and time for the project team to record or present their project. For asynchronous reviews, also add links to the presentation materials.'
  },
  {
    label: 'Additional documentation',
    key: 'documents',
    description:
      'EASi will automatically link the Business Case (if applicable) and Intake Request form, but you may upload any additional documents necessary to provide GRB reviewers with project information or context. Documents already listed below were uploaded by the requester or project team as a part of their intake request. You may remove any documents uploaded by other Governance Admin Team members, but will not be able to remove documents uploaded by the requester or project team.'
  },
  {
    label: 'Participants and timeframe',
    key: 'participants',
    description:
      'Add the voting and non-voting GRB members who should participate in this review. For asynchronous reviews, add an end date for the review.'
  }
] as const;

const grbReviewStatus: Translation<GRBReviewStatus> = {
  NOT_STARTED: 'Not started',
  [SystemIntakeGRBReviewStandardStatusType.SCHEDULED]: 'Scheduled',
  [SystemIntakeGRBReviewAsyncStatusType.IN_PROGRESS]: 'In progress',
  [SystemIntakeGRBReviewAsyncStatusType.COMPLETED]: 'Complete',
  [SystemIntakeGRBReviewAsyncStatusType.PAST_DUE]: 'Past due'
};

export default {
  title: 'GRB review',
  description:
    'Many projects coming through the IT Governance process require review by the Governance Review Board (GRB). These reviews may happen at regularly scheduled GRB reviews or during an alternate asynchronous review process. GRB members will review project details, discuss any concerns, and vote on the merits of the project under consideration. ',
  featureInProgress: 'Feature in progress',
  featureInProgressText:
    'The capabilities currently available allow Governance Admin Team members to invite GRB reviewers to access documentation related to requests. Future capabilities will include voting, discussions with project teams, timelines, and more. Currently, however, all communication with the project team must be completed via email or during meetings. If you have any questions, please complete the <a>feedback form</a> in the footer of this page.',
  startGrbReview: 'Start GRB review',
  reviewStartedOn: 'Review started on {{date}}',
  startReviewModal: {
    heading: 'Start this GRB review?',
    text: 'Starting this review will send email notifications to {{count}} GRB reviewers. Any reviewer you add after starting this review will automatically receive a notification.',
    startReview: 'Start review and send notifications'
  },
  startGrbReviewError:
    'There was an issue starting this GRB review. Please try again, and if the error persists, try again at a later date.',
  participantsStartReviewAlert:
    'Adding GRB reviewers will not send them an invitation until you start the GRB review using the <a>Start GRB Review</a> button above, though they will still be able to access content if they sign into EASi.',
  participants: 'Participants',
  participantsText:
    'Add the GRB members who should review this IT Governance request. They will be able to view the Intake Request, Business Case, and any supporting documents.',
  availableDocumentation: 'Available documentation',
  viewBusinessCase: 'View Business Case',
  viewIntakeRequest: 'View Intake Request',
  viewOtherDocuments: 'View other supporting documents',
  addGrbReviewer: 'Add a GRB reviewer',
  reviewDetails: {
    title: 'Review details',
    text: 'Additional content relevant to this GRB review.',
    grbFeedback: {
      title: 'GRT recommendations to the GRB',
      text: 'The Governance Review Team (GRT) has provided recommendations and feedback about this project.',
      emptyAlert:
        'The Governance Review Team (GRT) did not provide recommendations or feedback for this project.',
      show: 'Show GRT recommendations',
      hide: 'Hide GRT recommendations'
    }
  },
  supportingDocuments: 'Supporting documents',
  supportingDocumentsText:
    'The documents below will help the GRB review this IT Governance request, and were completed during the course of this IT Governance request or were added by the requester and/or the Governance Admin Team. You may add additional documents and may remove any that have been added by Governance Admin Team members.',
  asyncCompleted: {
    presentationLinks:
      'This review is over. For an asynchronous review, you may <link1>restart</link1> to update presentation links.',
    documents:
      'This review is over. Please <link1>restart</link1> it if you would like to add additional documents.',
    reviewers:
      'This review is over. Please <link1>restart</link1> it to add additional reviewers.'
  },
  asyncPresentation: {
    title: 'Presentation links',
    asyncPresentationDate: 'Asynchronous presentation: {{date}}',
    asyncPresentationNotScheduled:
      'Asynchronous presentation not scheduled yet',
    editPresentationLinks: 'Edit presentation links',
    removeAllPresentationLinks: 'Remove all presentation links',
    viewRecording: 'View recording',
    noRecordingLinkAvailable: 'No recording link available',
    passcode: '(Passcode: {{passcode}})',
    viewTranscript: 'View transcript',
    viewSlideDeck: 'View slide deck',
    addAsynchronousPresentationLinks: 'Add asynchronous presentation links',
    virusScanning: 'Virus scanning in progress...',
    adminEmptyAlert:
      'If this GRB review has an asynchronous presentation and recording, you may add that content to EASi to provide additional information for GRB reviews.',
    continueReviewSetup: 'Continue GRB review setup',
    reviewSetupNotCompleted:
      'You have not completed setup for this review. Continue the GRB review setup process to add presentation links and/or a slide deck.',
    emptyAlert: 'The GRB have not yet added presentation links.',

    modalRemoveLinks: {
      title: 'Remove presentation links?',
      text: 'This action will remove any links and files previously added about this asynchronous presesntation and cannot be undone. Are you sure you want to continue?',
      confirm: 'Remove presentation links',
      cancel: "Don't remove",
      success: 'Presentation links have been removed.',
      error:
        'There was an issue deleting the presentation details. Please try again, and if the problem persists, try again later.'
    }
  },
  businessCaseOverview: {
    title: 'Business Case overview',
    submitted: 'Last Updated',
    need: 'Business or user need',
    preferredSolution: 'Preferred solution: Summary',
    noSolution: 'No answer added.',
    linkToBusinessCase: 'View full Business Case',
    unsubmittedAlertText: 'There is not yet a Business Case for this request.'
  },
  additionalDocuments: 'Additional documents',
  additionalDocsLink: 'Add another supporting document',
  documentsIntakeLinkTitle: 'EASi Intake Request form',
  documentsIntakeLinkText: 'View in EASi',
  documentsIntakeSubmitted: 'submitted',
  participantsTable: {
    name: 'Name',
    votingRole: 'Voting role',
    grbRole: 'GRB role',
    actions: 'Actions',
    noReviewers:
      'You have not yet added GRB reviewers. Add reviewers using the button above.'
  },
  addAnotherGrbReviewer: 'Add another GRB reviewer',
  closedRequest:
    'This request is closed. Please <a>re-open</a> it before adding additional reviewers',
  form: {
    title: 'Add a GRB reviewer',
    description:
      'Add details about this Governance Review Board (GRB) reviewer, including their name, voting role, and GRB role such as the Budget Development Group (BDG) they represent.',
    returnToRequest_edit: 'Don’t save and return to request details',
    returnToRequest_add: 'Don’t add and return to request details',
    addViaEUA: 'Add via EUA',
    addFromRequest: 'Add from previous request',
    addFromRequestDescription:
      'EASi allows you to bulk-add GRB reviewers that were previously added to past GRB reviews.',
    itGovernanceRequests: 'EASi IT Governance requests',
    itGovernanceRequestsHelpText:
      'Search this list of previous Governance requests. Any requests without assigned GRB reviewers are filtered out of this list.',
    selectRequestAlert:
      'Select a request above to populate a list of possible GRB reviewers to select from.',
    grbReviewerResults:
      '<strong>{{count}} results.</strong> Select reviewers you wish to add to your current request’s GRB review. You may edit roles after adding reviewers. Checkboxes are disabled for individuals who have already been added to this review.',
    grbMemberName: 'GRB member name',
    grbMemberNameHelpText: 'This field searches CMS’ EUA database.',
    duplicateReviewerAlert:
      "This individual is already listed as a GRB reviewer for this request. Please choose a different reviewer or return to the main review screen to manage this reviewer's roles.",
    votingRole: 'Voting role',
    votingRolesInfo: {
      label: 'What voting roles are available?',
      items: [
        '<dt>Voting:</dt> <dd>Assign this role to any voting members of the GRB for standard GRB reviews, or to the GRB co-chairs for a waiver or expedited review. Individuals with this role will vote on the merit of this project.</dd>',
        '<dt>Alternate:</dt> <dd>Assign this role to any backup voting members for standard GRB reviews.</dd>',
        '<dt>Non-voting:</dt> <dd>Assign this role to any individual who should be able to see the review content but will not vote on the merit of the project.</dd>'
      ]
    },
    grbRole: 'GRB role',
    grbRoleHelpText:
      'Select the role that this reviewer has on the GRB, such as the BDG that they represent.',
    submit_add: 'Add reviewer',
    submit_add_zero: 'Add reviewer',
    submit_add_plural: 'Add reviewers ({{count}})',
    submit_edit: 'Save changes',
    removeGrbReviewer: 'Remove GRB reviewer',
    infoAlertReviewNotStarted:
      'Adding GRB reviewers will not send them an invitation until you start the GRB review, though they will still be able to access content if they sign into EASi. This individual will be able to see information about this IT Governance request including the Intake Request form, Business Case, and other supporting documents. Please make sure this individual should be able to access this information before you proceed. They will not be able to take any actions on the request or see Admin notes.',
    infoAlertReviewStarted:
      'Adding a reviewer will send them an informational notification email with a link to EASi. This individual will be able to see information about this IT Governance request including the Intake Request form, Business Case, and other supporting documents. Please make sure this individual should be able to access this information before you proceed. They will not be able to take any actions on the request or see Admin notes.',
    cantStartAlert_ASYNC:
      'You will not be able to complete this form and begin the review until the request is in the “Ready for GRB review” status. Please take the admin action to progress this request to the GRB step. <link1>Go to admin actions</link1>',
    cantStartAlert_STANDARD:
      'You will not be able to complete this form until the request is in the “Ready for GRB review” status. Please take the admin action to progress this request to the GRB step. <link1>Go to admin actions</link1>'
  },
  messages,
  votingRoles: grbReviewerVotingRolesTranslation,

  reviewerRoles: grbReviewerRolesTranslation,
  removeModal: {
    title: 'Remove {{commonName}} as a GRB reviewer?',
    text: 'Removing this reviewer will remove their access to documentation about this request. You may add them again at a later date if necessary.',
    remove: 'Remove reviewer'
  },
  homepage: {
    participationNeeded: 'GRB participation needed',
    participationNeededText:
      'The Governance Admin Team asks that the Governance Review Board (GRB) review and vote on the merits of IT projects. Depending on the project and timeframe, this may done asynchronously or during a regular GRB review meeting. Use the button below to access details for IT Governance requests that require a GRB review. ',
    showGrbReviews: 'Show GRB reviews',
    hideGrbReviews: 'Hide GRB reviews',
    grbDate: 'GRB date',
    noDateSet: 'No date set'
  },
  setUpGrbReviewForm: {
    heading: 'Set up GRB review',
    text: 'Use this form to set up a Governance Review Board (GRB) review in EASi.',
    subText:
      'You will be able to select the type of review, add recordings and documents, invite GRB members to review this project, and set a timeframe for an asynchronous review.',
    saveAndReturn: 'Save and return to request',
    steps: grbReviewFormSteps,
    error:
      'There was a problem saving your GRB review form. Please try again. If the error persists, please try again at a later date.',
    minFive: 'Please select at least five voting GRB reviewers',
    invalidDate: 'Please enter a valid date',
    reviewType: {
      label: 'Choose review type',
      summaryHeading: 'GRB review types',
      async: 'Asynchronous review',
      asyncSummary:
        '<span>Asynchronous review:</span> The Governance Admin Team will work with the project team to record their presentation and then upload the recording for asynchronous review by the GRB. Use this review type for projects that cannot fit into the standard schedule of meetings or have other requirements that make an asynchronous review preferable.',
      standard: 'Standard meeting',
      standardSummary:
        '<span>Standard meeting:</span> The project team will present their project at one of the regularly-scheduled GRB meetings. Setting up a standard meeting will not require all steps of this form.'
    },
    documents: {
      heading: 'Documents',
      addDocument: 'Add a document',
      standardMeetingAlert:
        'Because this review is a standard GRB meeting, GRB members may not review these documents unless they are presented during the meeting. However, adding additional documents here gives GRB members the option to access documentation within EASi prior to the meeting.',
      collapsableText: {
        label: 'What documents should I upload?',
        description:
          'GRB reviewers value documents that give them additional context about the project, its budget and funding background, and/or feedback from previous reviewers such as the GRT or small group. These could include documents such as:',
        list: [
          'GRT meeting minutes',
          'Request for Additional Funding (RAF)',
          'Draft Independent Government Cost Estimate (IGCE)'
        ]
      }
    },
    completeAndBeginReview: 'Complete and begin review',
    participants: {
      standardAlert:
        'Because this review is a standard GRB meeting, you do not need to add GRB reviewers to EASi. However, if you do add reviewers, they will have the option to access documentation about this request within EASi prior to the meeting.',
      grbReviewers: {
        heading: 'GRB reviewers',
        description:
          'Add the GRB members who should review this IT Governance request and indicate their voting role. For asynchronous reviews, you must add at least 5 voting members.'
      },
      timeframe: {
        heading: 'Timeframe',
        description:
          'Set a timeframe for this review. The GRB members above will be notified of the end date and will receive some automatic reminders.'
      },
      selectReviewEndDate: {
        heading: 'Select review end date',
        description:
          'Select the date when the GRB review should end. The review will close at 5pm EST on that day. You will have the opportunity to add additional time to this review if necessary. Format: mm/dd/yyyy'
      }
    }
  },
  presentationGRBReviewForm: {
    heading: 'GRB Meeting',
    description:
      'Organize a GRB meeting for the project team’s presentation to the GRB.',
    alert:
      'You will need to work with the project team outside of EASi to set up a calendar invite, but you may include the date below for reference purposes within EASi.',
    meetingDateLabel: 'GRB meeting date',
    meetingDateDescription:
      'This date will be visible to the requester. Format: mm/dd/yyyy',
    required: 'This is a required field.',
    asyncHeading: 'For the requester and project team',
    asyncDescription:
      'Organize a meeting to record the project team’s presentation for the GRB.',
    asyncRecordingDateLabel: 'Asynchronous presentation recording date',
    forTheReviewers: 'For the GRB reviewers',
    reviewersDescription:
      'The GRB will use the resources below as a part of their review of this IT Governance request.'
  },
  adminTask: {
    title: 'Admin Task',
    setUpGRBReview: {
      title: 'Set up GRB review',
      description:
        'EASi will guide you through setting up a GRB review, including the decision between an asynchronous review in EASi and a standard review meeting.',
      whatDoINeedLabel: 'What do I need in order to set up a GRB review?',
      whatDoINeed: [
        '<bold>Presentation recording and transcript</bold>: Organize a time to asynchronously record this project team’s presentation. You will need to add a link to the recording during the setup process.',
        '<bold>Additional supporting documents</bold>: EASi will automatically add a reference to the Business Case, Intake Request form, and any supporting documents already uploaded by the requester. Please have on hand any additional documents for the GRB to consider as a part of this request.',
        '<bold>GRB reviewers</bold>: EASi will guide you through the process of adding voting and non-voting GRB reviewers. Please have on hand the names, email addresses, or EUA IDs of these individuals.',
        '<bold>Timeframe</bold>: Decide on the number of days allotted for this GRB review. You will be able to add more time during the review process if needed.'
      ]
    },
    sendReviewReminder: {
      title: 'Send review reminder',
      description:
        'GRB voting members will get an automatic reminder when there is one day left in the review process. You may use the button below to send an additional reminder at any time.',
      sendReminder: 'Send reminder',
      mostRecentReminder: 'Most recent reminder sent on {{date}} at {{time}}',
      modal: {
        title: 'Send a reminder',
        description:
          'Sending this reminder will send a notification email to the {{count}} out of {{total}} Governance Review Board (GRB) voting members who have not yet added a vote for this request.',
        sendReminder: 'Send reminder',
        cancel: 'Go back without sending',
        success:
          'You sent a voting reminder for this GRB review. GRB members added to this review will receive a voting reminder email.',
        error:
          'There was an issue sending your reminder. Please try again, and if the problem persists, try again later.'
      }
    },
    takeADifferentAction: 'or, take a different action',
    restartReview: {
      title: 'Restart review?',
      description:
        'Restarting this review will retain any existing votes and discussions, but will allow Governance Review Board (GRB) members to cast a new vote or change their existing vote.',
      setNewEndDateLabel: 'Set new end date',
      setNewEndDateHelpText:
        'Select the new date when the GRB review should end. The review will close at 5pm EST on that day. Format: mm/dd/yyyy',
      restart: 'Restart',
      cancel: "Go back and don't restart",
      success:
        'You restarted this GRB review. The new end date is <bold>{{date}}</bold> at 5:00pm EST.',
      error:
        'There was an issue restarting this review. Please try again, and if the problem persists, try again later.'
    }
  },
  reviewTask: {
    title: 'GRB Task',
    voting: {
      title:
        'Review this IT Governance request and share your opinion on its merit',
      step1:
        '<bold>Step 1</bold>: Review information about this project and request.',
      whatIsImportant:
        'What is the most important information and where should I start?',
      documentsOrResources:
        'Most request will have the following documents or resources:',
      documentItems: [
        'Presentation recording and slide deck <presentationLink>Go to presentation links</presentationLink>',
        'Business Case <businessCaseLink>Go to Business Case</businessCaseLink>',
        'Recommendations to the GRB from the Governance Review Team (GRT) <grtLink>Go to GRT recommendations</grtLink>'
      ],
      step2:
        '<bold>Step 2</bold>: Ask questions and participate in discussions.',
      howShouldIParticipate: 'How should I participate in discussions?',
      discussionItems: [
        'Start a new discussion thread for each new topic where possible.',
        'Tag individuals or groups in discussions in order to notify those individuals and promote awareness and open communication.',
        'Use the discussion boards to communicate and ask questions about this project. <discussionLink>Go to discussion boards</discussionLink>'
      ],
      step3:
        '<bold>Step 3</bold>: Submit your opinion about this IT Governance request.',
      step3Description:
        'After reviewing, select either No objection or Object to add your vote on the merit of this project. You will also have the option to add a comment for additional context about your vote.',
      object: 'Object',
      [SystemIntakeAsyncGRBVotingOption.OBJECTION]: 'Objection',
      [SystemIntakeAsyncGRBVotingOption.NO_OBJECTION]: 'No objection',
      changeVote: 'Change vote',
      youVoted: 'You voted',
      votedOn: 'on {{date}}',
      modal: {
        titleNoObjection: 'Submit your vote with no objection',
        titleObject: 'Submit your vote with objection',
        titleChangeVote: 'Change your vote',
        description:
          'Your vote will be saved for this GRB review. You may change it until the end of the review period.',
        descriptionChangeVote:
          'Your new vote will be saved for this IT Governance request, and can be changed until the end of the review period.',
        commentsOptional: 'Comments (optional)',
        comments: 'Comments',
        hint: 'Add any additional context about your vote.',
        hintChangeVote:
          'Any comments that you already added are pre-populated below. Removing them will alter your original response.',
        confirmNoObjection: 'Submit “no objection” vote',
        confirmObject: 'Submit “objection” vote',
        confirmChangeVoteObjection: 'Change to an “objection” vote',
        confirmChangeVoteNoObjection: 'Change to an “no objection” vote',
        cancel: 'Cancel and go back',
        keepExistingVote: 'Keep existing vote',
        error:
          'There was an issue submitting your vote. Please try again, and if the problem persists, try again later.',
        validation: 'Vote comment is required',
        validationMustChange: 'Vote comment must be updated'
      }
    }
  },
  presentationLinks: {
    heading_add: 'Add presentation links',
    heading_edit: 'Edit presentation links',
    description_add:
      'If this GRB review has an asynchronous presentation and recording, add that content in the fields below to provide additional information for GRB reviews.',
    description_edit:
      'Update the content for this GRB review’s asynchronous presentation and recording.',
    returnLink: "Don't {{formType}} and return to request details",
    recordingLinkLabel: 'Recording link',
    recordingLinkHelpText:
      'Include a link to the cloud recording or recording storage location. Ensure that permissions allow view access for those who have the link.',
    recordingPasscodeLabel: 'Recording passcode',
    recordingPasscodeHelpText:
      'Include a passcode if one is required to view the recording.',
    transcript: 'Transcript',
    transcriptHelpText:
      'If the transcript of the above recording is located elsewhere, include that link or upload that document below. You cannot include both a link and a document.',
    addLink: 'Add link',
    uploadDocument: 'Upload document',
    presentationDeckLabel: 'Upload a presentation deck',
    documentUploadHelpText: 'Select a PDF, PPT, PPTX, DOC, DOCX, XLS, or XLSX',
    uploadAlert:
      "To keep CMS safe, documents are scanned for viruses after uploading. If something goes wrong, we'll let you know.",
    savePresentationDetails: 'Save presentation details',
    success: 'Your presentation details have been added.',
    error:
      'There was an issue saving your presentation details. Please try again, and if the problem persists, try again later.',
    emptyFormError:
      'Please complete either the recording link or presentation deck field before submitting.',
    requiredField: 'This is a required field.',
    presentationUpload: {
      header: 'Upload GRB presentation',
      description:
        'Upload the presentation deck that this project will share with the Governance Review Board (GRB). You may change the uploaded file at any time before the GRB review period starts. ',
      dontUploadAdmin: 'Don’t upload and return to GRB setup',
      dontUploadRequester:
        'Don’t upload and return to the governance task list',
      selectFile: 'Select your file',
      recommendedFileTypes: 'Select a PDF, PPT, PPTX, DOC, DOCX, XLS, or XLSX',
      upload: 'Upload presentation',
      success: 'You have successfully uploaded your GRB presentation.',
      error:
        'There was an issue uploading your presentation. Please try again, and if the issue persists please try again later.'
    },
    sendReminderCard: {
      header: 'Presentation deck',
      description:
        'The requester and their project team are responsible for uploading their completed presentation deck to EASi, though admin team members may upload a deck for them.',
      uplodededFile: 'Uploaded file',
      notUploadedInfo:
        'The requester has not yet uploaded their GRB presentation deck. Use the buttons below to send a reminder or upload the deck yourself.',
      sendReminder: 'Send reminder',
      reminderSent: 'Reminder sent',
      reminderError:
        'There was an issue sending the reminder. Please try again.',
      uploadDeck: 'or, upload a deck for the project team',
      clearFile: 'Clear file',
      replacementDeck: 'or, upload a replacement presentation deck',
      view: 'View'
    }
  },
  statusCard: {
    heading_STANDARD: 'Standard meeting review',
    heading_ASYNC: 'Asynchronous review',
    reviewStatus: 'Review status',
    grbMeeting: 'GRB meeting',
    changeMeetingDate: 'Change meeting date',
    restartReview: 'Restart review',
    grbReviewStatus,
    timeRemaining: 'Time remaining for review',
    countdown: '{{days}} days, {{hours}} hours, {{minutes}} minutes',
    reviewEnds: 'Review ends {{date}}, 5:00pm EST',
    reviewEnds_PAST_DUE: 'Original end date: {{date}}, 5:00pm EST',
    addTime: 'Add time',
    endVoting: 'End voting',
    addTimeModal: {
      heading: 'Add additional time to this GRB review?',
      description:
        'Use the field below to add additional time to this review. The GRB review page will be updated with the new timeframe.',
      label: 'Set new end date ',
      hint: `Select the new date when the GRB review should end. The review will close at 5pm EST on that day.
Format: mm/dd/yyyy`,
      newEnd: 'This review will now end on {{date}}.',
      addTime: 'Add time',
      goBack: 'Go back and don’t add time',
      success:
        'You added time to this GRB review. The new end date is {{date}} at 5:00pm EST.',
      error:
        'There was an issue adding time to this review. Please try again, and if the problem persists, try again later.'
    },
    endVotingModal: {
      heading: 'End voting early?',
      description:
        'Completing this action will end this GRB review early. GRB members will no longer be able to add votes or change their vote for this request.',
      timeRemaining: 'Time remaining',
      countdown: '{{days}} days, {{hours}} hours, {{minutes}} minutes',
      votingStatus: 'Voting status',
      results:
        '{{noObjection}} no objection, {{objection}} objection, {{notVoted}} not voted',
      endEarly: 'End early',
      goBack: 'Go back and don’t end early',
      success:
        'You have ended this GRB review early. GRB members will no longer be able to add or change votes.',
      error:
        'There was an issue ending the voting early. Please try again, and if the problem persists, try again later.'
    }
  },
  decisionCard: {
    heading: 'Decision record',
    voteInfo:
      '{{noObjection}} no objection, {{objection}} objection, {{notVoted}} not voted',
    viewVotes: 'View votes',
    additionalComments: '{{count}} additional comment',
    additionalComments_plural: '{{count}} additional comments',
    issueDecision: 'Issue decision',
    approve: 'This review suggests a decision to approve this project.',
    notApprove: 'This review suggests a decision to not approve this project.',
    inconclusive: 'This review is inconclusive.'
  },
  decisionRecord: {
    breadcrumb: 'GRB review decision record',
    description:
      'The list below is a record of all the votes submitted by GRB reviewers for this request.',
    returnToRequestDetails: 'Return to request details',
    vote: 'No vote cast',
    vote_OBJECTION: 'Objection',
    vote_NO_OBJECTION: 'No objection',
    viewComment: 'View comment',
    grbComment: 'GRB comment'
  }
};
