import {
  DeleteSystemIntakeGRBReviewerDocument,
  DeleteSystemIntakeGRBReviewerMutation,
  GetSystemIntakeGRBReviewDocument,
  GetSystemIntakeGRBReviewQuery,
  GRBVotingInformationStatus,
  SystemIntakeAsyncGRBVotingOption,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType,
  SystemIntakeStatusAdmin
} from 'gql/generated/graphql';

import { MockedQuery } from 'types/util';

import { systemIntake } from './systemIntake';

export const grbReview: SystemIntakeGRBReviewFragment = {
  __typename: 'SystemIntake',
  statusAdmin: SystemIntakeStatusAdmin.GRB_MEETING_READY,
  id: systemIntake.id,
  grbReviewType: SystemIntakeGRBReviewType.STANDARD,
  grbReviewStartedAt: null,
  grbDate: null,
  grbReviewAsyncEndDate: null,
  grbReviewAsyncRecordingTime: null,
  grbReviewAsyncStatus: null,
  grbReviewStandardStatus: null,
  grbReviewReminderLastSent: null,
  grbPresentationLinks: null,
  grbVotingInformation: {
    __typename: 'GRBVotingInformation',
    grbReviewers: [],
    numberOfNoObjection: 0,
    numberOfNotVoted: 0,
    numberOfObjection: 0,
    votingStatus: GRBVotingInformationStatus.NOT_STARTED
  },
  documents: []
};

export const getSystemIntakeGRBReviewQuery = (
  data?: Partial<SystemIntakeGRBReviewFragment>
): MockedQuery<GetSystemIntakeGRBReviewQuery> => ({
  request: {
    query: GetSystemIntakeGRBReviewDocument,
    variables: {
      id: data?.id || grbReview.id
    }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntake: {
        ...grbReview,
        ...data
      }
    }
  }
});

export const deleteSystemIntakeGRBReviewerMutation = (
  data: SystemIntakeGRBReviewerFragment
): MockedQuery<DeleteSystemIntakeGRBReviewerMutation> => ({
  request: {
    query: DeleteSystemIntakeGRBReviewerDocument,
    variables: { input: { reviewerID: data.id } }
  },
  result: {
    data: { __typename: 'Mutation', deleteSystemIntakeGRBReviewer: data.id }
  }
});

export const grbReviewers: SystemIntakeGRBReviewerFragment[] = [
  {
    id: '92aff650-2370-45c1-8fdb-46a2a8dd88c5',
    grbRole: SystemIntakeGRBReviewerRole.ACA_3021_REP,

    votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING,
    vote: null,
    voteComment: null,
    dateVoted: null,
    userAccount: {
      id: '8dfb069a-836d-43d4-a7a0-143b065fbc70',
      username: 'K8SY',
      commonName: 'Karen Stanley',
      email: 'karen.stanley@local.fake',
      __typename: 'UserAccount'
    },
    __typename: 'SystemIntakeGRBReviewer'
  },
  {
    id: 'b020e041-0581-4ae0-8eda-53be2acd1707',
    grbRole: SystemIntakeGRBReviewerRole.CMCS_REP,
    votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
    vote: SystemIntakeAsyncGRBVotingOption.NO_OBJECTION,
    voteComment:
      'Lorem ipsum dolor sit amet consectetur. Bibendum metus sollicitudin sed morbi convallis tincidunt cursus ullamcorper. Id iaculis aenean laoreet ultrices diam diam odio ante. Neque sit condimentum semper bibendum adipiscing lectus pellentesque. Porttitor ipsum pharetra scelerisque vitae iaculis pellentesque fermentum.',
    dateVoted: null,
    userAccount: {
      id: '08008125-2d0c-434f-b9e4-d26ce6e26fc2',
      username: 'ABCD',
      commonName: 'Adeline Aarons',
      email: 'adeline.aarons@local.fake',
      __typename: 'UserAccount'
    },
    __typename: 'SystemIntakeGRBReviewer'
  },
  {
    id: '31e4e8df-614f-4ace-8f9f-fe146c9ef73c',
    grbRole: SystemIntakeGRBReviewerRole.SUBJECT_MATTER_EXPERT,
    votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
    vote: SystemIntakeAsyncGRBVotingOption.OBJECTION,
    voteComment: 'This is a comment!',
    dateVoted: null,
    userAccount: {
      id: 'ffb6e946-4495-4f17-9833-851dc95b1af8',
      username: 'BTMN',
      commonName: 'Bruce Wayne',
      email: 'bruce.wayne@gotham.city',
      __typename: 'UserAccount'
    },
    __typename: 'SystemIntakeGRBReviewer'
  },
  {
    id: '02e3889b-a9a0-4289-9508-2fca44d79a34',
    grbRole: SystemIntakeGRBReviewerRole.OTHER,
    votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
    vote: null,
    voteComment: null,
    dateVoted: null,
    userAccount: {
      id: '8808b7d6-cd03-4963-8d42-acc28ba3387c',
      username: 'USR1',
      commonName: 'User One',
      email: 'user.one@local.fake',
      __typename: 'UserAccount'
    },
    __typename: 'SystemIntakeGRBReviewer'
  }
];

export const grbReviewer: SystemIntakeGRBReviewerFragment = {
  __typename: 'SystemIntakeGRBReviewer',
  id: '1',
  userAccount: {
    __typename: 'UserAccount',
    id: '123',
    username: 'jdoe',
    commonName: 'John Doe',
    email: 'j@odd.io'
  },
  vote: SystemIntakeAsyncGRBVotingOption.NO_OBJECTION,
  voteComment: 'This is my vote comment',
  dateVoted: '2025-03-21',
  grbRole: SystemIntakeGRBReviewerRole.ACA_3021_REP,
  votingRole: SystemIntakeGRBReviewerVotingRole.VOTING
};
