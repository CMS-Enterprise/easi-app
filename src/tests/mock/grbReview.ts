import {
  GetSystemIntakeGRBReviewDocument,
  GetSystemIntakeGRBReviewQuery,
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
