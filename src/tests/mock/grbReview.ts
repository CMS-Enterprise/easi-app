import {
  DeleteSystemIntakeGRBReviewerDocument,
  DeleteSystemIntakeGRBReviewerMutation,
  GetSystemIntakeGRBReviewDocument,
  GetSystemIntakeGRBReviewQuery,
  SystemIntakeAsyncGRBVotingOption,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';

import { MockedQuery } from 'types/util';

import { systemIntake } from './systemIntake';

export const grbReview: SystemIntakeGRBReviewFragment = {
  __typename: 'SystemIntake',
  id: systemIntake.id,
  grbReviewType: SystemIntakeGRBReviewType.STANDARD,
  grbReviewers: [],
  documents: []
};

export const getSystemIntakeGRBReviewQuery = (
  data: Partial<SystemIntakeGRBReviewFragment>
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
