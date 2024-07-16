import {
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'types/graphql-global-types';

export const grbReviewerVotingRoles: Record<
  SystemIntakeGRBReviewerVotingRole,
  string
> = {
  VOTING: 'Voting',
  NON_VOTING: 'Non-voting',
  ALTERNATE: 'Alternate'
};

export const grbReviewerRoles: Record<SystemIntakeGRBReviewerRole, string> = {
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
  OTHER: 'OTHER'
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
  form: {
    title: 'Add a GRB reviewer',
    description:
      'Add details about this Governance Review Board (GRB) reviewer, including their name, voting role, and GRB role such as the Budget Development Group (BDG) they represent.',
    returnToRequest: 'Don’t add and return to request details',
    grbMemberName: 'GRB member name',
    grbMemberNameHelpText: 'This field searches CMS’ EUA database.',
    votingRole: 'Voting role',
    grbRole: 'GRB role',
    grbRoleHelpText:
      'Select the role that this reviewer has on the GRB, such as the BDG that they represent.',
    addReviewer: 'Add reviewer'
  },
  votingRoles: grbReviewerVotingRoles,
  reviewerRoles: grbReviewerRoles
};
