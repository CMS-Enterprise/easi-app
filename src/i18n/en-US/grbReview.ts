import {
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/gen/graphql';

export const grbReviewerVotingRolesTranslation: Record<
  SystemIntakeGRBReviewerVotingRole,
  string
> = {
  VOTING: 'Voting',
  NON_VOTING: 'Non-voting',
  ALTERNATE: 'Alternate'
};

export const grbReviewerRolesTranslation: Record<
  SystemIntakeGRBReviewerRole,
  string
> = {
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

export default {
  title: 'GRB review',
  aria: 'Open GRB review',
  description:
    'Many projects coming through the IT Governance process require review by the Governance Review Board (GRB). These reviews may happen at regularly scheduled GRB meetings or during an alternate asynchronous review process. GRB members will review project details, discuss any concerns, and vote on the merits of the project under consideration. ',
  featureInProgress: 'Feature in progress',
  featureInProgressText:
    'The capabilities currently available allow Governance Admin Team members to invite GRB reviewers to access documentation related to requests. Future capabilities will include voting, discussions with project teams and GRB members, timelines, and more. Currently, however, all communication with the GRB and the project team must be completed via email or during meetings. If you have any questions, please complete the <a>feedback form</a> in the footer of this page.',
  participants: 'Participants',
  participantsText:
    'The Governance Admin Team has invited you to view documentation related to this IT Governance request. Use the navigation to the left or the buttons below to view the documentation.',
  availableDocumentation: 'Available documentation',
  viewBusinessCase: 'View Business Case',
  viewIntakeRequest: 'View Intake Request',
  viewOtherDocuments: 'View other supporting documents',
  addGrbReviewer: 'Add a GRB reviewer',
  supportingDocuments: 'Supporting Documents',
  supportingDocumentsText:
    'The documents below will help the GRB review this IT Governance request, and were completed during the course of this IT Governance request or were added by the requester and/or the Governance Admin Team. You may add additional documents and may remove any that have been added by Governance Admin Team members.',
  businessCaseOverview: {
    title: 'Business Case Overview',
    submitted: 'Last Updated',
    need: 'Business or user need',
    preferredSolution: 'Preferred solution: Summary',
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
    grbMemberName: 'GRB member name',
    grbMemberNameHelpText: 'This field searches CMS’ EUA database.',
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
    submit_edit: 'Save changes',
    removeGrbReviewer: 'Remove GRB reviewer',
    infoAlert:
      'This individual will be able to see information about this IT Governance request within EASi. Please make sure this individual should be able to access this information before you proceed. They will not be able to take any actions on the request or see Admin notes.',
    error:
      'There was an issue adding this GRB reviewer. Please try again, and if the error persists, try again at a later date.',
    success_ALTERNATE:
      'You added <strong>{{commonName}}</strong> as an <strong>alternate member</strong> for this GRB review.',
    success:
      'You added <strong>{{commonName}}</strong> as a <strong>{{votingRole}} member</strong> for this GRB review.'
  },
  votingRoles: grbReviewerVotingRolesTranslation,
  reviewerRoles: grbReviewerRolesTranslation,
  removeSuccess:
    'You removed <strong>{{commonName}}</strong> as a GRB reviewer.',
  removeError:
    'There was an issue removing this GRB reviewer. Please try again, and if the error persists, try again at a later date.',
  removeModal: {
    title: 'Remove {{commonName}} as a GRB reviewer?',
    text:
      'Removing this reviewer will remove their access to documentation about this request. You may add them again at a later date if necessary.',
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
  }
};
