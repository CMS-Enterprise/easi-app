import { gql } from '@apollo/client';

import SystemIntakeGRBReviewer from '../ITGov/GRBReview/SystemIntakeGRBReviewer';

import SystemIntakeGRBPresentationLinks from './SystemIntakeGRBPresentationLinks';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBPresentationLinks}
  ${SystemIntakeGRBReviewer}
  fragment SystemIntakeGRBReview on SystemIntake {
    id
    grbDate
    grbReviewAsyncEndDate
    grbReviewAsyncRecordingTime
    grbReviewStartedAt
    grbReviewType

    grbReviewers {
      ...SystemIntakeGRBReviewer
    }

    grbPresentationLinks {
      ...SystemIntakeGRBPresentationLinks
    }

    documents {
      ...SystemIntakeDocumentFragment
    }
  }
`);
