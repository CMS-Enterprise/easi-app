import {
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';

import { GRBReviewFormAction } from 'types/grbReview';
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

export default {
  title: 'GRB review',
  description:
    'Many projects coming through the IT Governance process require review by the Governance Review Board (GRB). These reviews may happen at regularly scheduled GRB meetings or during an alternate asynchronous review process. GRB members will review project details, discuss any concerns, and vote on the merits of the project under consideration. ',
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
    'The Governance Admin Team has invited you to view documentation related to this IT Governance request. Use the navigation to the left or the buttons below to view the documentation.',
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
  asyncPresentation: {
    title: 'Asynchronous presentation',
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
      'Adding a reviewer will send them an informational notification email with a link to EASi. This individual will be able to see information about this IT Governance request including the Intake Request form, Business Case, and other supporting documents. Please make sure this individual should be able to access this information before you proceed. They will not be able to take any actions on the request or see Admin notes.'
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
  presentationLinks: {
    heading_add: 'Add presentation links',
    heading_edit: 'Edit presentation link',
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
      'Please complete either the recording link or presentation deck field before submitting.'
  }
};
