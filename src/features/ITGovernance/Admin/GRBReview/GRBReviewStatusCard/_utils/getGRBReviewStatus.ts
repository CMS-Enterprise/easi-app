import {
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewStandardStatusType
} from 'gql/generated/graphql';

import { GRBReviewStatus } from 'types/grbReview';

type GetGRBReviewStatusType = (
  status:
    | SystemIntakeGRBReviewAsyncStatusType
    | SystemIntakeGRBReviewStandardStatusType
    | null
    | undefined,
  grbReviewStartedAt: string | null | undefined
) => GRBReviewStatus;

/**
 * Returns the correct status data for the review type,
 * or NOT_STARTED if set up form has not been submitted yet
 */
const getGRBReviewStatus: GetGRBReviewStatusType = (
  status,
  grbReviewStartedAt
) => {
  if (!status || (!grbReviewStartedAt && status !== 'COMPLETED')) {
    return 'NOT_STARTED';
  }

  return status;
};

export default getGRBReviewStatus;
